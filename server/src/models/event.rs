use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum EventType {
    Workshop,
    Competition,
    Hackathon,
    Meetup,
    Other,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum EventStatus {
    Upcoming,
    Ongoing,
    Completed,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EventSpeaker {
    pub name: String,
    pub role: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Event {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub date: String,
    pub time: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_date: Option<String>,
    pub location: String,
    pub event_type: EventType,
    pub status: EventStatus,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image: Option<String>,           // Event image URL
    pub featured: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub register_link: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recap_link: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub speakers: Option<Vec<EventSpeaker>>,
    pub created_by: ObjectId,            // Admin who created it
    pub created_at: String,
    pub updated_at: String,
}
