const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1041922794840-pmmd7s2282qmvhlq8tp6bm9fjo47vdo0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);
