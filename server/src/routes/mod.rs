use axum::{Router, routing::{get, post}, middleware};
use tower_http::cors::{CorsLayer, Any};

use crate::db::AppState;
use crate::middleware::{auth_middleware, admin_middleware};

use crate::routes::users::{get_users, get_members, add_user, update_user_role, delete_user, get_user_by_id};
use crate::routes::projects::{
    get_all_projects, get_user_projects, create_project, 
    assign_member_to_project, remove_member_from_project, delete_project,
    set_project_lead, update_project, remove_member_by_lead,
    add_file_to_project, delete_file_from_project
};
use crate::routes::project_join_requests::{
    create_join_request, get_project_join_requests, update_join_request_status
};
use crate::routes::coins::{manage_coins, get_coin_transactions, get_weekly_leaderboard, save_weekly_leaderboard};
use crate::routes::messages::{send_message, get_user_messages, get_all_messages};
use crate::routes::gallery::{get_all_gallery, create_gallery_item, update_gallery_item, delete_gallery_item};
use crate::routes::events::{get_all_events, create_event, update_event, delete_event, propose_event};
use crate::routes::stats::get_stats;
use crate::routes::blogs::{get_all_blogs, get_blog_by_slug, create_blog, delete_blog};

use crate::auth::{github_login, github_callback, test_login};

async fn root_handler() -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "message": "IRIS Server API",
        "version": "1.0.0"
    }))
}

async fn health_handler() -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

pub fn create_routes(state: AppState) -> Router {
    // Public routes
    let public_routes = Router::new()
        .route("/", get(root_handler))
        .route("/health", get(health_handler))
        .route("/auth/github", get(github_login))
        .route("/auth/github/callback", get(github_callback))
        .route("/auth/test-login", post(test_login))
        .route("/coins/leaderboard", get(get_weekly_leaderboard))
        .route("/projects", get(get_all_projects))
        .route("/gallery", get(get_all_gallery))
        .route("/events", get(get_all_events))
        .route("/stats", get(get_stats))
        .route("/blogs", get(get_all_blogs))
        .route("/blogs/{slug}", get(get_blog_by_slug));

    // Protected routes
    let protected_routes = Router::new()
        .route("/users/{user_id}", get(get_user_by_id))
        .route("/projects/user", post(get_user_projects))
        .route("/projects/join-request", post(create_join_request))
        .route("/projects/{id}/join-requests", get(get_project_join_requests))
        .route("/projects/join-request/{id}", axum::routing::patch(update_join_request_status))
        .route("/projects/remove-member", post(remove_member_by_lead))
        .route("/projects/files", post(add_file_to_project).delete(delete_file_from_project))
        .route("/coins/transactions", post(get_coin_transactions))
        .route("/messages/user", post(get_user_messages))
        .route("/messages/send", post(send_message))
        .route("/events/propose", post(propose_event))
        .route("/blogs/create", post(create_blog))
        .route("/blogs/delete", post(delete_blog))
        .layer(middleware::from_fn_with_state(state.clone(), auth_middleware));

    // Admin-only routes
    let admin_routes = Router::new()
        .route("/users", get(get_users).post(add_user).delete(delete_user))
        .route("/members", get(get_members))
        .route("/users/role", post(update_user_role))
        .route("/projects/admin", post(create_project).delete(delete_project).patch(update_project))
        .route("/projects/assign", post(assign_member_to_project))
        .route("/projects/remove", post(remove_member_from_project))
        .route("/projects/lead", post(set_project_lead))
        .route("/coins/manage", post(manage_coins))
        .route("/coins/leaderboard/save", post(save_weekly_leaderboard))
        .route("/messages", get(get_all_messages))
        .route("/gallery/admin", post(create_gallery_item).patch(update_gallery_item).delete(delete_gallery_item))
        .route("/events/admin", post(create_event).patch(update_event).delete(delete_event))
        .layer(middleware::from_fn(admin_middleware))
        .layer(middleware::from_fn_with_state(state.clone(), auth_middleware));

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Combine all routes
    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .merge(admin_routes)
        .layer(cors)
        .with_state(state)
}

pub mod users;
pub mod projects;
pub mod project_join_requests;
pub mod coins;
pub mod messages;
pub mod gallery;
pub mod events;
pub mod stats;
pub mod blogs;