const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

passport.use(
    new GoogleStrategy(
      {
        clientID: config.Google.GOOGLE_CLIENT_ID,
        clientSecret: config.Google.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        const user = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        };
          const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
          done(null, token);
      }
    )
  );
  
  module.exports = passport;