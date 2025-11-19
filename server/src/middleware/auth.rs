use axum::{
    extract::{Request, State},
    http::{StatusCode, header},
    middleware::Next,
    response::{IntoResponse, Response},
    Json,
};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use std::env;

use crate::db::AppState;
use crate::models::user::Role;

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub username: String,
    pub email: String,
    pub role: String,
    pub exp: usize,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub id: String,
    pub username: String,
    pub email: String,
    pub role: Role,
}

fn get_jwt_secret() -> String {
    env::var("JWT_SECRET").unwrap_or_else(|_| "your-secret-key-change-in-production".to_string())
}

pub fn create_jwt(user_id: &str, username: &str, email: &str, role: &Role) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::days(7))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_string(),
        username: username.to_string(),
        email: email.to_string(),
        role: format!("{:?}", role),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(get_jwt_secret().as_bytes()),
    )
}

pub fn verify_jwt(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let validation = Validation::default();
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(get_jwt_secret().as_bytes()),
        &validation,
    )?;
    Ok(token_data.claims)
}

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Response {
    let uri = request.uri().clone();
    let method = request.method().clone();
    println!("=== AUTH MIDDLEWARE: {} {} ===", method, uri);
    
    let auth_header = request
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    let token = if let Some(auth_header) = auth_header {
        if auth_header.starts_with("Bearer ") {
            Some(&auth_header[7..])
        } else {
            None
        }
    } else {
        None
    };

    let token = match token {
        Some(token) => token,
        None => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({
                    "error": "Missing authorization token",
                    "message": "Please provide a valid JWT token in Authorization header"
                }))
            ).into_response();
        }
    };

    let claims = match verify_jwt(token) {
        Ok(claims) => claims,
        Err(_) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({
                    "error": "Invalid or expired token",
                    "message": "Please login again to get a new token"
                }))
            ).into_response();
        }
    };

    // Verify user still exists in database
    let user_id = match ObjectId::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({
                    "error": "Invalid user ID in token"
                }))
            ).into_response();
        }
    };

    let user = match state.users
        .find_one(mongodb::bson::doc! { "_id": user_id })
        .await
    {
        Ok(Some(user)) => user,
        Ok(None) => {
            return (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({
                    "error": "User not found",
                    "message": "User associated with this token no longer exists"
                }))
            ).into_response();
        }
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Database error"
                }))
            ).into_response();
        }
    };

    // Add user info to request extensions
    let auth_user = AuthUser {
        id: claims.sub,
        username: user.username,
        email: user.email,
        role: user.role,
    };

    request.extensions_mut().insert(auth_user);
    next.run(request).await
}

pub async fn admin_middleware(
    request: Request,
    next: Next,
) -> Response {
    let auth_user = request.extensions().get::<AuthUser>().cloned();

    match auth_user {
        Some(user) => {
            match user.role {
                Role::Admin => next.run(request).await,
                Role::Member => {
                    (
                        StatusCode::FORBIDDEN,
                        Json(serde_json::json!({
                            "error": "Insufficient permissions",
                            "message": "This endpoint requires admin privileges"
                        }))
                    ).into_response()
                }
            }
        }
        None => {
            (
                StatusCode::UNAUTHORIZED,
                Json(serde_json::json!({
                    "error": "Authentication required"
                }))
            ).into_response()
        }
    }
}
