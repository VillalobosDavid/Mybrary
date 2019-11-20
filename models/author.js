// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');
const Book = require('./book');

// Database Schema for Authors
const authorSchema = new mongoose.Schema({
	name : {
		type     : String,
		required : true
	}
});

// Defines a pre hook for the document.  Making sure NOT to delete authors who have books in database
// Using "function()" instead of "=>" arrow function because need reference to "this" object.
authorSchema.pre('remove', function(next) {
	Book.find({ author: this.id }, (error, books) => {
		if (error) {
			// Internal error with mongoose
			next(error);
		} else if (books.length > 0) {
			// Author has book(s) in the database, Author CAN NOT be deleted.
			next(new Error('This author has books still'));
		} else {
			// Author CAN be deleted.
			next();
		}
	});
});

// Exporting the "model" object to be used by Application
// "Author":       Name of Table in MongoDB
// "authorSchema": Table Schema for Authors
module.exports = mongoose.model('Author', authorSchema);
