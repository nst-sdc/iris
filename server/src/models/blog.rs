use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Blog {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub slug: String,
    pub description: String,
    pub content: String,              // Markdown content
    pub author_name: String,
    pub author_id: ObjectId,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image_url: Option<String>,    // Cover image
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}
