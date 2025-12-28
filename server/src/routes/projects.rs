use axum::{extract::State, Json, Extension, http::StatusCode, response::IntoResponse, body::Bytes};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::{Project, ProjectStatus, ProjectFile};
use crate::middleware::auth::AuthUser;

#[derive(Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: String,
    pub created_by: String, // ObjectId as string
    pub status: Option<String>,
    pub github_link: Option<String>,
    pub project_lead_id: Option<String>, // ObjectId as string
}

#[derive(Deserialize)]
pub struct AssignMemberRequest {
    pub project_id: String,
    pub member_id: String,
}

#[derive(Deserialize)]
pub struct SetProjectLeadRequest {
    pub project_id: String,
    pub member_id: String,
}

#[derive(Deserialize)]
pub struct UpdateProjectRequest {
    pub project_id: String,
    pub name: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub github_link: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteProjectRequest {
    pub project_id: String,
}

// Get all projects (admin)
pub async fn get_all_projects(State(state): State<AppState>) -> Json<Vec<Project>> {
    let mut cursor = state.projects.find(doc! {}).await.unwrap();
    let mut projects = Vec::new();

    while let Some(project) = cursor.try_next().await.unwrap() {
        projects.push(project);
    }

    Json(projects)
}

// Get projects by user (member dashboard)
pub async fn get_user_projects(
    State(state): State<AppState>,
    Json(user_id): Json<String>,
) -> Json<Vec<Project>> {
    let oid = ObjectId::parse_str(&user_id).unwrap();
    
    let mut cursor = state.projects
        .find(doc! { "member_ids": oid })
        .await
        .unwrap();
    
    let mut projects = Vec::new();
    while let Some(project) = cursor.try_next().await.unwrap() {
        projects.push(project);
    }

    Json(projects)
}

// Create new project (admin)
pub async fn create_project(
    State(state): State<AppState>,
    Json(payload): Json<CreateProjectRequest>,
) -> Json<String> {
    let status = match payload.status.as_deref() {
        Some("completed") => ProjectStatus::Completed,
        Some("onhold") => ProjectStatus::OnHold,
        _ => ProjectStatus::Active,
    };

    let project_lead_id = payload.project_lead_id
        .and_then(|id| ObjectId::parse_str(&id).ok());

    let new_project = Project {
        id: None,
        name: payload.name,
        description: payload.description,
        status,
        member_ids: Some(Vec::new()),
        project_lead_id,
        github_link: payload.github_link,
        files: Some(Vec::new()),
        created_by: ObjectId::parse_str(&payload.created_by).unwrap(),
        created_at: chrono::Utc::now().to_rfc3339(),
        updated_at: chrono::Utc::now().to_rfc3339(),
    };

    state.projects.insert_one(new_project).await.unwrap();
    Json("Project created successfully".to_string())
}

// Assign member to project (admin)
pub async fn assign_member_to_project(
    State(state): State<AppState>,
    Json(payload): Json<AssignMemberRequest>,
) -> Json<String> {
    let project_id = ObjectId::parse_str(&payload.project_id).unwrap();
    let member_id = ObjectId::parse_str(&payload.member_id).unwrap();

    // Add member to project
    state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! { 
                "$addToSet": { "member_ids": member_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
        .unwrap();

    // Add project to user
    state.users
        .update_one(
            doc! { "_id": member_id },
            doc! { 
                "$addToSet": { "project_ids": project_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
        .unwrap();

    Json("Member assigned to project successfully".to_string())
}

// Remove member from project (admin)
pub async fn remove_member_from_project(
    State(state): State<AppState>,
    Json(payload): Json<AssignMemberRequest>,
) -> Json<String> {
    let project_id = ObjectId::parse_str(&payload.project_id).unwrap();
    let member_id = ObjectId::parse_str(&payload.member_id).unwrap();

    // Remove member from project
    state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! { 
                "$pull": { "member_ids": member_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
        .unwrap();

    // Remove project from user
    state.users
        .update_one(
            doc! { "_id": member_id },
            doc! { 
                "$pull": { "project_ids": project_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
        .unwrap();

    Json("Member removed from project successfully".to_string())
}

// Delete project (admin)
pub async fn delete_project(
    State(state): State<AppState>,
    Json(payload): Json<DeleteProjectRequest>,
) -> Json<String> {
    let oid = ObjectId::parse_str(&payload.project_id).unwrap();
    
    // Delete project
    state.projects.delete_one(doc! { "_id": oid }).await.unwrap();
    
    // Remove project from all users
    state.users
        .update_many(
            doc! {},
            doc! { "$pull": { "project_ids": oid } },
        )
        .await
        .unwrap();

    Json("Project deleted successfully".to_string())
}

// Set project lead (admin)
pub async fn set_project_lead(
    State(state): State<AppState>,
    Json(payload): Json<SetProjectLeadRequest>,
) -> Json<String> {
    let project_id = ObjectId::parse_str(&payload.project_id).unwrap();
    let member_id = ObjectId::parse_str(&payload.member_id).unwrap();

    state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! { 
                "$set": { 
                    "project_lead_id": member_id,
                    "updated_at": chrono::Utc::now().to_rfc3339()
                }
            },
        )
        .await
        .unwrap();

    Json("Project lead assigned successfully".to_string())
}

// Update project (admin)
pub async fn update_project(
    State(state): State<AppState>,
    Json(payload): Json<UpdateProjectRequest>,
) -> Json<String> {
    let project_id = ObjectId::parse_str(&payload.project_id).unwrap();
    let mut update_doc = doc! {};

    if let Some(name) = payload.name {
        update_doc.insert("name", name);
    }
    if let Some(description) = payload.description {
        update_doc.insert("description", description);
    }
    if let Some(status) = payload.status {
        let status_str = match status.as_str() {
            "completed" => "Completed",
            "onhold" => "OnHold",
            _ => "Active",
        };
        update_doc.insert("status", status_str);
    }
    if let Some(github_link) = payload.github_link {
        update_doc.insert("github_link", github_link);
    }
    update_doc.insert("updated_at", chrono::Utc::now().to_rfc3339());

    state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! { "$set": update_doc },
        )
        .await
        .unwrap();

    Json("Project updated successfully".to_string())
}

// Remove member from project (project lead or admin)
pub async fn remove_member_by_lead(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    body: Bytes,
) -> impl IntoResponse {
    println!("=== Remove Member Request ===");
    println!("Auth User: {:?}", auth_user);
    println!("Raw body: {:?}", String::from_utf8_lossy(&body));
    
    let payload: AssignMemberRequest = match serde_json::from_slice(&body) {
        Ok(p) => p,
        Err(e) => {
            println!("Failed to parse JSON: {:?}", e);
            return (StatusCode::BAD_REQUEST, Json(format!("Invalid JSON: {}", e))).into_response();
        }
    };
    
    println!("Parsed payload: project_id={}, member_id={}", payload.project_id, payload.member_id);
    
    let project_id = match ObjectId::parse_str(&payload.project_id) {
        Ok(id) => id,
        Err(e) => {
            println!("Error parsing project_id: {:?}", e);
            return (StatusCode::BAD_REQUEST, Json("Invalid project ID".to_string())).into_response();
        }
    };
    
    let member_id = match ObjectId::parse_str(&payload.member_id) {
        Ok(id) => id,
        Err(e) => {
            println!("Error parsing member_id: {:?}", e);
            return (StatusCode::BAD_REQUEST, Json("Invalid member ID".to_string())).into_response();
        }
    };
    
    let auth_user_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(id) => id,
        Err(e) => {
            println!("Error parsing auth_user_id: {:?}", e);
            return (StatusCode::BAD_REQUEST, Json("Invalid user ID".to_string())).into_response();
        }
    };

    println!("Parsed IDs - Project: {:?}, Member: {:?}, AuthUser: {:?}", project_id, member_id, auth_user_id);

    // Get the project to check if user is the project lead
    let project = match state.projects.find_one(doc! { "_id": project_id }).await {
        Ok(Some(p)) => {
            println!("Found project: {:?}", p.name);
            p
        },
        Ok(None) => {
            println!("Project not found");
            return (StatusCode::NOT_FOUND, Json("Project not found".to_string())).into_response();
        },
        Err(e) => {
            println!("Database error: {:?}", e);
            return (StatusCode::INTERNAL_SERVER_ERROR, Json("Database error".to_string())).into_response();
        }
    };

    // Check if user is admin or project lead
    let is_admin = auth_user.role == crate::models::user::Role::Admin;
    let is_project_lead = project.project_lead_id == Some(auth_user_id);

    println!("Is admin: {}, Is project lead: {}", is_admin, is_project_lead);
    println!("Project lead ID: {:?}", project.project_lead_id);

    if !is_admin && !is_project_lead {
        println!("Permission denied");
        return (StatusCode::FORBIDDEN, Json("Only project lead or admin can remove members".to_string())).into_response();
    }

    // Remove member from project
    if let Err(e) = state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! { 
                "$pull": { "member_ids": member_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
    {
        println!("Failed to update project: {:?}", e);
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to update project".to_string())).into_response();
    }

    // Remove project from user
    if let Err(e) = state.users
        .update_one(
            doc! { "_id": member_id },
            doc! { 
                "$pull": { "project_ids": project_id },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
    {
        println!("Failed to update user: {:?}", e);
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to update user".to_string())).into_response();
    }

    println!("Member removed successfully");
    (StatusCode::OK, Json("Member removed from project successfully".to_string())).into_response()
}

#[derive(Deserialize)]
pub struct AddFileRequest {
    pub project_id: String,
    pub name: String,
    pub url: String,
    pub file_type: String,
    pub size: i64,
}

#[derive(Deserialize)]
pub struct DeleteFileRequest {
    pub project_id: String,
    pub file_id: String,
}

// Add file to project (project lead only)
pub async fn add_file_to_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(payload): Json<AddFileRequest>,
) -> impl IntoResponse {
    let project_id = match ObjectId::parse_str(&payload.project_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json("Invalid project ID".to_string())).into_response(),
    };

    let auth_user_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json("Invalid user ID".to_string())).into_response(),
    };

    // Get the project to check if user is the project lead
    let project = match state.projects.find_one(doc! { "_id": project_id }).await {
        Ok(Some(p)) => p,
        Ok(None) => return (StatusCode::NOT_FOUND, Json("Project not found".to_string())).into_response(),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("Database error".to_string())).into_response(),
    };

    // Check if user is admin or project lead
    let is_admin = auth_user.role == crate::models::user::Role::Admin;
    let is_project_lead = project.project_lead_id == Some(auth_user_id);

    if !is_admin && !is_project_lead {
        return (StatusCode::FORBIDDEN, Json("Only project lead or admin can upload files".to_string())).into_response();
    }

    // Create new file entry
    let new_file = ProjectFile {
        id: ObjectId::new(),
        name: payload.name,
        url: payload.url,
        file_type: payload.file_type,
        size: payload.size,
        uploaded_by: auth_user_id,
        uploaded_at: chrono::Utc::now().to_rfc3339(),
    };

    // Add file to project
    if let Err(_) = state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! {
                "$push": { "files": mongodb::bson::to_document(&new_file).unwrap() },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
    {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to add file".to_string())).into_response();
    }

    (StatusCode::OK, Json("File added successfully".to_string())).into_response()
}

// Delete file from project (project lead only)
pub async fn delete_file_from_project(
    State(state): State<AppState>,
    Extension(auth_user): Extension<AuthUser>,
    Json(payload): Json<DeleteFileRequest>,
) -> impl IntoResponse {
    let project_id = match ObjectId::parse_str(&payload.project_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json("Invalid project ID".to_string())).into_response(),
    };

    let file_id = match ObjectId::parse_str(&payload.file_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json("Invalid file ID".to_string())).into_response(),
    };

    let auth_user_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json("Invalid user ID".to_string())).into_response(),
    };

    // Get the project to check if user is the project lead
    let project = match state.projects.find_one(doc! { "_id": project_id }).await {
        Ok(Some(p)) => p,
        Ok(None) => return (StatusCode::NOT_FOUND, Json("Project not found".to_string())).into_response(),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, Json("Database error".to_string())).into_response(),
    };

    // Check if user is admin or project lead
    let is_admin = auth_user.role == crate::models::user::Role::Admin;
    let is_project_lead = project.project_lead_id == Some(auth_user_id);

    if !is_admin && !is_project_lead {
        return (StatusCode::FORBIDDEN, Json("Only project lead or admin can delete files".to_string())).into_response();
    }

    // Remove file from project
    if let Err(_) = state.projects
        .update_one(
            doc! { "_id": project_id },
            doc! {
                "$pull": { "files": { "_id": file_id } },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
    {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json("Failed to delete file".to_string())).into_response();
    }

    (StatusCode::OK, Json("File deleted successfully".to_string())).into_response()
}
