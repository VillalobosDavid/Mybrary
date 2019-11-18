// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');

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
	coverImage     : {
		type     : Buffer,
		required : true
	},
	coverImageType : {
		type     : String,
		required : true
	},
	author         : {
		type     : mongoose.Schema.Types.ObjectId,
		required : true,
		ref      : 'Author'
	}
});

// Returning an IMAGE OBJECT
// NOTE: Using "function" instead of "=>" arrow function because
//       need access to "this" object.
bookSchema.virtual('coverImagePath').get(function() {
	if (this.coverImage != null && this.coverImageType != null) {
		return `data:${this.coverImageType};charset:utf-8;base64,
		        ${this.coverImage.toString('base64')}`;
	}
});

// Exporting the "model" object to be used by Application
// "Book":       Name of Table in MongoDB
// "bookSchema": Table Schema for Books
module.exports = mongoose.model('Book', bookSchema);
