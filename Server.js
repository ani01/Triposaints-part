import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Access Token:", accessToken);
      console.log("User Profile:", profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "user_posts", "public_profile"],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
