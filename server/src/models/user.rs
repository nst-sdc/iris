use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum Role {
    Admin,
    Member,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub username: String,
    pub full_name: String,
    pub email: String,
    pub password_hash: String,
    pub role: Role,
    pub coins: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub project_ids: Option<Vec<ObjectId>>,
    pub created_at: String,
    pub updated_at: String,
}