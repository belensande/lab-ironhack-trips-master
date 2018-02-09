const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

router.get("/facebook", ensureLoggedOut(), passport.authenticate("facebook"));

router.get("/facebook/callback", ensureLoggedOut(), passport.authenticate("facebook", {
	successRedirect: "/my-trips",
	failureRedirect: "/"
}));

module.exports = router;