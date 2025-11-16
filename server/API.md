# IRIS Server API Documentation

## Base URL
```
http://localhost:5657
```

## Table of Contents
1. [Authentication](#authentication)
   - [OAuth Flow](#oauth-flow)
   - [OAuth Endpoints](#oauth-endpoints)
   - [Setting Up GitHub OAuth](#setting-up-github-oauth)
2. [User Management](#user-management)
3. [Project Management](#project-management)
4. [Coin System](#coin-system)
5. [Messaging System](#messaging-system)
6. [Response Codes](#response-codes)

---

## Authentication

GitHub OAuth authentication is implemented using the `oauth2` crate with JWT-based middleware for route protection.

### OAuth Flow

1. **Initiate Login**: User visits `/auth/github` endpoint
2. **GitHub Authorization**: User is redirected to GitHub to authorize the app
3. **Callback**: GitHub redirects back to `/auth/github/callback` with authorization code
4. **Token Exchange**: Server exchanges code for GitHub user info
5. **User Creation/Login**: Server creates/updates user in database (default role: Member)
6. **JWT Generation**: Server generates JWT token with 7-day expiration
7. **Response**: Server returns user data and JWT token
8. **Protected Access**: Client includes JWT in `Authorization` header for subsequent requests

### OAuth Endpoints

#### 1. GitHub Login
Initiates the OAuth flow by redirecting to GitHub authorization page.

**Endpoint:** `GET /auth/github`

**Request:**
```bash
curl -X GET http://localhost:5657/auth/github
```

**Response:** `302 Redirect`
- Redirects to GitHub OAuth authorization page
- User authorizes the application
- GitHub redirects back to callback URL

---

#### 2. GitHub Callback
Handles the OAuth callback from GitHub, exchanges code for token, and creates/logs in user.

**Endpoint:** `GET /auth/github/callback`

**Query Parameters:**
- `code`: Authorization code from GitHub
- `state`: CSRF token (automatically handled)

**Request:**
```bash
# This endpoint is called automatically by GitHub after authorization
# Example: http://localhost:5657/auth/github/callback?code=abc123&state=xyz789
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully authenticated",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "coins": 0
  },
  "token": "gho_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "error": "Failed to exchange authorization code"
}
```

### Current Behavior

- All endpoints are currently **open** (no authentication middleware yet)
- OAuth endpoints are functional and return tokens
- Future implementation will add authentication middleware to protect endpoints

---

## User Management

### 1. Get All Users
Retrieve a list of all users (admins and members).

**Endpoint:** `GET /users`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request:**
```bash
curl -X GET http://localhost:5657/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "password_hash": "hashed_password",
    "role": "Member",
    "coins": 150,
    "project_ids": ["507f191e810c19729de860ea", "507f191e810c19729de860eb"],
    "created_at": "2025-11-15T10:30:00Z",
    "updated_at": "2025-11-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "admin",
    "full_name": "Admin User",
    "email": "admin@example.com",
    "password_hash": "hashed_password",
    "role": "Admin",
    "coins": 0,
    "project_ids": [],
    "created_at": "2025-11-10T08:00:00Z",
    "updated_at": "2025-11-10T08:00:00Z"
  }
]
```

---

### 2. Get All Members
Retrieve a list of all members (excludes admins filtering on client side).

**Endpoint:** `GET /members`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request:**
```bash
curl -X GET http://localhost:5657/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "password_hash": "hashed_password",
    "role": "Member",
    "coins": 150,
    "project_ids": ["507f191e810c19729de860ea"],
    "created_at": "2025-11-15T10:30:00Z",
    "updated_at": "2025-11-15T10:30:00Z"
  }
]
```

---

### 3. Add New User
Create a new user (admin or member).

**Endpoint:** `POST /users`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "username": "janedoe",
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "password_hash": "hashed_password_here",
  "role": "Member"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "password_hash": "hashed_password_here",
    "role": "Member"
  }'
```

**Response:** `200 OK`
```json
"User added successfully"
```

**Notes:**
- `role` must be either "Admin" or "Member"
- `coins` is automatically set to 0
- `project_ids` is automatically initialized as empty array
- Timestamps are automatically generated

---

### 4. Update User Role
Change a user's role between Admin and Member.

**Endpoint:** `POST /users/role`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "role": "Admin"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/users/role \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "role": "Admin"
  }'
```

**Response:** `200 OK`
```json
"User role updated successfully"
```

---

### 5. Delete User
Remove a user from the system.

**Endpoint:** `DELETE /users`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Request:**
```bash
curl -X DELETE http://localhost:5657/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011"
  }'
```

**Response:** `200 OK`
```json
"User deleted successfully"
```

**Notes:**
- User is automatically removed from all projects
- All coin transactions remain in history

---

## Project Management

### 6. Get All Projects
Retrieve all projects in the system.

**Endpoint:** `GET /projects`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request:**
```bash
curl -X GET http://localhost:5657/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "name": "AI Robot Project",
    "description": "Building an autonomous line-following robot",
    "status": "Active",
    "member_ids": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439013"
    ],
    "created_by": "507f1f77bcf86cd799439012",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-15T14:30:00Z"
  },
  {
    "_id": "507f191e810c19729de860eb",
    "name": "Web Dashboard",
    "description": "Member dashboard for IRIS",
    "status": "Completed",
    "member_ids": ["507f1f77bcf86cd799439011"],
    "created_by": "507f1f77bcf86cd799439012",
    "created_at": "2025-10-15T10:00:00Z",
    "updated_at": "2025-11-10T16:20:00Z"
  }
]
```

---

### 7. Get User's Projects
Retrieve all projects assigned to a specific user (for member dashboard).

**Endpoint:** `POST /projects/user`

**Authentication:** Required (JWT)

**Role Required:** Member or Admin

**Request Body:**
```json
"507f1f77bcf86cd799439011"
```

**Request:**
```bash
curl -X POST http://localhost:5657/projects/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"507f1f77bcf86cd799439011"'
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "name": "AI Robot Project",
    "description": "Building an autonomous line-following robot",
    "status": "Active",
    "member_ids": [
      "507f1f77bcf86cd799439011",
      "507f1f77bcf86cd799439013"
    ],
    "created_by": "507f1f77bcf86cd799439012",
    "created_at": "2025-11-01T09:00:00Z",
    "updated_at": "2025-11-15T14:30:00Z"
  }
]
```

---

### 8. Create New Project
Create a new project.

**Endpoint:** `POST /projects`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "name": "Drone Project",
  "description": "Building a quadcopter drone with autonomous flight",
  "created_by": "507f1f77bcf86cd799439012"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Drone Project",
    "description": "Building a quadcopter drone with autonomous flight",
    "created_by": "507f1f77bcf86cd799439012"
  }'
```

**Response:** `200 OK`
```json
"Project created successfully"
```

**Notes:**
- `status` is automatically set to "Active"
- `member_ids` is initialized as empty array
- Timestamps are automatically generated

---

### 9. Assign Member to Project
Add a member to a project.

**Endpoint:** `POST /projects/assign`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "project_id": "507f191e810c19729de860ea",
  "member_id": "507f1f77bcf86cd799439011"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/projects/assign \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "507f191e810c19729de860ea",
    "member_id": "507f1f77bcf86cd799439011"
  }'
```

**Response:** `200 OK`
```json
"Member assigned to project successfully"
```

**Notes:**
- Updates both project's `member_ids` and user's `project_ids`
- Uses `$addToSet` to prevent duplicates
- Updates project's `updated_at` timestamp

---

### 10. Remove Member from Project
Remove a member from a project.

**Endpoint:** `POST /projects/remove`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "project_id": "507f191e810c19729de860ea",
  "member_id": "507f1f77bcf86cd799439011"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/projects/remove \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "507f191e810c19729de860ea",
    "member_id": "507f1f77bcf86cd799439011"
  }'
```

**Response:** `200 OK`
```json
"Member removed from project successfully"
```

**Notes:**
- Updates both project's `member_ids` and user's `project_ids`
- Updates project's `updated_at` timestamp

---

### 11. Delete Project
Delete a project from the system.

**Endpoint:** `DELETE /projects`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "project_id": "507f191e810c19729de860ea"
}
```

**Request:**
```bash
curl -X DELETE http://localhost:5657/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "507f191e810c19729de860ea"
  }'
```

**Response:** `200 OK`
```json
"Project deleted successfully"
```

**Notes:**
- Project is removed from all users' `project_ids`
- All related data is automatically cleaned up

---

## Coin System

### 12. Manage Coins (Add/Remove)
Add or remove coins from a user's account.

**Endpoint:** `POST /coins/manage`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "amount": 50,
  "admin_id": "507f1f77bcf86cd799439012",
  "reason": "Completed AI Robot milestone"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/coins/manage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011",
    "amount": 50,
    "admin_id": "507f1f77bcf86cd799439012",
    "reason": "Completed AI Robot milestone"
  }'
```

**Response:** `200 OK`
```json
"Coins updated successfully"
```

**Notes:**
- Positive `amount` adds coins
- Negative `amount` removes coins (e.g., -20 to deduct 20 coins)
- Transaction is recorded in `coin_transactions` collection
- User's coin balance is updated immediately

**Example (Removing Coins):**
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "amount": -20,
  "admin_id": "507f1f77bcf86cd799439012",
  "reason": "Penalty for missed deadline"
}
```

---

### 13. Get Coin Transaction History
Retrieve all coin transactions for a specific user.

**Endpoint:** `POST /coins/transactions`

**Authentication:** Required (JWT)

**Role Required:** Member or Admin

**Request Body:**
```json
"507f1f77bcf86cd799439011"
```

**Request:**
```bash
curl -X POST http://localhost:5657/coins/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"507f1f77bcf86cd799439011"'
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860f1",
    "user_id": "507f1f77bcf86cd799439011",
    "amount": 50,
    "admin_id": "507f1f77bcf86cd799439012",
    "reason": "Completed AI Robot milestone",
    "created_at": "2025-11-15T14:30:00Z"
  },
  {
    "_id": "507f191e810c19729de860f2",
    "user_id": "507f1f77bcf86cd799439011",
    "amount": 100,
    "admin_id": "507f1f77bcf86cd799439012",
    "reason": "Won hackathon",
    "created_at": "2025-11-10T18:00:00Z"
  },
  {
    "_id": "507f191e810c19729de860f3",
    "user_id": "507f1f77bcf86cd799439011",
    "amount": -20,
    "admin_id": "507f1f77bcf86cd799439012",
    "reason": "Penalty for missed deadline",
    "created_at": "2025-11-08T12:00:00Z"
  }
]
```

---

### 14. Get Weekly Leaderboard
Get the current leaderboard showing all members ranked by coins.

**Endpoint:** `GET /coins/leaderboard`

**Role Required:** Public (All users)

**Request:**
```bash
curl -X GET http://localhost:5657/coins/leaderboard
```

**Response:** `200 OK`
```json
[
  {
    "user_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "coins_earned": 250,
    "rank": 1
  },
  {
    "user_id": "507f1f77bcf86cd799439013",
    "username": "janedoe",
    "coins_earned": 180,
    "rank": 2
  },
  {
    "user_id": "507f1f77bcf86cd799439014",
    "username": "bobsmith",
    "coins_earned": 120,
    "rank": 3
  }
]
```

**Notes:**
- Returns real-time leaderboard based on current coin balances
- Automatically sorted by coins (descending)
- Ranks are dynamically assigned

---

### 15. Save Weekly Leaderboard
Create a snapshot of the current week's leaderboard for historical records.

**Endpoint:** `POST /coins/leaderboard/save`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request:**
```bash
curl -X POST http://localhost:5657/coins/leaderboard/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
"Weekly leaderboard saved successfully"
```

**Response Structure (Saved in Database):**
```json
{
  "_id": "507f191e810c19729de860f5",
  "week_start": "2025-11-09T00:00:00Z",
  "week_end": "2025-11-16T00:00:00Z",
  "rankings": [
    {
      "user_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "coins_earned": 250,
      "rank": 1
    },
    {
      "user_id": "507f1f77bcf86cd799439013",
      "username": "janedoe",
      "coins_earned": 180,
      "rank": 2
    }
  ],
  "created_at": "2025-11-16T00:00:00Z"
}
```

**Notes:**
- Should be called at the end of each week
- Preserves leaderboard state for historical tracking
- `week_start` is automatically set to 7 days before current date
- `week_end` is set to current date

---

## Messaging System

### 16. Send Message
Send a message to one or more members.

**Endpoint:** `POST /messages/send`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request Body:**
```json
{
  "sender_id": "507f1f77bcf86cd799439012",
  "recipient_ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
  "subject": "Team Meeting Tomorrow",
  "content": "We have a team meeting scheduled for tomorrow at 10 AM in the main lab. Please be on time.",
  "is_group_message": true
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/messages/send \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sender_id": "507f1f77bcf86cd799439012",
    "recipient_ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
    "subject": "Team Meeting Tomorrow",
    "content": "We have a team meeting scheduled for tomorrow at 10 AM in the main lab. Please be on time.",
    "is_group_message": true
  }'
```

**Response:** `200 OK`
```json
"Message sent successfully"
```

**Individual Message Example:**
```json
{
  "sender_id": "507f1f77bcf86cd799439012",
  "recipient_ids": ["507f1f77bcf86cd799439011"],
  "subject": "Great Work on Robot Project",
  "content": "Congratulations on completing the milestone!",
  "is_group_message": false
}
```

---

### 17. Get User Messages
Retrieve all messages sent to a specific user.

**Endpoint:** `POST /messages/user`

**Authentication:** Required (JWT)

**Role Required:** Member or Admin

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439011"
}
```

**Request:**
```bash
curl -X POST http://localhost:5657/messages/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "507f1f77bcf86cd799439011"
  }'
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860f6",
    "sender_id": "507f1f77bcf86cd799439012",
    "recipient_ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
    "subject": "Team Meeting Tomorrow",
    "content": "We have a team meeting scheduled for tomorrow at 10 AM in the main lab.",
    "is_group_message": true,
    "created_at": "2025-11-15T16:30:00Z"
  },
  {
    "_id": "507f191e810c19729de860f7",
    "sender_id": "507f1f77bcf86cd799439012",
    "recipient_ids": ["507f1f77bcf86cd799439011"],
    "subject": "Great Work on Robot Project",
    "content": "Congratulations on completing the milestone!",
    "is_group_message": false,
    "created_at": "2025-11-14T12:00:00Z"
  }
]
```

---

### 18. Get All Messages
Retrieve all messages in the system (admin view).

**Endpoint:** `GET /messages`

**Authentication:** Required (JWT)

**Role Required:** Admin

**Request:**
```bash
curl -X GET http://localhost:5657/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860f6",
    "sender_id": "507f1f77bcf86cd799439012",
    "recipient_ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439013"],
    "subject": "Team Meeting Tomorrow",
    "content": "We have a team meeting scheduled for tomorrow at 10 AM.",
    "is_group_message": true,
    "created_at": "2025-11-15T16:30:00Z"
  },
  {
    "_id": "507f191e810c19729de860f7",
    "sender_id": "507f1f77bcf86cd799439012",
    "recipient_ids": ["507f1f77bcf86cd799439011"],
    "subject": "Great Work on Robot Project",
    "content": "Congratulations on completing the milestone!",
    "is_group_message": false,
    "created_at": "2025-11-14T12:00:00Z"
  }
]
```

---

## Root Endpoint

### 19. API Information
Get information about available endpoints.

**Endpoint:** `GET /`

**Request:**
```bash
curl -X GET http://localhost:5657/
```

**Response:** `200 OK`
```json
{
  "message": "IRIS Server API",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "GET /auth/github": "Initiate GitHub OAuth login",
      "GET /auth/github/callback": "GitHub OAuth callback (creates Member by default)"
    },
    "users": {
      "GET /users": "Get all users (admin)",
      "GET /members": "Get all members (admin)",
      "POST /users": "Add new user (admin)",
      "PUT /users/role": "Update user role (admin)",
      "DELETE /users": "Delete user (admin)"
    },
    "projects": {
      "GET /projects": "Get all projects (admin)",
      "POST /projects/user": "Get user's projects (member dashboard)",
      "POST /projects": "Create project (admin)",
      "POST /projects/assign": "Assign member to project (admin)",
      "POST /projects/remove": "Remove member from project (admin)",
      "DELETE /projects": "Delete project (admin)"
    },
    "coins": {
      "POST /coins/manage": "Add/remove coins (admin)",
      "POST /coins/transactions": "Get coin transaction history",
      "GET /coins/leaderboard": "Get weekly leaderboard",
      "POST /coins/leaderboard/save": "Save weekly leaderboard snapshot"
    },
    "messages": {
      "POST /messages/send": "Send message (admin)",
      "POST /messages/user": "Get user messages",
      "GET /messages": "Get all messages (admin)"
    }
  }
}
```

---

## Response Codes

### Success Codes
- `200 OK` - Request succeeded
- `302 Found` - Redirect (OAuth flow)

### Error Codes
- `400 Bad Request` - Invalid request body or parameters
- `401 Unauthorized` - Missing, invalid, or expired JWT token
  ```json
  {
    "error": "Missing authorization token",
    "message": "Please provide a valid JWT token in Authorization header"
  }
  ```
  ```json
  {
    "error": "Invalid or expired token",
    "message": "Please login again to get a new token"
  }
  ```
- `403 Forbidden` - Insufficient permissions (Member trying to access Admin route)
  ```json
  {
    "error": "Insufficient permissions",
    "message": "This endpoint requires admin privileges"
  }
  ```
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Data Models

### User
```typescript
{
  _id: ObjectId,
  username: string,
  full_name: string,
  email: string,
  password_hash: string, // Empty string for OAuth users
  role: "Admin" | "Member",
  coins: number,
  project_ids: ObjectId[],
  created_at: string (ISO 8601),
  updated_at: string (ISO 8601)
}
```

**Note:** OAuth users have an empty `password_hash` since they authenticate through GitHub.

### Project
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  status: "Active" | "Completed" | "OnHold",
  member_ids: ObjectId[],
  created_by: ObjectId,
  created_at: string (ISO 8601),
  updated_at: string (ISO 8601)
}
```

