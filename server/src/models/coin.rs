use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CoinTransaction {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub amount: i32,
    pub admin_id: ObjectId,
    pub reason: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WeeklyLeaderboard {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub week_start: String,
    pub week_end: String,
    pub rankings: Vec<LeaderboardEntry>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LeaderboardEntry {
    pub user_id: ObjectId,
    pub username: String,
    pub coins_earned: i32,
    pub rank: i32,
}
