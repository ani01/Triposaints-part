import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as InstagramStrategy } from "passport-instagram";
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

// Instagram Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/instagram/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Instagram authentication successful");
        console.log("User Profile:", profile);
        profile.accessToken = accessToken;
        profile.provider = "instagram";
        return done(null, profile);
      } catch (error) {
        console.error("❌ Error in Instagram strategy:", error);
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

// Instagram OAuth routes
app.get(
  "/auth/instagram",
  passport.authenticate("instagram", {
    scope: ["user_profile", "user_media"],
  })
);

app.get(
  "/auth/instagram/callback",
  passport.authenticate("instagram", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}?error=auth_failed`,
  }),
  (req, res) => {
    try {
      console.log("✅ Instagram user authenticated successfully");
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`);
    } catch (error) {
      console.error("❌ Error in Instagram callback:", error);
      res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?error=callback_error`);
    }
  }
);

// Get current user session
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    const userData = {
      id: req.user.id,
      displayName: req.user.displayName || req.user.username,
      email: req.user.emails?.[0]?.value || null,
      photo: req.user.photos?.[0]?.value || req.user._json?.profile_picture || null,
      provider: req.user.provider || "facebook",
      username: req.user.username || null,
    };
    res.json({
      success: true,
      user: userData,
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

// Get Instagram user media (posts)
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
