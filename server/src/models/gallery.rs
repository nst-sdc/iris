use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GalleryItem {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub category: String,          // "Hackathon", "Workshop", "Competition", "Team", "Project", "Other"
    pub image_url: String,          // Cloudinary or any hosted image URL
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail_url: Option<String>,
    pub uploaded_by: ObjectId,      // Admin who uploaded
    pub featured: bool,
    pub created_at: String,
}
