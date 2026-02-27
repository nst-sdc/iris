use axum::{extract::State, Json, http::StatusCode, response::IntoResponse};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::{Event, EventType, EventStatus, EventSpeaker, Message, MessageType};
use crate::middleware::auth::AuthUser;

#[derive(Deserialize)]
pub struct SpeakerInput {
    pub name: String,
    pub role: String,
    pub avatar: Option<String>,
}

#[derive(Deserialize)]
pub struct CreateEventRequest {
    pub title: String,
    pub date: String,
    pub time: String,
    pub end_date: Option<String>,
    pub location: String,
    pub event_type: String,       // "Workshop", "Competition", "Hackathon", "Meetup", "Other"
    pub status: String,           // "Upcoming", "Ongoing", "Completed"
    pub description: String,
    pub image: Option<String>,
    pub featured: Option<bool>,
    pub register_link: Option<String>,
    pub recap_link: Option<String>,
    pub speakers: Option<Vec<SpeakerInput>>,
}

#[derive(Deserialize)]
pub struct UpdateEventRequest {
    pub id: String,
    pub title: Option<String>,
    pub date: Option<String>,
    pub time: Option<String>,
    pub end_date: Option<String>,
    pub location: Option<String>,
    pub event_type: Option<String>,
    pub status: Option<String>,
    pub description: Option<String>,
    pub image: Option<String>,
    pub featured: Option<bool>,
    pub register_link: Option<String>,
    pub recap_link: Option<String>,
    pub speakers: Option<Vec<SpeakerInput>>,
}

#[derive(Deserialize)]
pub struct DeleteEventRequest {
    pub id: String,
}

fn parse_event_type(s: &str) -> EventType {
    match s.to_lowercase().as_str() {
        "workshop" => EventType::Workshop,
        "competition" => EventType::Competition,
        "hackathon" => EventType::Hackathon,
        "meetup" => EventType::Meetup,
        _ => EventType::Other,
    }
}

fn parse_event_status(s: &str) -> EventStatus {
    match s.to_lowercase().as_str() {
        "upcoming" => EventStatus::Upcoming,
        "ongoing" => EventStatus::Ongoing,
        "completed" => EventStatus::Completed,
        _ => EventStatus::Upcoming,
    }
}

fn convert_speakers(speakers: Option<Vec<SpeakerInput>>) -> Option<Vec<EventSpeaker>> {
    speakers.map(|list| {
        list.into_iter().map(|s| EventSpeaker {
            name: s.name,
            role: s.role,
            avatar: s.avatar,
        }).collect()
    })
}

// GET /events - Public: get all events
pub async fn get_all_events(State(state): State<AppState>) -> Json<Vec<Event>> {
    let mut cursor = state.events.find(doc! {}).await.unwrap();
    let mut events = Vec::new();
    while let Some(event) = cursor.try_next().await.unwrap() {
        events.push(event);
    }
    Json(events)
}

