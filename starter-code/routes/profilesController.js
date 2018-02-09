const express = require("express");
const router = express.Router();

const Trip = require("../models/trip");
const User = require("../models/user");

router.get("/:id", (req, res, next) => {
	User.findOne({ provider_id: req.params.id }, (errUser, user) => {
		if (errUser || !user) {
			next(err || new Error("User not found"));
		} else {
			Trip.find({ user_id: req.params.id }, (err, trips) => {
				if (err) {
					next(err);
				} else {
					res.render("profiles/index", { user, trips });
				}
			});
		}
	});
});

router.get("/:id/show/:tripId", (req, res, next) => {
	Trip.findById(req.params.tripId , (err, trip) => {
		if (err || !trip) {
			next(err || new Error("No trip found"));
		} else {
			res.render("profiles/show", { trip });
		}
	});
});

module.exports = router;