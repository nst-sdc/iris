use axum::{extract::State, Json};
use futures_util::stream::TryStreamExt;
use mongodb::bson::doc;
use serde::Deserialize;

use crate::{db::AppState, models::{User, Role}};

#[derive(Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub full_name: String,
    pub email: String,
    pub password_hash: String,
    pub role: String, // "Admin" or "Member"
}

#[derive(Deserialize)]
pub struct UpdateRoleRequest {
    pub user_id: String,
    pub role: String, // "Admin" or "Member"
}

#[derive(Deserialize)]
pub struct DeleteUserRequest {
    pub user_id: String,
}

// Get all users (admin)
pub async fn get_users(State(state): State<AppState>) -> Json<Vec<User>> {
    let mut cursor = state.users.find(doc! {}).await.unwrap();
    let mut users = Vec::new();

    while let Some(user) = cursor.try_next().await.unwrap() {
        users.push(user);
    }

    Json(users)
}

// Get all members only (admin)
pub async fn get_members(State(state): State<AppState>) -> Json<Vec<User>> {
    let mut cursor = state.users
        .find(doc! {})
        .await
        .unwrap();
    
    let mut members = Vec::new();
    while let Some(user) = cursor.try_next().await.unwrap() {
        members.push(user);
    }

    Json(members)
}

// Add user/member (admin)
pub async fn add_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserRequest>,
) -> Json<String> {
    let role = match payload.role.as_str() {
        "Admin" => Role::Admin,
        _ => Role::Member,
    };

    let new_user = User {
        id: None,
        username: payload.username,
        full_name: payload.full_name,
        email: payload.email,
        password_hash: payload.password_hash,
        role,
        coins: 0,
        project_ids: Some(Vec::new()),
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
    };

    state.users.insert_one(new_user).await.unwrap();
    Json("User added successfully".to_string())
}

// Update user role (admin)
pub async fn update_user_role(
    State(state): State<AppState>,
    Json(payload): Json<UpdateRoleRequest>,
) -> Json<String> {
    let user_id = mongodb::bson::oid::ObjectId::parse_str(&payload.user_id).unwrap();
    
    let role = match payload.role.as_str() {
        "Admin" => "Admin",
        _ => "Member",
    };

    state.users
        .update_one(
            doc! { "_id": user_id },
            doc! { 
                "$set": { 
                    "role": role,
                    "updated_at": chrono::Utc::now().to_rfc3339()
                }
            },
        )
        .await
        .unwrap();

    Json("User role updated successfully".to_string())
}

// Delete/Remove user (admin)
pub async fn delete_user(
    State(state): State<AppState>,
    Json(payload): Json<DeleteUserRequest>,
) -> Json<String> {
    let user_id = mongodb::bson::oid::ObjectId::parse_str(&payload.user_id).unwrap();

    // Remove user from all projects
    state.projects
        .update_many(
            doc! {},
            doc! { "$pull": { "member_ids": user_id } },
        )
        .await
        .unwrap();

    // Delete the user
    state.users
        .delete_one(doc! { "_id": user_id })
        .await
        .unwrap();

    Json("User deleted successfully".to_string())
}