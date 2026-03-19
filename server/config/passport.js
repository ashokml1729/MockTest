const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // Check if email already exists
          user = await User.findOne({ where: { email: profile.emails[0].value } });
          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = 'google';
            user.isVerified = true;
            if (profile.photos && profile.photos[0]) {
              user.avatar = profile.photos[0].value;
            }
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              username: profile.displayName.replace(/\s+/g, '').toLowerCase() + '_' + profile.id.slice(-4),
              email: profile.emails[0].value,
              googleId: profile.id,
              authProvider: 'google',
              isVerified: true,
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
