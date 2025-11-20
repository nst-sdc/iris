use axum::{extract::State, Json, Extension};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::{Message, MessageType};
use crate::middleware::auth::AuthUser;
use crate::models::user::Role;

#[derive(Deserialize)]
pub struct SendMessageRequest {
    pub recipient_ids: Option<Vec<String>>,  // For individual messages
    pub project_id: Option<String>,          // For project team messages
    pub subject: String,
    pub content: String,
    pub message_type: String,  // "individual", "project_team", or "broadcast"
}

#[derive(Deserialize)]
pub struct GetMessagesRequest {
    pub user_id: String,
}

// Send message (admin to individual, project team, or broadcast)
pub async fn send_message(
    State(state): State<AppState>,
    Extension(user): Extension<AuthUser>,
    Json(payload): Json<SendMessageRequest>,
) -> Result<Json<String>, Json<String>> {
    let sender_id = ObjectId::parse_str(&user.id).unwrap();
    
    // Check permissions based on message type
    match payload.message_type.as_str() {
        "project_team" | "broadcast" => {
            // Only admins can send project team or broadcast messages
            if user.role != Role::Admin {
                return Err(Json("Only admins can send project team or broadcast messages".to_string()));
            }
        },
        "individual" => {
            // Anyone can send individual messages
        },
        _ => {
            return Err(Json("Invalid message type".to_string()));
        }
    }
    
    // Determine message type and recipients
    let (message_type, recipient_ids, project_id) = match payload.message_type.as_str() {
        "individual" => {
            // Individual message - use provided recipient_ids
            let recipients: Vec<ObjectId> = payload.recipient_ids
                .unwrap_or_default()
                .iter()
                .filter_map(|id| ObjectId::parse_str(id).ok())
                .collect();
            (MessageType::Individual, Some(recipients), None)
        },
        "project_team" => {
            // Project team message - get all members from project
            let project_id_obj = ObjectId::parse_str(payload.project_id.as_ref().unwrap()).unwrap();
            let project = state.projects
                .find_one(doc! { "_id": project_id_obj })
                .await
                .unwrap()
                .unwrap();
            
            let recipients = project.member_ids.unwrap_or_default();
            (MessageType::ProjectTeam, Some(recipients), Some(project_id_obj))
        },
        "broadcast" => {
            // Broadcast message - get all users
            let mut cursor = state.users.find(doc! {}).await.unwrap();
            let mut recipients = Vec::new();
            while let Some(user) = cursor.try_next().await.unwrap() {
                recipients.push(user.id.unwrap());
            }
            (MessageType::Broadcast, Some(recipients), None)
        },
        _ => {
            return Err(Json("Invalid message type".to_string()));
        }
    };

    let message = Message {
        id: None,
        sender_id,
        recipient_ids,
        project_id,
        subject: payload.subject,
        content: payload.content,
        message_type,
        created_at: chrono::Utc::now().to_rfc3339(),
        read: false,
    };

    state.messages.insert_one(message).await.unwrap();

    Ok(Json("Message sent successfully".to_string()))
}

// Get messages for a user
pub async fn get_user_messages(
    State(state): State<AppState>,
    Json(payload): Json<GetMessagesRequest>,
) -> Json<Vec<Message>> {
    let user_id = ObjectId::parse_str(&payload.user_id).unwrap();
    
    let mut cursor = state.messages
        .find(doc! { "recipient_ids": user_id })
        .sort(doc! { "created_at": -1 })
        .await
        .unwrap();
    
    let mut messages = Vec::new();
    while let Some(message) = cursor.try_next().await.unwrap() {
        messages.push(message);
    }

    Json(messages)
}

// Get all messages (admin)
pub async fn get_all_messages(State(state): State<AppState>) -> Json<Vec<Message>> {
    let mut cursor = state.messages.find(doc! {}).await.unwrap();
    let mut messages = Vec::new();

    while let Some(message) = cursor.try_next().await.unwrap() {
        messages.push(message);
    }

    Json(messages)
}
