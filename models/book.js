// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');

// Path to place book cover images
const coverImageBasePath = 'upload/bookCovers';
const path = require('path');

// Database Schema for Books
const bookSchema = new mongoose.Schema({
	title          : {
		type     : String,
		required : true
	},
	description    : {
		type : String
	},
	publishDate    : {
		type     : Date,
		required : true
	},
	pageCount      : {
		type     : Number,
		required : true
	},
	createdAt      : {
		type     : Date,
		required : true,
		default  : Date.now
	},
	coverImageName : {
		type     : String,
		required : true
	},
	author         : {
		type     : mongoose.Schema.Types.ObjectId,
		required : true,
		ref      : 'Author'
	}
});

// Returning the virtual path of the book cover image
// NOTE: Using "function" instead of "=>" arrow function because
//       need access to "this" object.
bookSchema.virtual('coverImagePath').get(function() {
	if (this.coverImageName != null) {
		return path.join('/', coverImageBasePath, this.coverImageName);
	}
});

// Exporting the "model" object to be used by Application
// "Book":       Name of Table in MongoDB
// "bookSchema": Table Schema for Books
module.exports = mongoose.model('Book', bookSchema);

// Exporting the "coverImageBasePath" constant
module.exports.coverImageBasePath = coverImageBasePath;