// POST /events/admin - Admin: create event
pub async fn create_event(
    State(state): State<AppState>,
    axum::Extension(auth_user): axum::Extension<AuthUser>,
    Json(payload): Json<CreateEventRequest>,
) -> impl IntoResponse {
    let admin_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid user ID"}))),
    };

    let now = chrono::Utc::now().to_rfc3339();

    let event = Event {
        id: None,
        title: payload.title,
        date: payload.date,
        time: payload.time,
        end_date: payload.end_date,
        location: payload.location,
        event_type: parse_event_type(&payload.event_type),
        status: parse_event_status(&payload.status),
        description: payload.description,
        image: payload.image,
        featured: payload.featured.unwrap_or(false),
        register_link: payload.register_link,
        recap_link: payload.recap_link,
        speakers: convert_speakers(payload.speakers),
        created_by: admin_id,
        created_at: now.clone(),
        updated_at: now,
    };

    match state.events.insert_one(event).await {
        Ok(result) => (StatusCode::CREATED, Json(serde_json::json!({"id": result.inserted_id.to_string()}))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}

// PATCH /events/admin - Admin: update event
pub async fn update_event(
    State(state): State<AppState>,
    Json(payload): Json<UpdateEventRequest>,
) -> impl IntoResponse {
    let oid = match ObjectId::parse_str(&payload.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid event ID"}))),
    };

    let mut update_doc = doc! {};
    if let Some(title) = payload.title { update_doc.insert("title", title); }
    if let Some(date) = payload.date { update_doc.insert("date", date); }
    if let Some(time) = payload.time { update_doc.insert("time", time); }
    if let Some(end_date) = payload.end_date { update_doc.insert("end_date", end_date); }
    if let Some(location) = payload.location { update_doc.insert("location", location); }
    if let Some(event_type) = payload.event_type {
        update_doc.insert("event_type", mongodb::bson::to_bson(&parse_event_type(&event_type)).unwrap());
    }
    if let Some(status) = payload.status {
        update_doc.insert("status", mongodb::bson::to_bson(&parse_event_status(&status)).unwrap());
    }
    if let Some(description) = payload.description { update_doc.insert("description", description); }
    if let Some(image) = payload.image { update_doc.insert("image", image); }
    if let Some(featured) = payload.featured { update_doc.insert("featured", featured); }
    if let Some(register_link) = payload.register_link { update_doc.insert("register_link", register_link); }
    if let Some(recap_link) = payload.recap_link { update_doc.insert("recap_link", recap_link); }
    if let Some(speakers) = payload.speakers {
        let speakers_bson = mongodb::bson::to_bson(&convert_speakers(Some(speakers))).unwrap();
        update_doc.insert("speakers", speakers_bson);
    }
    update_doc.insert("updated_at", chrono::Utc::now().to_rfc3339());

    match state.events.update_one(doc! {"_id": oid}, doc! {"$set": update_doc}).await {
        Ok(result) => {
            if result.matched_count == 0 {
                (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "Event not found"})))
            } else {
                (StatusCode::OK, Json(serde_json::json!({"message": "Updated"})))
            }
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}

// DELETE /events/admin - Admin: delete event
pub async fn delete_event(
    State(state): State<AppState>,
    Json(payload): Json<DeleteEventRequest>,
) -> impl IntoResponse {
    let oid = match ObjectId::parse_str(&payload.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid event ID"}))),
    };

    match state.events.delete_one(doc! {"_id": oid}).await {
        Ok(result) => {
            if result.deleted_count == 0 {
                (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "Event not found"})))
            } else {
                (StatusCode::OK, Json(serde_json::json!({"message": "Deleted"})))
            }
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}

// POST /events/propose - Authenticated users: propose an event idea to admins
#[derive(Deserialize)]
pub struct ProposeEventRequest {
    pub title: String,
    pub event_type: String,
    pub description: String,
    pub preferred_date: Option<String>,
}

pub async fn propose_event(
    State(state): State<AppState>,
    axum::Extension(auth_user): axum::Extension<AuthUser>,
    Json(payload): Json<ProposeEventRequest>,
) -> impl IntoResponse {
    let sender_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid user ID"}))),
    };

    // Find all admin users
    let mut cursor = state.users
        .find(doc! { "role": "Admin" })
        .await
        .unwrap();
    let mut admin_ids: Vec<ObjectId> = Vec::new();
    while let Some(user) = cursor.try_next().await.unwrap() {
        if let Some(uid) = user.id {
            admin_ids.push(uid);
        }
    }

    if admin_ids.is_empty() {
        return (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": "No admins found"})));
    }

    let preferred = payload.preferred_date
        .map(|d| format!("\nPreferred Date: {}", d))
        .unwrap_or_default();

    let content = format!(
        "Event Proposal from {}\n\nType: {}\n\n{}{}",
        auth_user.username, payload.event_type, payload.description, preferred
    );

    let message = Message {
        id: None,
        sender_id,
        recipient_ids: Some(admin_ids),
        project_id: None,
        subject: format!("[Event Proposal] {}", payload.title),
        content,
        message_type: MessageType::Individual,
        created_at: chrono::Utc::now().to_rfc3339(),
        read: false,
    };

    match state.messages.insert_one(message).await {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"message": "Event proposal submitted successfully! Admins will review your idea."}))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}
