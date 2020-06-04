const express = require('express');
// Referencing the "Router" function of "express"
const router = express.Router();
// Referencing the "Model" object for Authors
const Author = require('../models/author');
// Referencing the "Model" object for Books
const Book = require('../models/book');

// Type of image files accepted by upload
const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

// GET (RETRIEVE): ALL BOOKS ROUTE (/books)
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
			books: books,
			searchOptions: req.query
		});
	} catch (error) {
		res.redirect('/');
	}
});

// GET (RETRIEVE): SINGLE BOOK ROUTE (/books/new)
router.get('/new', async (req, res) => {
	renderFormPage(res, new Book(), 'new');
});

// GET (RETRIEVE): SINGLE BOOK ROUTE (/books/##)
router.get('/:id', async (req, res) => {
	try {
		// Get the Book record and populate Author record as well.
		// "author" in "Book" Schema/Table contains the ID of the "Author" Schema/Table
		const book = await Book.findById(req.params.id).populate('author').exec();
		res.render('books/show', {
			book: book
		});
	} catch (error) {
		res.redirect('/');
	}
});

// GET (RETRIEVE): SINGLE BOOK ROUTE (/books/##)
router.get('/:id/edit', async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		renderFormPage(res, book, 'edit');
	} catch (error) {
		res.redirect('/');
	}
});

// POST (CREATE): CREATE NEW BOOKS ROUTE (/books)
router.post('/', async (req, res) => {
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		pageCount: req.body.pageCount,
		description: req.body.description
	});

	if (req.body.cover != null && req.body.cover !== '') {
		// Save image (BUFFER base64) and its type to database schema
		saveCover(book, req.body.cover);
	}

	try {
		const newBook = await book.save();
		res.redirect(`/books/${newBook.id}`);
	} catch (error) {
		renderFormPage(res, book, 'new', true);

	}
});

// PUT (UPDATE): CREATE NEW BOOKS ROUTE (/books)
router.put('/:id', async (req, res) => {
	let book;
	try {
		book = await Book.findById(req.params.id);
		book.title = req.body.title;
		book.author = req.body.author;
		book.publishDate = new Date(req.body.publishDate);
		book.pageCount = req.body.pageCount;
		book.description = req.body.description;

		if (req.body.cover != null && req.body.cover !== '') {
			// Save image (BUFFER base64) and its type to "Book" Schema/Table
			saveCover(book, req.body.cover);
		}

		await book.save();
		res.redirect(`/books/${book.id}`);
	} catch (error) {
		if (book != null) {
			renderFormPage(res, book, 'edit', true);
		} else {
			redirect('/');
		}
	}
});

// DELETE (DELETE): SINGLE BOOK ROUTE (/books/##)
router.delete('/:id', async (req, res) => {
	let book;
	try {
		book = await Book.findById(req.params.id);
		await book.remove();
		res.redirect('/books');
	} catch (error) {
		if (book == null) {
			// Book Record NOT FOUND
			res.redirect('/');
		} else {
			// Problem Deleting Book Record
			res.render('books/show', {
				book: book,
				errorMessage: 'Could NOT remove book'
			});
		}
	}
});

async function renderFormPage(res, book, form, hasError = false) {
	try {
		const authors = await Author.find({});
		const params = {
			authors: authors,
			book: book
		};

		if (hasError) {
			if (form === 'edit') {
				params.errorMessage = 'Error Updating Book';
			} else {
				// 'new'
				params.errorMessage = 'Error Creating Book';
			}
		}
		res.render(`books/${form}`, params);
	} catch (error) {
		res.redirect('/books');
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
