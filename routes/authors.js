const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Authors
const Author = require('../models/author');

// GET: ALL AUTHORS ROUTE (/authors)
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.name != null && req.query.name != '') {
		searchOptions.name = new RegExp(req.query.name, 'i');
	}
	try {
		const authors = await Author.find(searchOptions);
		res.render('authors/index', {
			authors       : authors,
			searchOptions : req.query
		});
	} catch (error) {
		res.redirect('/');
	}
});

// GET: SINGLE AUTHOR ROUTE (/authors/new)
router.get('/new', (req, res) => {
	res.render('authors/new', {
		author       : new Author(),
		errorMessage : ''
	});
});

// POST: CREATE NEW AUTHOR ROUTE (/authors)
router.post('/', async (req, res) => {
	const authorRecord = new Author({
		name : req.body.name
	});

	try {
		const newAuthor = await authorRecord.save();
		// res.redirect(`authors/${newAuthor.id}`);
		res.redirect('authors');
	} catch (error) {
		res.render('authors/new', {
			author       : authorRecord,
			errorMessage : 'Error Creating Author'
		});
	}

	// OLD WAY OF DOING IT
	// authorRecord.save((err, newAuthor) => {
	// 	if (err) {
	// 		res.render('authors/new', {
	// 			author       : authorRecord,
	// 			errorMessage : 'Error Creating Author'
	// 		});
	// 	} else {
	// 		// res.redirect(`authors/${newAuthor.id}`);
	// 		res.redirect('authors');
	// 	}
	// });

	// // NOT NEEDED ANYMORE
	// // res.send(author);
});

// Exporting the "router" object to be used by Application
module.exports = router;
