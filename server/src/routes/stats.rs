use axum::{extract::State, Json};
use mongodb::bson::doc;

use crate::db::AppState;

// GET /stats - Public: get dynamic counts for the homepage
pub async fn get_stats(State(state): State<AppState>) -> Json<serde_json::Value> {
    let members_count = state.users.count_documents(doc! {}).await.unwrap_or(0);
    let projects_count = state.projects.count_documents(doc! {}).await.unwrap_or(0);
    let events_count = state.events.count_documents(doc! {}).await.unwrap_or(0);
    let gallery_count = state.gallery.count_documents(doc! {}).await.unwrap_or(0);

    // Count workshops specifically (event_type = "Workshop")
    let workshops_count = state.events.count_documents(doc! {"event_type": "Workshop"}).await.unwrap_or(0);

    Json(serde_json::json!({
        "members": members_count,
        "projects": projects_count,
        "events": events_count,
        "gallery_photos": gallery_count,
        "workshops": workshops_count,
    }))
}
