const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Books
const Book = require('../models/book');

// GET REQUEST
router.get('/', async (req, res) => {
	// Sending Text back to user (For Testing Purposes)
	// res.send('Hello World, Again.');

	let books = [];
	try {
		// Obtaining the Query Statement, NOT running the query.
		let query = Book.find();
		books = await query.sort({ createdAt: 'desc' }).limit(10).exec();
	} catch (error) {
		books = [];
	}

	// Rendering "index.ejs" View which uses the "layouts.ejs" Boiler Plate
	res.render('index', {
		books : books
	});
});

// Exporting the "router" object to be used by "server.js"
module.exports = router;
