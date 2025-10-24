# Facebook SSO Troubleshooting Guide

This guide helps you resolve common issues with Facebook OAuth integration.

## 🔍 Common Issues and Solutions

### 1. "Given URL is not permitted by the application configuration"

**Problem**: Facebook doesn't allow the redirect URI.

**Solution**:
1. Go to Facebook Developers Console
2. Navigate to your app → Settings → Basic
3. Under "App Domains", add: `localhost`
4. Go to Facebook Login → Settings
5. Under "Valid OAuth Redirect URIs", add exactly:
   ```
   http://localhost:5000/auth/facebook/callback
   ```
6. Save changes and wait a few minutes for propagation

### 2. "Can't Load URL: The domain of this URL isn't included in the app's domains"

**Problem**: Facebook app domain configuration is missing or incorrect.

**Solution**:
1. In Facebook Developers Console → Settings → Basic
2. Add `localhost` to App Domains
3. Under Site URL, add: `http://localhost:3000`
4. Save and try again

### 3. Session Not Persisting / User Not Authenticated

**Problem**: Cookies are not being sent or stored correctly.

**Solution**:
1. Check browser console for CORS errors
2. Verify CORS configuration in `Server.js`:
   ```javascript
   app.use(cors({
     origin: "http://localhost:3000",
     credentials: true,
   }));
   ```
3. Ensure frontend requests include credentials:
   ```javascript
   fetch(url, { credentials: 'include' })
   ```
4. Check if cookies are enabled in your browser
5. Clear browser cookies and try again

### 4. "Invalid App ID" or "Invalid Client Secret"

**Problem**: Facebook credentials are incorrect or not loaded.

**Solution**:
1. Verify `.env` file exists in the root directory
2. Check `FB_APP_ID` and `FB_APP_SECRET` are correct
3. Ensure no extra spaces or quotes in `.env` file
4. Restart the backend server after changing `.env`
5. Check server logs for "undefined" app ID/secret

### 5. "This app is in development mode"

**Problem**: Facebook app is in development mode and you're not a tester.

**Solution**:
1. Go to Facebook Developers Console → Roles
2. Add your Facebook account as a Test User or Developer
3. OR set app to Live mode (requires business verification)
4. For development, adding yourself as tester is sufficient

### 6. Backend Server Not Starting

**Problem**: Port already in use or dependencies missing.

**Solution**:
1. Check if another process is using port 5000:
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```
2. Kill the process or change PORT in `.env`
3. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
4. Check for syntax errors in `Server.js`

### 7. Frontend Not Connecting to Backend

**Problem**: API requests failing or showing network errors.

**Solution**:
1. Verify backend is running on port 5000
2. Check `config.js` has correct API_URL
3. Test backend health endpoint:
   ```
   http://localhost:5000/health
   ```
4. Check browser console for CORS or network errors
5. Verify firewall isn't blocking local connections

### 8. "Error in Facebook strategy" in Logs

**Problem**: Error during Facebook authentication callback.

**Solution**:
1. Check server logs for detailed error message
2. Verify Facebook app is not restricted
3. Ensure all required permissions are requested
4. Check if profile fields are accessible:
   ```javascript
   profileFields: ["id", "displayName", "photos", "email"]
   ```
5. Some fields (like email) require app review for public apps

### 9. Redirect Loop or Infinite Redirects

**Problem**: Application keeps redirecting between pages.

**Solution**:
1. Clear browser cookies and cache
2. Check `App.jsx` routing logic
3. Verify session is being created correctly
4. Check browser console for JavaScript errors
5. Ensure `/dashboard` route is properly handled

### 10. "Cannot GET /dashboard" Error

**Problem**: React Router not configured or missing.

**Solution**:
1. The app uses simple pathname checking, not React Router
2. Verify `App.jsx` checks `window.location.pathname`
3. Ensure Vite dev server is configured for SPA:
   ```javascript
   // In vite.config.js, ensure history fallback
   ```

## 🛠️ Debugging Tips

### Enable Detailed Logging

Add to `Server.js`:
```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Log session info
app.get('/auth/user', (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Authenticated:', req.isAuthenticated());
  // ... rest of code
});
```

### Check Environment Variables

```javascript
console.log('FB_APP_ID:', process.env.FB_APP_ID ? '✅ Set' : '❌ Missing');
console.log('FB_APP_SECRET:', process.env.FB_APP_SECRET ? '✅ Set' : '❌ Missing');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ Set' : '❌ Missing');
```

### Test Backend Endpoints Directly

Use browser or Postman:
- Health: `http://localhost:5000/health`
- Start OAuth: `http://localhost:5000/auth/facebook`
- Check user: `http://localhost:5000/auth/user`

### Check Browser Console

Look for:
- CORS errors (red messages about cross-origin)
- Network failures (check Network tab)
- JavaScript errors (check Console tab)

## 📋 Verification Checklist

Before reporting an issue, verify:

- [ ] `.env` file exists with correct Facebook credentials
- [ ] Backend server is running without errors
- [ ] Frontend server is running on port 3000
- [ ] Facebook app callback URL matches exactly
- [ ] Your Facebook account is added as app tester
- [ ] Cookies are enabled in browser
- [ ] No CORS errors in browser console
- [ ] `node_modules` installed in both backend and frontend
- [ ] Ports 3000 and 5000 are not blocked by firewall

## 🆘 Still Having Issues?

1. Check server console logs for errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Try in a different browser or incognito mode
5. Clear all cookies and cache
6. Restart both backend and frontend servers
7. Check Facebook app status in Developer Console

## 📞 Getting Help

If you're still stuck:
1. Document the exact error message
2. Note which step fails (login button, redirect, callback, etc.)
3. Include relevant log outputs from server
4. Check if issue occurs in multiple browsers
5. Create an issue with all above information

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use strong, random SESSION_SECRET in production
- Enable HTTPS in production
- Set secure cookies in production
- Keep Facebook app secret confidential
- Regularly update dependencies for security patches
