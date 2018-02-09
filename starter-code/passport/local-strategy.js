const passport = require("passport");
const User = require('../models/user');
const FbStrategy = require('passport-facebook').Strategy;
require("dotenv").config();

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

passport.use(new FbStrategy({
	clientID: FACEBOOK_CLIENT_ID,
	clientSecret: FACEBOOK_CLIENT_SECRET,
	callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({ facebookID: profile.id }, (err, user) => {
		if (err) {
			return done(err);
		}
		if (user) {
			return done(null, user);
		}

		const newUser = new User({
			provider_id: profile.id,
			provider_name: profile.displayName
		});

		User.findOne({ provider_id: newUser.provider_id }, (err, user) => {
			if (err) {
				return done(err);
			}
			if (user) {
				done(null, user);
			} else {
				newUser.save((saveErr) => {
					if (saveErr) {
						return done(saveErr);
					}
					done(null, newUser);
				});
			}
		});
	});

}));