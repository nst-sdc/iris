use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    Extension,
};
use mongodb::bson::{doc, oid::ObjectId};
use serde_json::{json, Value};
use chrono::Utc;
use std::str::FromStr;
use futures_util::stream::TryStreamExt;

use crate::models::{ProjectJoinRequest, JoinRequestStatus, CreateJoinRequest, UpdateJoinRequestStatus};
use crate::db::AppState;
use crate::middleware::auth::AuthUser;

// Create join request
pub async fn create_join_request(
    Extension(auth_user): Extension<AuthUser>,
    State(state): State<AppState>,
    Json(payload): Json<CreateJoinRequest>,
) -> Result<(StatusCode, Json<Value>), (StatusCode, Json<Value>)> {
    let user_id = ObjectId::from_str(&auth_user.id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))))?;

    let project_id = ObjectId::from_str(&payload.project_id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid project ID"}))))?;

    // Check if project exists
    let project = state.projects
        .find_one(doc! {"_id": project_id})
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(json!({"error": "Project not found"}))))?;

    // Check if user is already a member
    if let Some(members) = &project.member_ids {
        if members.contains(&user_id) {
            return Err((StatusCode::BAD_REQUEST, Json(json!({"error": "You are already a member of this project"}))));
        }
    }

    // Check if there's already a pending request
    let existing_request = state.project_join_requests
        .find_one(doc! {
            "project_id": project_id,
            "user_id": user_id,
            "status": "pending"
        })
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?;

    if existing_request.is_some() {
        return Err((StatusCode::BAD_REQUEST, Json(json!({"error": "You already have a pending request for this project"}))));
    }

    // Create the join request
    let new_request = ProjectJoinRequest {
        id: None,
        project_id,
        user_id,
        message: payload.message,
        status: JoinRequestStatus::Pending,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };

    state.project_join_requests
        .insert_one(&new_request)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Failed to create join request"}))))?;

    Ok((StatusCode::CREATED, Json(json!({"message": "Join request sent successfully"}))))
}

// Get join requests for a project (only for project lead or admin)
pub async fn get_project_join_requests(
    Extension(auth_user): Extension<AuthUser>,
    State(state): State<AppState>,
    Path(project_id): Path<String>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    let user_id = ObjectId::from_str(&auth_user.id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))))?;

    let project_oid = ObjectId::from_str(&project_id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid project ID"}))))?;

    // Get project and verify user is project lead or admin
    let project = state.projects
        .find_one(doc! {"_id": project_oid})
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(json!({"error": "Project not found"}))))?;

    // Check if user is project lead
    let is_lead = project.project_lead_id.as_ref().map(|lead_id| lead_id == &user_id).unwrap_or(false);
    
    // Check if user is admin
    let is_admin = matches!(auth_user.role, crate::models::Role::Admin);

    if !is_lead && !is_admin {
        return Err((StatusCode::FORBIDDEN, Json(json!({"error": "You don't have permission to view join requests for this project"}))));
    }

    // Get all pending join requests for this project with user details
    let mut cursor = state.project_join_requests
        .find(doc! {"project_id": project_oid, "status": "pending"})
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?;

    let mut requests_with_users = Vec::new();
    
    while let Some(result) = cursor.try_next().await.map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Failed to fetch requests"}))))? {
        // Get user details
        let user = state.users
            .find_one(doc! {"_id": result.user_id})
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?;

        if let Some(user) = user {
            requests_with_users.push(json!({
                "_id": result.id,
                "project_id": result.project_id,
                "user_id": result.user_id,
                "message": result.message,
                "status": result.status,
                "created_at": result.created_at,
                "user": {
                    "_id": user.id,
                    "username": user.username,
                    "full_name": user.full_name,
                    "email": user.email,
                }
            }));
        }
    }

    Ok(Json(json!(requests_with_users)))
}

// Update join request status (approve/reject) - only for project lead or admin
pub async fn update_join_request_status(
    Extension(auth_user): Extension<AuthUser>,
    State(state): State<AppState>,
    Path(request_id): Path<String>,
    Json(payload): Json<UpdateJoinRequestStatus>,
) -> Result<Json<Value>, (StatusCode, Json<Value>)> {
    let user_id = ObjectId::from_str(&auth_user.id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid user ID"}))))?;

    let request_oid = ObjectId::from_str(&request_id)
        .map_err(|_| (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid request ID"}))))?;

    // Get the join request
    let join_request = state.project_join_requests
        .find_one(doc! {"_id": request_oid})
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(json!({"error": "Join request not found"}))))?;

    // Get project and verify user is project lead or admin
    let project = state.projects
        .find_one(doc! {"_id": join_request.project_id})
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Database error"}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(json!({"error": "Project not found"}))))?;

    // Check if user is project lead
    let is_lead = project.project_lead_id.as_ref().map(|lead_id| lead_id == &user_id).unwrap_or(false);
    
    // Check if user is admin
    let is_admin = matches!(auth_user.role, crate::models::Role::Admin);

    if !is_lead && !is_admin {
        return Err((StatusCode::FORBIDDEN, Json(json!({"error": "You don't have permission to manage join requests for this project"}))));
    }

    let new_status = match payload.status.as_str() {
        "approved" => JoinRequestStatus::Approved,
        "rejected" => JoinRequestStatus::Rejected,
        _ => return Err((StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid status. Use 'approved' or 'rejected'"})))),
    };

    // Update the request status
    let now = mongodb::bson::DateTime::from_millis(Utc::now().timestamp_millis());
    state.project_join_requests
        .update_one(
            doc! {"_id": request_oid},
            doc! {"$set": {"status": payload.status.to_lowercase(), "updated_at": now}}
        )
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Failed to update request"}))))?;

    // If approved, add user to project
    if matches!(new_status, JoinRequestStatus::Approved) {
        // Add user to project's member_ids
        state.projects
            .update_one(
                doc! {"_id": join_request.project_id},
                doc! {"$addToSet": {"member_ids": join_request.user_id}}
            )
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Failed to add member to project"}))))?;

        // Add project to user's project_ids
        state.users
            .update_one(
                doc! {"_id": join_request.user_id},
                doc! {"$addToSet": {"project_ids": join_request.project_id}}
            )
            .await
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({"error": "Failed to update user projects"}))))?;
    }

    Ok(Json(json!({"message": format!("Request {} successfully", payload.status)})))
}
