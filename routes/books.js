const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Authors
const Author = require('../models/author');
// Referencing the "Model" object for Books
const Book = require('../models/book');

// Referencing the "Multer" package to upload files
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// Creating the book cover image location path
const uploadPath = path.join('public', Book.coverImageBasePath);
// Type of image files accepted by upload
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const upload = multer({
	dest       : uploadPath,
	fileFilter : (req, file, callback) => {
		callback(null, imageMimeTypes.includes(file.mimetype));
	}
});

// GET: ALL BOOKS ROUTE (/books)
router.get('/', async (req, res) => {
	// Obtaining the Query Statement, NOT running the query.
	let query = Book.find();
	if (req.query.title != null && req.query.title != '') {
		query = query.regex('title', new RegExp(req.query.title, 'i'));
	}
	if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
		query = query.lte('publishDate', req.query.publishedBefore);
	}
	if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
		query = query.gte('publishDate', req.query.publishedAfter);
	}

	try {
		// Execute the modified query
		const books = await query.exec();
		res.render('books/index', {
			books         : books,
			searchOptions : req.query
		});
	} catch (error) {
		res.redirect('/');
	}
});

// GET: SINGLE BOOK ROUTE (/books/new)
router.get('/new', async (req, res) => {
	renderNewPage(res, new Book());
});

// POST: CREATE NEW BOOKS ROUTE (/books)
// "upload.single('cover')": Uploading image before adding book to database
router.post('/', upload.single('cover'), async (req, res) => {
	// MiddleWare "upload.single()" return response in "req.file" object
	const fileName = req.file != null ? req.file.filename : null;
	const book = new Book({
		title          : req.body.title,
		author         : req.body.author,
		publishDate    : new Date(req.body.publishDate),
		pageCount      : req.body.pageCount,
		coverImageName : fileName,
		description    : req.body.description
	});
	// console.log('Book: ' + JSON.stringify(book));

	try {
		const newBook = await book.save();
		// res.redirect(`books/${newBook.id}`);
		res.redirect('books');
	} catch (error) {
		// If image was uploaded, delete it.
		if (book.coverImageName != null) {
			removeBookCoverImage(book.coverImageName);
		}
		renderNewPage(res, book, true);
	}
});

async function renderNewPage(res, book, hasError = false) {
	try {
		const authors = await Author.find({});
		const params = {
			authors : authors,
			book    : book
		};
		if (hasError) {
			params.errorMessage = 'Error Creating Book';
		}
		res.render('books/new', params);
	} catch (error) {
		res.redirect('books');
	}
}

function removeBookCoverImage(fileName) {
	fs.unlink(path.join(uploadPath, fileName), (err) => {
		if (err) console.error('ERROR DELETING IMAGE: ' + err);
	});
}

// Exporting the "router" object to be used by Application
module.exports = router;
