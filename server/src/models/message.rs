use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum MessageType {
    Individual,      // Message to a single member
    ProjectTeam,     // Message to all members of a project
    Broadcast,       // Message to all members
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub sender_id: ObjectId,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recipient_ids: Option<Vec<ObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub project_id: Option<ObjectId>,  // For project-specific messages
    pub subject: String,
    pub content: String,
    pub message_type: MessageType,
    pub created_at: String,
    #[serde(default)]
    pub read: bool,
}
