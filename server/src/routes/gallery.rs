use axum::{extract::State, Json, http::StatusCode, response::IntoResponse};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::GalleryItem;
use crate::middleware::auth::AuthUser;

#[derive(Deserialize)]
pub struct CreateGalleryItemRequest {
    pub title: String,
    pub category: String,
    pub image_url: String,
    pub description: String,
    pub thumbnail_url: Option<String>,
    pub featured: Option<bool>,
}

#[derive(Deserialize)]
pub struct UpdateGalleryItemRequest {
    pub id: String,
    pub title: Option<String>,
    pub category: Option<String>,
    pub image_url: Option<String>,
    pub description: Option<String>,
    pub thumbnail_url: Option<String>,
    pub featured: Option<bool>,
}

#[derive(Deserialize)]
pub struct DeleteGalleryItemRequest {
    pub id: String,
}

// GET /gallery - Public: get all gallery items
pub async fn get_all_gallery(State(state): State<AppState>) -> Json<Vec<GalleryItem>> {
    let mut cursor = state.gallery.find(doc! {}).await.unwrap();
    let mut items = Vec::new();
    while let Some(item) = cursor.try_next().await.unwrap() {
        items.push(item);
    }
    Json(items)
}

// POST /gallery/admin - Admin: create gallery item
pub async fn create_gallery_item(
    State(state): State<AppState>,
    axum::Extension(auth_user): axum::Extension<AuthUser>,
    Json(payload): Json<CreateGalleryItemRequest>,
) -> impl IntoResponse {
    let admin_id = match ObjectId::parse_str(&auth_user.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid user ID"}))),
    };

    let item = GalleryItem {
        id: None,
        title: payload.title,
        category: payload.category,
        image_url: payload.image_url,
        description: payload.description,
        thumbnail_url: payload.thumbnail_url,
        uploaded_by: admin_id,
        featured: payload.featured.unwrap_or(false),
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    match state.gallery.insert_one(item).await {
        Ok(result) => (StatusCode::CREATED, Json(serde_json::json!({"id": result.inserted_id.to_string()}))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}

// PATCH /gallery/admin - Admin: update gallery item
pub async fn update_gallery_item(
    State(state): State<AppState>,
    Json(payload): Json<UpdateGalleryItemRequest>,
) -> impl IntoResponse {
    let oid = match ObjectId::parse_str(&payload.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid gallery item ID"}))),
    };

    let mut update_doc = doc! {};
    if let Some(title) = payload.title { update_doc.insert("title", title); }
    if let Some(category) = payload.category { update_doc.insert("category", category); }
    if let Some(image_url) = payload.image_url { update_doc.insert("image_url", image_url); }
    if let Some(description) = payload.description { update_doc.insert("description", description); }
    if let Some(thumbnail_url) = payload.thumbnail_url { update_doc.insert("thumbnail_url", thumbnail_url); }
    if let Some(featured) = payload.featured { update_doc.insert("featured", featured); }

    if update_doc.is_empty() {
        return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "No fields to update"})));
    }

    match state.gallery.update_one(doc! {"_id": oid}, doc! {"$set": update_doc}).await {
        Ok(result) => {
            if result.matched_count == 0 {
                (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "Gallery item not found"})))
            } else {
                (StatusCode::OK, Json(serde_json::json!({"message": "Updated"})))
            }
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}

// DELETE /gallery/admin - Admin: delete gallery item
pub async fn delete_gallery_item(
    State(state): State<AppState>,
    Json(payload): Json<DeleteGalleryItemRequest>,
) -> impl IntoResponse {
    let oid = match ObjectId::parse_str(&payload.id) {
        Ok(oid) => oid,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid gallery item ID"}))),
    };

    match state.gallery.delete_one(doc! {"_id": oid}).await {
        Ok(result) => {
            if result.deleted_count == 0 {
                (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "Gallery item not found"})))
            } else {
                (StatusCode::OK, Json(serde_json::json!({"message": "Deleted"})))
            }
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))),
    }
}
