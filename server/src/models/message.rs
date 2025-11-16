use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub sender_id: ObjectId,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient_ids: Option<Vec<ObjectId>>,
    pub subject: String,
    pub content: String,
    pub is_group_message: bool,
    pub created_at: String,
}