### Message
```typescript
{
  _id: ObjectId,
  sender_id: ObjectId,
  recipient_ids: ObjectId[],
  subject: string,
  content: string,
  is_group_message: boolean,
  created_at: string (ISO 8601)
}
```

### CoinTransaction
```typescript
{
  _id: ObjectId,
  user_id: ObjectId,
  amount: number, // positive = add, negative = remove
  admin_id: ObjectId,
  reason: string,
  created_at: string (ISO 8601)
}
```

### WeeklyLeaderboard
```typescript
{
  _id: ObjectId,
  week_start: string (ISO 8601),
  week_end: string (ISO 8601),
  rankings: LeaderboardEntry[],
  created_at: string (ISO 8601)
}
```

### LeaderboardEntry
```typescript
{
  user_id: ObjectId,
  username: string,
  coins_earned: number,
  rank: number
}
```

---

## Notes

### ObjectId Format
MongoDB ObjectIds are 24-character hexadecimal strings:
```
507f1f77bcf86cd799439011
```

### Timestamps
All timestamps follow ISO 8601 format (RFC 3339):
```
2025-11-16T14:30:00Z
```

### Role-Based Access
- **Public**: Access to root endpoint, OAuth endpoints, and leaderboard (no auth required)
- **Member**: Access to their own data (projects, messages, transactions) with valid JWT
- **Admin**: Full access to all endpoints with valid JWT and Admin role

### JWT Token
- **Format**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature`
- **Expiration**: 7 days from issuance
- **Claims**: Contains user ID, username, email, role
- **Usage**: Include in `Authorization: Bearer <token>` header
- **Renewal**: Re-authenticate via `/auth/github` after expiration

For detailed authentication information, see [AUTH.md](./AUTH.md)