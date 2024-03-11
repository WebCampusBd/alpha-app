const passport = require("passport");
const bcrypt = require("bcrypt");
const { User, Normal } = require("../models/users.model");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config();

passport.use(
    new LocalStrategy( async (username, password, done) => {
        try {
            const user = await Normal.findOne({username : username});
            if (!user) { return done(null, false, {message : "invalid username"}); };
            if (!bcrypt.compare(password,user.password)) { return done(null, false, {message : "invalid password"}); };
            return done(null, user);
        } catch (error) {
            return done(err); 
        }
    }
  ));

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://alpha-app.vercel.app/auth/google/callback",
      },
       async function (accessToken, refreshToken, profile, cb) {
          try {
            const user = await  User.findOne({ googleId: profile.id });
            if (!user) {
                let newUser = new User({
                  googleId: profile.id,
                  username: profile.displayName,
                });
                await newUser.save();
                return cb(null, newUser);
              } else {
                return cb(null, user);
              }
          } catch (error) {
            return cb(error, null);
          }
      }
    )
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser( async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
  });

  passport.deserializeUser( async (id, done) => {
    try {
        const user = await Normal.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
  });

