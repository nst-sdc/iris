# IRIS Dashboard Setup Guide

## ✅ Current Status

### What's Running:
- ✅ **Frontend**: Running on http://localhost:3001
- 🔄 **Backend**: Currently compiling (Rust backend)
- ✅ **MongoDB**: Running on localhost:27017

---

## 📋 Setup Steps Completed

### 1. ✅ MongoDB
- Started MongoDB service
- Database: `iris_robotics` on `localhost:27017`

### 2. ✅ Backend Server (Rust)
- Created `.env` file with:
  - MongoDB connection
  - JWT secret (auto-generated)
  - Placeholder GitHub OAuth credentials
- Currently building with `cargo run`

### 3. ✅ Frontend (Next.js)
- Running on port 3001 (port 3000 was busy)
- Dashboard pages created
- Login page ready

---

## 🔐 GitHub OAuth Setup (REQUIRED)

To enable login, you need to create a GitHub OAuth App:

### Steps:
1. Go to: https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: IRIS Robotics Dashboard
   - **Homepage URL**: `http://localhost:5657`
   - **Authorization callback URL**: `http://localhost:5657/auth/github/callback`
4. Click "Register application"
5. Copy **Client ID** and **Client Secret**
6. Update `/Users/vipulyadav/Desktop/iris/server/.env`:
   ```env
   GITHUB_CLIENT_ID=your_actual_client_id
   GITHUB_CLIENT_SECRET=your_actual_client_secret
   ```
7. Restart the backend server

---

## 🚀 How to Use

### Starting Everything:

#### Terminal 1 - Backend:
```bash
cd /Users/vipulyadav/Desktop/iris/server
cargo run
```
Server will be on: http://localhost:5657

#### Terminal 2 - Frontend:
```bash
cd /Users/vipulyadav/Desktop/iris/frontend
npm run dev
```
Frontend will be on: http://localhost:3001

### Accessing the Dashboard:

1. **Open**: http://localhost:3001
2. **Click**: "Dashboard" in the navbar
3. **Login**: Using GitHub OAuth
4. **Redirected to**:
   - Admin users → `/dashboard/admin`
   - Regular members → `/dashboard/member`

---

## 📂 Dashboard Features

### Admin Dashboard (`/dashboard/admin`)
- **Overview**: Statistics (users, projects, coins)
- **Users Management**: Add, edit, delete users
- **Projects**: Create and assign projects
- **Coins**: Reward system management
- **Messages**: Send announcements

### Member Dashboard (`/dashboard/member`)
- **Overview**: Personal stats and coins
- **My Projects**: View assigned projects
- **Leaderboard**: See your ranking
- **Messages**: Read announcements

---

## 🎨 Dashboard Design

- **Dark cyberpunk theme** with cyan/purple gradients
- **Glassmorphism effects**
- **Responsive** (mobile, tablet, desktop)
- **Animated** with Framer Motion
- **Role-based navigation**

---

## 🔧 API Integration

All dashboard features connect to the Rust backend:

- **Base URL**: `http://localhost:5657`
- **Authentication**: JWT tokens via GitHub OAuth
- **Endpoints**: User, Project, Coin, Message management

### Backend API Documentation:
See: `/Users/vipulyadav/Desktop/iris/server/API.md`

---

## ⚠️ Important Notes

### First Login:
- First user to login via GitHub will be created as **Member**
- You'll need to manually promote them to **Admin** in MongoDB
- Or create admin users via API

### MongoDB Access:
```bash
mongosh
use iris_robotics
db.users.find()  # View all users
db.users.updateOne({email: "your@email.com"}, {$set: {role: "Admin"}})  # Make admin
```

---

## 🐛 Troubleshooting

### Backend Won't Start:
1. Check MongoDB is running: `brew services list`
2. Verify `.env` file exists in `/server/`
3. Check Rust is installed: `cargo --version`

### Can't Login:
1. Ensure backend is running on port 5657
2. Verify GitHub OAuth app is created
3. Check `.env` has correct GitHub credentials

### Frontend Errors:
1. Run `npm install` in `/frontend/`
2. Check console for specific errors
3. Verify backend API is accessible

---

## 📝 Next Steps

1. ✅ Wait for backend to finish compiling
2. ⏳ Set up GitHub OAuth app
3. ⏳ Update `.env` with OAuth credentials
4. ⏳ Test login flow
5. ⏳ Create first admin user

---

## 📞 Need Help?

Check the documentation:
- Backend API: `/server/API.md`
- Backend Setup: `/server/SETUP.md`
- Main README: `/README.md`

---

**Created**: November 19, 2025
**Version**: 1.0.0
