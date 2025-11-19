use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ProjectStatus {
    Active,
    Completed,
    OnHold,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub description: String,
    pub status: ProjectStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub member_ids: Option<Vec<ObjectId>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub project_lead_id: Option<ObjectId>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub github_link: Option<String>,
    pub created_by: ObjectId,
    pub created_at: String,
    pub updated_at: String,
}
