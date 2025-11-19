use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum JoinRequestStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProjectJoinRequest {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub project_id: ObjectId,
    pub user_id: ObjectId,
    pub message: String,
    pub status: JoinRequestStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateJoinRequest {
    pub project_id: String,
    pub message: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateJoinRequestStatus {
    pub status: String, // "approved" or "rejected"
}
