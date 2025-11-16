# IRIS Server Setup Guide
This guide will help you set up and run the IRIS server with GitHub OAuth authentication.

## Setting Up GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: IRIS Server
   - **Homepage URL**: http://localhost:5657
   - **Authorization callback URL**: http://localhost:5657/auth/github/callback
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret** to your `.env` file

## Running the Server

```bash
# Install dependencies
cargo build

# Run the server
cargo run
```

The server will start on `http://localhost:5657`