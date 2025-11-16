use axum::{extract::State, Json};
use futures_util::stream::TryStreamExt;
use mongodb::bson::{doc, oid::ObjectId};
use serde::Deserialize;

use crate::db::AppState;
use crate::models::{CoinTransaction, WeeklyLeaderboard, LeaderboardEntry};

#[derive(Deserialize)]
pub struct CoinTransactionRequest {
    pub user_id: String,
    pub amount: i32,
    pub admin_id: String,
    pub reason: String,
}

// Add/Remove coins (admin only)
pub async fn manage_coins(
    State(state): State<AppState>,
    Json(payload): Json<CoinTransactionRequest>,
) -> Json<String> {
    let user_id = ObjectId::parse_str(&payload.user_id).unwrap();
    let admin_id = ObjectId::parse_str(&payload.admin_id).unwrap();

    // Create transaction record
    let transaction = CoinTransaction {
        id: None,
        user_id,
        amount: payload.amount,
        admin_id,
        reason: payload.reason,
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    state.coin_transactions.insert_one(transaction).await.unwrap();

    // Update user's coin balance
    state.users
        .update_one(
            doc! { "_id": user_id },
            doc! { 
                "$inc": { "coins": payload.amount },
                "$set": { "updated_at": chrono::Utc::now().to_rfc3339() }
            },
        )
        .await
        .unwrap();

    Json("Coins updated successfully".to_string())
}

// Get coin transaction history
pub async fn get_coin_transactions(
    State(state): State<AppState>,
    Json(user_id): Json<String>,
) -> Json<Vec<CoinTransaction>> {
    let oid = ObjectId::parse_str(&user_id).unwrap();
    
    let mut cursor = state.coin_transactions
        .find(doc! { "user_id": oid })
        .await
        .unwrap();
    
    let mut transactions = Vec::new();
    while let Some(transaction) = cursor.try_next().await.unwrap() {
        transactions.push(transaction);
    }

    Json(transactions)
}

// Get weekly leaderboard
pub async fn get_weekly_leaderboard(State(state): State<AppState>) -> Json<Vec<LeaderboardEntry>> {
    // Get all users and sort by coins
    let mut cursor = state.users
        .find(doc! {})
        .await
        .unwrap();
    
    let mut users = Vec::new();
    while let Some(user) = cursor.try_next().await.unwrap() {
        users.push(LeaderboardEntry {
            user_id: user.id.unwrap(),
            username: user.username,
            coins_earned: user.coins,
            rank: 0,
        });
    }
    
    users.sort_by(|a, b| b.coins_earned.cmp(&a.coins_earned));

    for (index, user) in users.iter_mut().enumerate() {
        user.rank = (index + 1) as i32;
    }

    Json(users)
}

// Create/Save weekly leaderboard snapshot
pub async fn save_weekly_leaderboard(State(state): State<AppState>) -> Json<String> {
    // Get current leaderboard
    let mut cursor = state.users
        .find(doc! {})
        .await
        .unwrap();
    
    let mut rankings = Vec::new();
    while let Some(user) = cursor.try_next().await.unwrap() {
        rankings.push(LeaderboardEntry {
            user_id: user.id.unwrap(),
            username: user.username,
            coins_earned: user.coins,
            rank: 0,
        });
    }

    rankings.sort_by(|a, b| b.coins_earned.cmp(&a.coins_earned));
    
    for (index, entry) in rankings.iter_mut().enumerate() {
        entry.rank = (index + 1) as i32;
    }

    let now = chrono::Utc::now();
    let week_start = (now - chrono::Duration::weeks(1)).to_rfc3339();
    let week_end = now.to_rfc3339();

    let leaderboard = WeeklyLeaderboard {
        id: None,
        week_start,
        week_end,
        rankings,
        created_at: now.to_rfc3339(),
    };

    state.leaderboards.insert_one(leaderboard).await.unwrap();

    Json("Weekly leaderboard saved successfully".to_string())
}
