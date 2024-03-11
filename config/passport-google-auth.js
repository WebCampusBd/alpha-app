// const { oauthUser } = require('../models/users.model');
// const passport = require("passport");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// require("dotenv").config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:2000/auth/google/callback"
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     try {
//         const user = await oauthUser.findOne({ googleId: profile.id });
//         if(!user){
//             const newUser = new oauthUser({
//                 username : profile.displayName,
//                 googleId : profile.id
//             });
//              await newUser.save();
//             return cb(newUser, null);
//           }
//           else {
//             return cb( user);
//           }
//     } catch (error) {
//         return cb(error);
//     }
//   }
// ));

//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await oauthUser.findById(id);
//         done(null, user);
//     } catch (error) {
//         done(error, false);
//     }
//   });




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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  


  passport.deserializeUser( async (id, done) => {
    try {
        const user = await Normal.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
  });