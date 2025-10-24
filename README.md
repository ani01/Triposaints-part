# Triposaints - Facebook & Instagram SSO Integration

A full-stack application with Facebook and Instagram OAuth authentication using Express.js backend and React frontend.

## 🚀 Features

- ✅ Facebook OAuth 2.0 authentication
- ✅ Instagram Basic Display API authentication
- ✅ Secure session management
- ✅ User profile dashboard
- ✅ Logout functionality
- ✅ Error handling and user feedback
- ✅ CORS configured for secure communication
- ✅ Environment-based configuration
- ✅ Support for multiple authentication providers

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- A Facebook Developer account
- Facebook App credentials (App ID and App Secret)
- Instagram account (for Instagram OAuth)
- Instagram Basic Display API credentials (optional, for Instagram login)

## 🔧 Setup Instructions

### 1. Facebook App Configuration

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add "Facebook Login" product to your app
4. Configure OAuth settings:
   - **Valid OAuth Redirect URIs**: `http://localhost:5000/auth/facebook/callback`
   - **App Domains**: `localhost`
5. Copy your App ID and App Secret

### 2. Backend Setup

1. Navigate to the project root directory:
   ```bash
   cd Triposaints-part
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from the example:
   ```bash
   Copy-Item .env.example .env
4. Edit `.env` and add your Facebook credentials:
   ```env
   FB_APP_ID=your_facebook_app_id_here
   FB_APP_SECRET=your_facebook_app_secret_here
   INSTAGRAM_CLIENT_ID=your_instagram_app_id_here
   INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret_here
   SESSION_SECRET=generate_a_random_secret_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```

   **Note**: Instagram credentials are optional. If you only want Facebook login, you can skip the Instagram fields.NTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

   Server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/vite-project
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```
   Frontend will run on `http://localhost:3000`

### 4. Instagram Setup (Optional)

If you want to enable Instagram login, follow the [Instagram Setup Guide](./INSTAGRAM_SETUP.md) for detailed instructions.

**Quick steps:**
1. Add Instagram Basic Display product to your Facebook app
2. Configure redirect URIs
3. Add Instagram test users
4. Copy credentials to `.env`

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Choose to login with Facebook or Instagram
3. Authorize the app
4. You'll be redirected to the dashboard with your profile information
5. Click "Logout" to end your session

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Login with Facebook"
        ├── src/
        │   ├── App.jsx           # Main app component with routing
        │   ├── Button.jsx        # Facebook login button
        │   ├── InstagramButton.jsx # Instagram login button
        │   ├── Dashboard.jsx     # User dashboard after login
        │   ├── main.jsx         # React entry point
        │   └── ...
```
Triposaints-part/
├── Server.js              # Express backend with Passport.js
├── package.json           # Backend dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example          # Environment variables template
└── Frontend/
    └── vite-project/
        ├── src/
        │   ├── App.jsx           # Main app component with routing
        │   ├── Button.jsx        # Facebook login button
        │   ├── Dashboard.jsx     # User dashboard after login
### Backend Endpoints

- `GET /auth/facebook` - Initiates Facebook OAuth flow
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /auth/instagram` - Initiates Instagram OAuth flow
- `GET /auth/instagram/callback` - Instagram OAuth callback
- `GET /auth/user` - Get current authenticated user
- `GET /auth/logout` - Logout current user
- `GET /health` - Server health check
- ✅ Secure session management with HTTP-only cookies
- ✅ CORS configured with credentials support
- ✅ Environment variables for sensitive data
- ✅ Production-ready session configuration
- ✅ Proper error handling and validation

## 🛠️ API Endpoints

### Backend Endpoints

- `GET /auth/facebook` - Initiates Facebook OAuth flow
- `GET /auth/facebook/callback` - Facebook OAuth callback
- `GET /auth/user` - Get current authenticated user
- `GET /auth/logout` - Logout current user
- `GET /health` - Server health check

## 🐛 Troubleshooting

### Common Issues

1. **"App Not Set Up" error on Facebook**
   - Ensure your app is in development mode and your Facebook account is added as a tester
   - Verify redirect URI matches exactly: `http://localhost:5000/auth/facebook/callback`

2. **Session not persisting**
   - Check if cookies are enabled in your browser
   - Ensure CORS credentials are set to `true`
   - Verify the frontend is using `credentials: 'include'` in fetch requests

| Variable | Description | Default |
|----------|-------------|---------|
| `FB_APP_ID` | Facebook App ID | Required |
| `FB_APP_SECRET` | Facebook App Secret | Required |
| `INSTAGRAM_CLIENT_ID` | Instagram App ID | Optional |
| `INSTAGRAM_CLIENT_SECRET` | Instagram App Secret | Optional |
| `SESSION_SECRET` | Session encryption key | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |
| `BACKEND_URL` | Backend URL | http://localhost:5000 |
     # Find process on port 5000
     Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
     # Kill the process (replace PID with actual process ID)
     Stop-Process -Id PID
     ```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FB_APP_ID` | Facebook App ID | Required |
| `FB_APP_SECRET` | Facebook App Secret | Required |
| `SESSION_SECRET` | Session encryption key | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |
| `BACKEND_URL` | Backend URL | http://localhost:5000 |

## 🚀 Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in your environment
2. Use a strong, random `SESSION_SECRET`
3. Update `FRONTEND_URL` and `BACKEND_URL` to your production domains
4. Update Facebook app settings with production callback URLs
5. Enable HTTPS and set `secure: true` for cookies
6. Add your production domain to Facebook app's App Domains

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

If you encounter any issues, please check the troubleshooting section or create an issue in the repository.
