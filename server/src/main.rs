mod db;
mod models;
mod routes;
mod auth;
mod middleware;

use axum::serve;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    // Database connection
    let state = db::connect().await;

    // Build routes
    let app = routes::create_routes(state);

    // Run server
    let listener = TcpListener::bind("0.0.0.0:5657")
        .await
        .unwrap();

    println!("Server is running on http://localhost:5657");

    serve(listener, app).await.unwrap();
}