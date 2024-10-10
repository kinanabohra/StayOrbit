const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user'); // Assuming you have a User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        return done(null, false, { message: "You need to register first on the website." });
      }

      if (!user.photo && profile.photos && profile.photos.length > 0) {
        user.photo = profile.photos[0].value;
        await user.save();
      }

      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
