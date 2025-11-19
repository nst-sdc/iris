use mongodb::{Client, Collection};

use crate::models::{User, Project, ProjectJoinRequest, Message, CoinTransaction, WeeklyLeaderboard};

#[derive(Clone, Debug)]
pub struct AppState{
    pub users: Collection<User>,
    pub projects: Collection<Project>,
    pub project_join_requests: Collection<ProjectJoinRequest>,
    pub messages: Collection<Message>,
    pub coin_transactions: Collection<CoinTransaction>,
    pub leaderboards: Collection<WeeklyLeaderboard>,
}

pub async fn connect() -> AppState {
    let client = Client::with_uri_str(std::env::var("MONGO_URI").unwrap())
        .await
        .unwrap();

    let db = client.database("iris");
    
    let users = db.collection::<User>("users");
    let projects = db.collection::<Project>("projects");
    let project_join_requests = db.collection::<ProjectJoinRequest>("project_join_requests");
    let messages = db.collection::<Message>("messages");
    let coin_transactions = db.collection::<CoinTransaction>("coin_transactions");
    let leaderboards = db.collection::<WeeklyLeaderboard>("leaderboards");
    
    AppState {
        users,
        projects,
        project_join_requests,
        messages,
        coin_transactions,
        leaderboards,
    }
}