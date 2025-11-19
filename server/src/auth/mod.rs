use axum::{
    extract::{Query, State},
    response::{IntoResponse, Redirect, Response},
    http::StatusCode,
    Json,
};
use oauth2::{
    AuthorizationCode, AuthUrl, ClientId, ClientSecret, CsrfToken, RedirectUrl,
    Scope, TokenResponse, TokenUrl,
    basic::BasicClient,
    reqwest::async_http_client,
};
use serde::{Deserialize, Serialize};
use std::env;

use crate::db::AppState;
use crate::models::user::{User, Role};
use crate::middleware::create_jwt;

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct AuthRequest {
    pub code: String,
    pub state: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitHubUser {
    pub login: String,
    pub id: u64,
    pub email: Option<String>,
    pub name: Option<String>,
}

fn get_oauth_client() -> BasicClient {
    let github_client_id = env::var("GITHUB_CLIENT_ID")
        .unwrap_or_else(|_| "your_github_client_id".to_string());
    let github_client_secret = env::var("GITHUB_CLIENT_SECRET")
        .unwrap_or_else(|_| "your_github_client_secret".to_string());
    let redirect_url = env::var("GITHUB_REDIRECT_URL")
        .unwrap_or_else(|_| "http://localhost:5657/auth/github/callback".to_string());

    BasicClient::new(
        ClientId::new(github_client_id),
        Some(ClientSecret::new(github_client_secret)),
        AuthUrl::new("https://github.com/login/oauth/authorize".to_string()).unwrap(),
        Some(TokenUrl::new("https://github.com/login/oauth/access_token".to_string()).unwrap()),
    )
    .set_redirect_uri(RedirectUrl::new(redirect_url).unwrap())
}

pub async fn github_login() -> impl IntoResponse {
    let client = get_oauth_client();
    
    let (auth_url, _csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("user:email".to_string()))
        .url();

    Redirect::to(auth_url.as_str())
}

pub async fn github_callback(
    Query(query): Query<AuthRequest>,
    State(state): State<AppState>,
) -> Response {
    let client = get_oauth_client();

    let token_result = client
        .exchange_code(AuthorizationCode::new(query.code))
        .request_async(async_http_client)
        .await;

    let token = match token_result {
        Ok(token) => token,
        Err(e) => {
            eprintln!("Failed to exchange code: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to exchange authorization code"
                }))
            ).into_response();
        }
    };

    let client = reqwest::Client::new();
    let user_info: GitHubUser = match client
        .get("https://api.github.com/user")
        .header("Authorization", format!("Bearer {}", token.access_token().secret()))
        .header("User-Agent", "iris-server")
        .send()
        .await
    {
        Ok(response) => match response.json().await {
            Ok(info) => info,
            Err(e) => {
                eprintln!("Failed to parse user info: {:?}", e);
                return (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(serde_json::json!({
                        "error": "Failed to parse GitHub user info"
                    }))
                ).into_response();
            }
        },
        Err(e) => {
            eprintln!("Failed to fetch user info: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to fetch GitHub user info"
                }))
            ).into_response();
        }
    };

    let email = if user_info.email.is_none() {
        let emails: Vec<serde_json::Value> = match client
            .get("https://api.github.com/user/emails")
            .header("Authorization", format!("Bearer {}", token.access_token().secret()))
            .header("User-Agent", "iris-server")
            .send()
            .await
        {
            Ok(response) => response.json().await.unwrap_or_default(),
            Err(_) => Vec::new(),
        };

        emails
            .iter()
            .find(|e| e["primary"].as_bool().unwrap_or(false))
            .and_then(|e| e["email"].as_str().map(String::from))
            .or_else(|| emails.first().and_then(|e| e["email"].as_str().map(String::from)))
    } else {
        user_info.email
    };

    let email = email.unwrap_or_else(|| format!("{}@github.com", user_info.login));

    let existing_user = state.users
        .find_one(mongodb::bson::doc! { "email": &email })
        .await;

    let user = match existing_user {
        Ok(Some(user)) => user,
        Ok(None) => {
            let new_user = User {
                id: None,
                username: user_info.login.clone(),
                full_name: user_info.name.unwrap_or_else(|| user_info.login.clone()),
                email: email.clone(),
                password_hash: String::new(),
                role: Role::Member,
                coins: 0,
                project_ids: Some(Vec::new()),
                created_at: chrono::Utc::now().to_rfc3339(),
                updated_at: chrono::Utc::now().to_rfc3339(),
            };

            match state.users.insert_one(&new_user).await {
                Ok(result) => {
                    let mut created_user = new_user;
                    created_user.id = Some(result.inserted_id.as_object_id().unwrap());
                    created_user
                }
                Err(e) => {
                    eprintln!("Failed to create user: {:?}", e);
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(serde_json::json!({
                            "error": "Failed to create user"
                        }))
                    ).into_response();
                }
            }
        }
        Err(e) => {
            eprintln!("Database error: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Database error"
                }))
            ).into_response();
        }
    };

    let jwt_token = match create_jwt(
        &user.id.unwrap().to_hex(),
        &user.username,
        &user.email,
        &user.role,
    ) {
        Ok(token) => token,
        Err(e) => {
            eprintln!("Failed to create JWT: {:?}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to create authentication token"
                }))
            ).into_response();
        }
    };

    (
        StatusCode::OK,
        Json(serde_json::json!({
            "success": true,
            "message": "Successfully authenticated",
            "user": {
                "id": user.id.map(|id| id.to_hex()),
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": format!("{:?}", user.role),
                "coins": user.coins,
            },
            "token": jwt_token,
        }))
    ).into_response()
}

// Test login endpoint (for development only)
#[derive(Debug, Deserialize)]
pub struct TestLoginRequest {
    pub user_id: String,
}

pub async fn test_login(
    State(state): State<AppState>,
    Json(payload): Json<TestLoginRequest>,
) -> Response {
    use mongodb::bson::oid::ObjectId;
    use mongodb::bson::doc;

    let user_id = match ObjectId::parse_str(&payload.user_id) {
        Ok(id) => id,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                Json(serde_json::json!({
                    "error": "Invalid user ID format"
                }))
            ).into_response();
        }
    };

    let user = match state.users.find_one(doc! { "_id": user_id }).await {
        Ok(Some(user)) => user,
        _ => {
            return (
                StatusCode::NOT_FOUND,
                Json(serde_json::json!({
                    "error": "User not found"
                }))
            ).into_response();
        }
    };

    let jwt_token = match create_jwt(
        &user.id.unwrap().to_hex(),
        &user.username,
        &user.email,
        &user.role
    ) {
        Ok(token) => token,
        Err(_) => {
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to create token"
                }))
            ).into_response();
        }
    };

    (
        StatusCode::OK,
        Json(serde_json::json!({
            "success": true,
            "token": jwt_token,
            "user": {
                "id": user.id.map(|id| id.to_hex()),
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "role": format!("{:?}", user.role),
                "coins": user.coins,
            }
        }))
    ).into_response()
}
