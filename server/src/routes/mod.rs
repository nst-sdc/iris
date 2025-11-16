use axum::{Router, routing::{get, post}, middleware};

use crate::db::AppState;
use crate::middleware::{auth_middleware, admin_middleware};

use crate::routes::users::{get_users, get_members, add_user, update_user_role, delete_user};
use crate::routes::projects::{
    get_all_projects, get_user_projects, create_project, 
    assign_member_to_project, remove_member_from_project, delete_project
};
use crate::routes::coins::{manage_coins, get_coin_transactions, get_weekly_leaderboard, save_weekly_leaderboard};
use crate::routes::messages::{send_message, get_user_messages, get_all_messages};

use crate::auth::{github_login, github_callback};

async fn root_handler() -> axum::Json<serde_json::Value> {
    axum::Json(serde_json::json!({
        "message": "IRIS Server API",
        "version": "1.0.0"
    }))
}

pub fn create_routes(state: AppState) -> Router {
    // Public routes
    let public_routes = Router::new()
        .route("/", get(root_handler))
        .route("/auth/github", get(github_login))
        .route("/auth/github/callback", get(github_callback))
        .route("/coins/leaderboard", get(get_weekly_leaderboard));

    // Protected routes
    let protected_routes = Router::new()
        .route("/projects/user", post(get_user_projects))
        .route("/coins/transactions", post(get_coin_transactions))
        .route("/messages/user", post(get_user_messages))
        .layer(middleware::from_fn_with_state(state.clone(), auth_middleware));

    // Admin-only routes
    let admin_routes = Router::new()
        .route("/users", get(get_users).post(add_user).delete(delete_user))
        .route("/members", get(get_members))
        .route("/users/role", post(update_user_role))
        .route("/projects", get(get_all_projects).post(create_project).delete(delete_project))
        .route("/projects/assign", post(assign_member_to_project))
        .route("/projects/remove", post(remove_member_from_project))
        .route("/coins/manage", post(manage_coins))
        .route("/coins/leaderboard/save", post(save_weekly_leaderboard))
        .route("/messages", get(get_all_messages))
        .route("/messages/send", post(send_message))
        .layer(middleware::from_fn_with_state(state.clone(), auth_middleware))
        .layer(middleware::from_fn(admin_middleware));

    // Combine all routes
    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .merge(admin_routes)
        .with_state(state)
}

pub mod users;
pub mod projects;
pub mod coins;
pub mod messages;