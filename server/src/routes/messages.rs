use axum::{extract::State, Json};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::Message;

#[derive(Deserialize)]
pub struct SendMessageRequest {
    pub sender_id: String,
    pub recipient_ids: Vec<String>,
    pub subject: String,
    pub content: String,
    pub is_group_message: bool,
}

#[derive(Deserialize)]
pub struct GetMessagesRequest {
    pub user_id: String,
}

// Send message (admin to individual or group)
pub async fn send_message(
    State(state): State<AppState>,
    Json(payload): Json<SendMessageRequest>,
) -> Json<String> {
    let sender_id = ObjectId::parse_str(&payload.sender_id).unwrap();
    let recipient_ids: Vec<ObjectId> = payload.recipient_ids
        .iter()
        .map(|id| ObjectId::parse_str(id).unwrap())
        .collect();

    let message = Message {
        id: None,
        sender_id,
        recipient_ids: Some(recipient_ids),
        subject: payload.subject,
        content: payload.content,
        is_group_message: payload.is_group_message,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    state.messages.insert_one(message).await.unwrap();

    Json("Message sent successfully".to_string())
}

// Get messages for a user
pub async fn get_user_messages(
    State(state): State<AppState>,
    Json(payload): Json<GetMessagesRequest>,
) -> Json<Vec<Message>> {
    let user_id = ObjectId::parse_str(&payload.user_id).unwrap();
    
    let mut cursor = state.messages
        .find(doc! { "recipient_ids": user_id })
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
