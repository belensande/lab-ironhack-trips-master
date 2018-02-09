const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
	if (req.isAuthenticated()) {
		res.redirect('/my-trips');
	} else {
		res.render("home");
	}
});

module.exports = router;