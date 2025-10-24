# Quick Reference Guide

## 🚀 Quick Start

```powershell
# 1. Setup (first time only)
.\setup.ps1

# 2. Configure Facebook credentials in .env
# Edit .env and add your FB_APP_ID and FB_APP_SECRET

# 3. Start application
.\start.ps1
```

## 📡 API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | GET | Server health check | No |
| `/auth/facebook` | GET | Start Facebook OAuth | No |
| `/auth/facebook/callback` | GET | OAuth callback | No |
| `/auth/user` | GET | Get current user | Yes |
| `/auth/logout` | GET | Logout user | Yes |

## 🔑 Environment Variables

### Required
- `FB_APP_ID` - Your Facebook App ID
- `FB_APP_SECRET` - Your Facebook App Secret
- `SESSION_SECRET` - Random secret key for sessions

### Optional
- `PORT` - Backend port (default: 5000)
- `NODE_ENV` - Environment (default: development)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `BACKEND_URL` - Backend URL (default: http://localhost:5000)

## 📦 NPM Scripts

### Backend (root directory)
```bash
npm start          # Start backend server
npm install        # Install dependencies
```

### Frontend (Frontend/vite-project)
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm install        # Install dependencies
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Facebook App Configuration

### Required Settings

1. **App Domains**: `localhost`
2. **Site URL**: `http://localhost:3000`
3. **Valid OAuth Redirect URIs**: `http://localhost:5000/auth/facebook/callback`

### Required Permissions
- `public_profile` (default)
- `email`

## 📂 Project Structure

```
Triposaints-part/
├── Server.js                          # Backend server
├── package.json                       # Backend dependencies
├── .env                              # Environment variables (create from .env.example)
├── .env.example                      # Environment template
├── README.md                         # Full documentation
├── TROUBLESHOOTING.md               # Troubleshooting guide
├── FIXED_ISSUES.md                  # List of fixed issues
├── QUICK_REFERENCE.md               # This file
├── setup.ps1                        # Setup script
├── start.ps1                        # Start script
└── Frontend/
    └── vite-project/
        ├── src/
        │   ├── App.jsx              # Main app
        │   ├── Button.jsx           # Login button
        │   ├── Dashboard.jsx        # User dashboard
        │   ├── config.js           # API configuration
        │   └── main.jsx            # Entry point
        └── package.json            # Frontend dependencies
```

## 🐛 Common Commands

### Check if ports are in use
```powershell
Get-NetTCPConnection -LocalPort 5000
Get-NetTCPConnection -LocalPort 3000
```

### Kill process on port
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

### Clear npm cache
```powershell
npm cache clean --force
```

### Reinstall dependencies
```powershell
Remove-Item node_modules -Recurse -Force
npm install
```

## 🔍 Debugging

### Check environment variables loaded
Add to Server.js:
```javascript
console.log('Environment check:');
console.log('FB_APP_ID:', process.env.FB_APP_ID ? 'Set' : 'Missing');
console.log('FB_APP_SECRET:', process.env.FB_APP_SECRET ? 'Set' : 'Missing');
```

### Check session in browser
Open DevTools → Application → Cookies → localhost:5000

### Check CORS
Open DevTools → Console → Look for CORS errors

### Test backend directly
Visit: http://localhost:5000/health

## ✅ Verification Checklist

- [ ] `.env` file exists with Facebook credentials
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Health endpoint returns OK
- [ ] Login button redirects to Facebook
- [ ] After Facebook auth, redirects to dashboard
- [ ] Dashboard shows user profile
- [ ] Logout button works
- [ ] Session persists on page refresh

## 📞 Getting Help

1. **Check TROUBLESHOOTING.md** for detailed solutions
2. **Check browser console** for JavaScript errors
3. **Check server logs** for backend errors
4. **Verify Facebook app settings** match exactly
5. **Clear browser cookies** and try again

## 🔐 Security Notes

- ❌ **Never commit** `.env` file
- ❌ **Never share** Facebook App Secret
- ✅ **Always use** HTTPS in production
- ✅ **Always use** strong SESSION_SECRET
- ✅ **Always verify** redirect URIs

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `SESSION_SECRET`
3. Update URLs to production domains
4. Enable HTTPS
5. Update Facebook app settings
6. Add production domain to App Domains
7. Add production callback URL

## 📝 Quick Tips

- Use **Incognito mode** for testing to avoid cookie issues
- **Restart servers** after changing `.env`
- **Check Facebook app status** in Developer Console
- **Add yourself as tester** in Facebook app
- **Use different browsers** if one doesn't work
- **Clear cookies** between tests

---

For detailed documentation, see **README.md**
For troubleshooting, see **TROUBLESHOOTING.md**
For fixed issues, see **FIXED_ISSUES.md**
