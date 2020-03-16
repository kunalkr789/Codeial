const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "83098869927-8ghfi2rd3c4t4hptnrvhk6nt6eml6pth.apps.googleusercontent.com",
        clientSecret: "M9BGxchjbrod6Vy7AFzYIvJa",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){console.log('error in google passport-strategy', err); return;}

            console.log(accessToken, refreshToken);
            console.log(profile);   

            if(user){
                //if found, set this user as req.user
                return done(null, user);
            }else{
                //if not found, create the user and set this as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString(hex)
                }, function(err, user){
                    if(err){console.log('error in creating user google passport-strategy', err); return;}

                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;