const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();

// GET REQUEST
router.get('/', (req, res) => {
	// Sending Text back to user (For Testing Purposes)
	// res.send('Hello World, Again.');

	// Rendering "index.ejs" View which uses the "layouts.ejs" Boiler Plate
	res.render('index');
});

// Exporting the "router" object to be used by "server.js"
module.exports = router;
