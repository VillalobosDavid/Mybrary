const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Authors
const Author = require('../models/author');
// Referencing the "Model" object for Books
const Book = require('../models/book');

// Type of image files accepted by upload
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

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
router.post('/', async (req, res) => {
	const book = new Book({
		title       : req.body.title,
		author      : req.body.author,
		publishDate : new Date(req.body.publishDate),
		pageCount   : req.body.pageCount,
		description : req.body.description
	});

	// Save image (BUFFER base64) and its type to database schema
	saveCover(book, req.body.cover);

	try {
		const newBook = await book.save();
		// res.redirect(`books/${newBook.id}`);
		res.redirect('books');
	} catch (error) {
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

// ***********************************************************
// Save image in a database buffer field
// ***********************************************************
// Example JSON file returned by "FilePond" drop area
// ***********************************************************
// {
//     "id": "b56kpu6u9",
//     "name": "encoded-file.png",
//     "type": "image/png",
//     "size": 123456,
//     "metadata": {
//         "resize": {
//             "mode": "force",
//             "size": {
//                 "width": 200,
//                 "height": 200
//             }
//         },
//         "crop": {
//             "rect": {
//                 "x": 0.19234,
//                 "y": 0,
//                 "width": 1,
//                 "height": 0.61213
//             },
//             "aspectRatio": 1
//         }
//     },
//     "data": "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAA..."
// }
function saveCover(book, coverEncoded) {
	if (coverEncoded == null) return;

	const cover = JSON.parse(coverEncoded);
	if (cover != null && imageMimeTypes.includes(cover.type)) {
		// Converting STRING data to BUFFER base64 data.
		book.coverImage = new Buffer.from(cover.data, 'base64');
		book.coverImageType = cover.type;
	}
}

// Exporting the "router" object to be used by Application
module.exports = router;
