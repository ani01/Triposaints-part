import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// CORS configuration to support credentials
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Session configuration with proper security settings
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Facebook authentication successful");
        console.log("User Profile:", profile);
        // Store access token in the user profile for later use
        profile.accessToken = accessToken;
        return done(null, profile);
      } catch (error) {
        console.error("❌ Error in Facebook strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}?error=auth_failed`,
  }),
  (req, res) => {
    try {
      console.log("✅ User authenticated successfully");
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
    } catch (error) {
      console.error("❌ Error in callback:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=callback_error`);
    }
  }
);

// Instagram OAuth - Manual implementation using Instagram Basic Display API
app.get("/auth/instagram", (req, res) => {
  const redirectUri = `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/instagram/callback`;
  console.log("🔍 Instagram Auth - Redirect URI:", redirectUri);
  console.log("🔍 Instagram Client ID:", process.env.INSTAGRAM_CLIENT_ID);
  
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
  
  console.log("🔗 Redirecting to:", instagramAuthUrl);
  res.redirect(instagramAuthUrl);
});

app.get("/auth/instagram/callback", async (req, res) => {
  const { code, error, error_reason, error_description } = req.query;

  console.log("📥 Instagram callback received");
  console.log("Query params:", req.query);

  if (error) {
    console.error("❌ Instagram OAuth error:", error);
    console.error("Error reason:", error_reason);
    console.error("Error description:", error_description);
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=auth_failed&reason=${error_reason}`);
  }

  if (!code) {
    console.error("❌ No authorization code received");
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=auth_failed`);
  }

  try {
    const redirectUri = `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/instagram/callback`;
    
    console.log("🔄 Exchanging code for token...");
    console.log("Redirect URI:", redirectUri);
    console.log("Client ID:", process.env.INSTAGRAM_CLIENT_ID);
    
    // Exchange code for access token
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const tokenText = await tokenResponse.text();
    console.log("📝 Token response status:", tokenResponse.status);
    console.log("📝 Token response:", tokenText);

    if (!tokenResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(tokenText);
      } catch {
        errorData = { error: tokenText };
      }
      console.error("❌ Token exchange failed:", errorData);
      throw new Error(`Failed to exchange code for token: ${JSON.stringify(errorData)}`);
    }

    const tokenData = JSON.parse(tokenText);
    const { access_token, user_id } = tokenData;

    console.log("✅ Token received for user:", user_id);

    // Get long-lived token (60 days instead of 1 hour)
    console.log("🔄 Exchanging for long-lived token...");
    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${access_token}`
    );

    const longLivedText = await longLivedTokenResponse.text();
    console.log("📝 Long-lived token response:", longLivedText);
    
    let longLivedToken = access_token;
    try {
      const longLivedTokenData = JSON.parse(longLivedText);
      longLivedToken = longLivedTokenData.access_token || access_token;
      console.log("✅ Long-lived token obtained");
    } catch (e) {
      console.warn("⚠️  Could not get long-lived token, using short-lived token");
    }

    // Fetch user profile
    console.log("📥 Fetching user profile...");
    const profileResponse = await fetch(
      `https://graph.instagram.com/${user_id}?fields=id,username,account_type,media_count&access_token=${longLivedToken}`
    );

    const profileText = await profileResponse.text();
    console.log("📝 Profile response:", profileText);
    const profileData = JSON.parse(profileText);

    // Create user object
    const user = {
      id: profileData.id,
      username: profileData.username,
      displayName: profileData.username,
      provider: "instagram",
      accessToken: longLivedToken,
      accountType: profileData.account_type,
      mediaCount: profileData.media_count,
      _json: profileData,
    };

    // Store user in session
    req.login(user, (err) => {
      if (err) {
        console.error("❌ Session login error:", err);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=session_error`);
      }

      console.log("✅ Instagram user authenticated successfully");
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
    });
  } catch (error) {
    console.error("❌ Error in Instagram callback:", error);
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=callback_error`);
  }
});

app.get("/auth/instagram/media", async (req, res) => {
  if (!req.isAuthenticated() || req.user.provider !== "instagram") {
    return res.status(401).json({ 
      success: false, 
      message: "Not authenticated with Instagram" 
    });
  }

  try {
    const accessToken = req.user.accessToken;
    
    // Fetch user's media from Instagram API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram media");
    }

    const data = await response.json();
    
    res.json({
      success: true,
      media: data.data || [],
      paging: data.paging || null,
    });
  } catch (error) {
    console.error("❌ Error fetching Instagram media:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch Instagram media" 
    });
  }
});

// Search Instagram users by username (using Instagram Business API)
app.get("/api/instagram/search-user", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authenticated" 
    });
  }

  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ 
      success: false, 
      message: "Username is required" 
    });
  }

  try {
    // Note: This is a demonstration endpoint
    // Instagram's official API requires business accounts for user search
    // This endpoint would need proper implementation based on your API access
    
    res.json({
      success: true,
      message: "User search functionality requires Instagram Graph API with business account",
      info: {
        username,
        note: "Instagram Basic Display API does not support searching other users",
        alternative: "To search users and access their posts, you need:",
        requirements: [
          "Instagram Business or Creator account",
          "Facebook Page connected to Instagram",
          "Instagram Graph API access",
          "App Review approval for required permissions"
        ],
        publicAlternative: "You can direct users to Instagram web: https://www.instagram.com/" + username
      }
    });
  } catch (error) {
    console.error("❌ Error searching Instagram user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to search user" 
    });
  }
});

// Get Instagram hashtag media (requires Instagram Graph API - Business account)
app.get("/api/instagram/hashtag/:hashtag", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authenticated" 
    });
  }

  const { hashtag } = req.params;
  
  try {
    res.json({
      success: false,
      message: "Hashtag search requires Instagram Graph API",
      info: {
        hashtag,
        note: "This feature requires Instagram Business account and Graph API access",
        documentation: "https://developers.facebook.com/docs/instagram-api/guides/hashtag-search"
      }
    });
  } catch (error) {
    console.error("❌ Error fetching hashtag media:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch hashtag media" 
    });
  }
});

// Logout endpoint
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destroy error:", err);
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
