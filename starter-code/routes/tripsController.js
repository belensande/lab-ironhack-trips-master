const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const Trip = require("../models/trip");

router.use("/", ensureLoggedIn("/"), (req, res, next) => {
	next();
});

router.get("/", (req, res, next) => {
	Trip.find({ user_id: req.user.provider_id }, (err, trips) => {
		if (err) {
			next(err);
		} else {
			res.render("trips/index", { trips });
		}
	});
});

router.get("/new", (req, res, next) => {
	res.render("trips/new.ejs");
});

router.post("/new", upload.single('photo'), (req, res, next) => {

	const trip = new Trip({
		user_id: req.user.provider_id,
		user_name: req.user.provider_name,
		destination: req.body.destination,
		description: req.body.description,
		pic_path: `/uploads/${req.file.filename}`
	});

	if (trip.destination === "") {
		res.render("trips/new.ejs", { errorMessage: "Destination is mandatory", destination: trip.destination, description: trip.description });
	}

	trip.save((err) => {
		if (err) {
			if (err.name == 'ValidationError') {
				res.render("trips/new.ejs", { errorMessage: err.errors[0].message, destination: trip.destination, description: trip.description });
			} else {
				next(err);
			}
			return;
		}
		res.redirect('/my-trips', );
	});
});

router.get("/edit/:id", (req, res, next) => {
	Trip.findById(req.params.id, (err, trip) => {
		if (err || !trip) {
			next(err || new Error("No trip found"));
		} else if (trip.user_id != req.user.provider_id) {
			next(new Error("You can't edit trips you don't own"));
		} else {
			res.render("trips/edit.ejs", { trip });
		}
	});
});

router.post("/edit/:id", upload.single('photo'), (req, res, next) => {

	let trip = {
		"destination": req.body.destination,
		"description": req.body.description
	};

	if (req.file) {
		trip["pic_path"] = `/uploads/${req.file.filename}`
	}

	if (trip.destination === "") {
		res.render("trips/edit.ejs", { errorMessage: "Destination is mandatory", trip });
	}

	Trip.findByIdAndUpdate(req.params.id, { $set: trip },
		{ runValidators: true }, (err) => {
		if (err) {
			if (err.name == 'ValidationError') {
				res.render("trips/edit.ejs", { errorMessage: err.errors[0].message, trip });
			} else {
				next(err);
			}
			return;
		}
		res.redirect('/my-trips', );
	});
});

router.post("/delete/:id", (req, res, next) => {
	Trip.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			next(err)
		} else {
			res.redirect('/my-trips', );
		}
	});
});

module.exports = router;