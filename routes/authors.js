const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Authors
const Author = require('../models/author');
// Referencing the "Model" object for Books
const Book = require('../models/book');

// **********************************************************************
// NOTE: All routes are evaluated in the order defined (TOP TO BOTTOM).
// **********************************************************************

// GET (RETRIEVE): ALL AUTHORS ROUTE (/authors)
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.name != null && req.query.name != '') {
		// "i": Case insensitive search
		searchOptions.name = new RegExp(req.query.name, 'i');
	}
	try {
		const authors = await Author.find(searchOptions);
		res.render('authors/index', {
			authors: authors,
			searchOptions: req.query
		});
	} catch (error) {
		res.redirect('/');
	}
});

// GET (RETRIEVE): NEW AUTHOR ROUTE (/authors/new)
// IMPORTANT: This route needs to be defined before "router.get('/:id')", because if it's not
//            router will interpret "new" to be the value for parameter ":id"; therefor, never
//            executing this route.
router.get('/new', (req, res) => {
	res.render('authors/new', {
		author: new Author(),
		errorMessage: ''
	});
});

// GET (RETRIEVE): SINGLE AUTHOR ROUTE (/authors/##)
router.get('/:id', async (req, res) => {
	try {
		// Message issued by "router.delete()" of "Author", not been able to DELETE record.
		var warningMessage = (req.query.message)? req.query.message: '';
		// Get the Author record
		const author = await Author.findById(req.params.id);
		// Get the Book record(s) for the Author, if available.
		const books = await Book.find({ author: author.id }).limit(6).exec();
		res.render('authors/show', {
			author: author,
			booksByAuthor: books,
			errorMessage: warningMessage
		});
	} catch (error) {
		// USED FOR DEBUGGING PURPOSES
		// console.log(error);
		res.redirect('/');
	}
});

// GET (RETRIEVE): SINGLE AUTHOR ROUTE (/authors/##/edit)
router.get('/:id/edit', async (req, res) => {
	try {
		const author = await Author.findById(req.params.id);
		res.render('authors/edit', {
			author: author
		});
	} catch (error) {
		res.redirect('/authors');
	}
});

// POST (CREATE): NEW AUTHOR ROUTE (/authors)
router.post('/', async (req, res) => {
	const author = new Author({
		name: req.body.name
	});

	try {
		const newAuthor = await author.save();
		res.redirect(`/authors/${newAuthor.id}`);
	} catch (error) {
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error creating Author'
		});
	}
});

// PUT (UPDATE): SINGLE AUTHOR ROUTE (/authors/##)
router.put('/:id', async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);
		author.name = req.body.name;
		await author.save();
		res.redirect(`/authors/${author.id}`);
	} catch (error) {
		if (author == null) {
			// Author Record NOT FOUND
			res.redirect('/');
		} else {
			// Problem Updating Author Record
			res.render('authors/edit', {
				author: author,
				errorMessage: 'Error Updating Author'
			});
		}
	}
});

// DELETE (DELETE): SINGLE AUTHOR ROUTE (/authors/##)
router.delete('/:id', async (req, res) => {
	let author;
	try {
		author = await Author.findById(req.params.id);
		await author.remove();
		res.redirect('/authors');
	} catch (error) {
		if (author == null) {
			// "Author" Record NOT FOUND
			res.redirect('/');
		} else {
			// "Author" Record has books associated with it. CAN NOT be DELETED, will leave orphan records behind.
			// Passing WARNING as a variable "message" in the query string to be displayed to user.
			var message = encodeURIComponent(error.message);
			res.redirect(`/authors/${author.id}?message=${message}`);
			// res.redirect(`/authors/${author.id}`);
		}
	}
});

// Exporting the "router" object to be used by Application
module.exports = router;
