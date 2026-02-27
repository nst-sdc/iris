use axum::{extract::State, Json, http::StatusCode, response::IntoResponse};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::Blog;
use crate::middleware::auth::Claims;

#[derive(Deserialize)]
pub struct CreateBlogRequest {
    pub title: String,
    pub description: String,
    pub content: String,
    pub image_url: Option<String>,
    pub category: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteBlogRequest {
    pub blog_id: String,
}

fn slugify(title: &str) -> String {
    title
        .to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() || c == ' ' { c } else { ' ' })
        .collect::<String>()
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join("-")
}

// GET /blogs - Public: get all blogs
pub async fn get_all_blogs(State(state): State<AppState>) -> Json<Vec<Blog>> {
    let mut cursor = state.blogs.find(doc! {}).await.unwrap();
    let mut blogs = Vec::new();
    while let Some(blog) = cursor.try_next().await.unwrap() {
        blogs.push(blog);
    }
    // Sort by created_at descending (newest first)
    blogs.sort_by(|a, b| b.created_at.cmp(&a.created_at));
    Json(blogs)
}

// GET /blogs/:slug - Public: get a single blog by slug
pub async fn get_blog_by_slug(
    State(state): State<AppState>,
    axum::extract::Path(slug): axum::extract::Path<String>,
) -> impl IntoResponse {
    match state.blogs.find_one(doc! { "slug": &slug }).await.unwrap() {
        Some(blog) => (StatusCode::OK, Json(serde_json::to_value(blog).unwrap())).into_response(),
        None => (
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({"error": "Blog not found"})),
        ).into_response(),
    }
}

// POST /blogs - Authenticated: create a blog
pub async fn create_blog(
    State(state): State<AppState>,
    axum::Extension(claims): axum::Extension<Claims>,
    Json(payload): Json<CreateBlogRequest>,
) -> impl IntoResponse {
    let author_id = match ObjectId::parse_str(&claims.sub) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid user ID"}))).into_response(),
    };

    // Look up author name
    let author_name = match state.users.find_one(doc! { "_id": author_id }).await.unwrap() {
        Some(user) => user.full_name,
        None => claims.sub.clone(),
    };

    let base_slug = slugify(&payload.title);
    
    // Check for slug uniqueness, append number if needed
    let mut slug = base_slug.clone();
    let mut counter = 1;
    while state.blogs.find_one(doc! { "slug": &slug }).await.unwrap().is_some() {
        slug = format!("{}-{}", base_slug, counter);
        counter += 1;
    }

    let now = chrono::Utc::now().to_rfc3339();
    let blog = Blog {
        id: None,
        title: payload.title,
        slug: slug.clone(),
        description: payload.description,
        content: payload.content,
        author_name,
        author_id,
        image_url: payload.image_url,
        category: payload.category,
        created_at: now.clone(),
        updated_at: now,
    };

    match state.blogs.insert_one(blog).await {
        Ok(_) => (StatusCode::CREATED, Json(serde_json::json!({"message": "Blog created", "slug": slug}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))).into_response(),
    }
}

// DELETE /blogs - Authenticated: author can delete own, admin can delete any
pub async fn delete_blog(
    State(state): State<AppState>,
    axum::Extension(claims): axum::Extension<Claims>,
    Json(payload): Json<DeleteBlogRequest>,
) -> impl IntoResponse {
    let blog_id = match ObjectId::parse_str(&payload.blog_id) {
        Ok(id) => id,
        Err(_) => return (StatusCode::BAD_REQUEST, Json(serde_json::json!({"error": "Invalid blog ID"}))).into_response(),
    };

    // Find the blog
    let blog = match state.blogs.find_one(doc! { "_id": blog_id }).await.unwrap() {
        Some(b) => b,
        None => return (StatusCode::NOT_FOUND, Json(serde_json::json!({"error": "Blog not found"}))).into_response(),
    };

    // Check: must be author or admin
    let user_id = ObjectId::parse_str(&claims.sub).unwrap_or_default();
    if blog.author_id != user_id && claims.role != "Admin" {
        return (StatusCode::FORBIDDEN, Json(serde_json::json!({"error": "You can only delete your own blogs"}))).into_response();
    }

    match state.blogs.delete_one(doc! { "_id": blog_id }).await {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"message": "Blog deleted"}))).into_response(),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))).into_response(),
    }
}
