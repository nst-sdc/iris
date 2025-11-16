use axum::{extract::State, Json};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::{Project, ProjectStatus};

#[derive(Deserialize)]
pub struct CreateProjectRequest {
    pub name: String,
    pub description: String,
    pub created_by: String, // ObjectId as string
}

#[derive(Deserialize)]
pub struct AssignMemberRequest {
    pub project_id: String,
    pub member_id: String,
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
    let new_project = Project {
        id: None,
        name: payload.name,
        description: payload.description,
        status: ProjectStatus::Active,
        member_ids: Some(Vec::new()),
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
