// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');
const Book = require('./book');

// Database Schema/Table for "Authors"
const authorSchema = new mongoose.Schema({
	name : {
		type     : String,
		required : true
	}
});

// Defines a pre hook for the document.  Making sure NOT to delete authors who have books in the database
// Using "function()" instead of "=>" arrow function because need reference to "this" object.
authorSchema.pre('remove', function(next) {
	Book.find({ author: this.id }, (error, books) => {
		if (error) {
			// Internal error with mongoose, passing error to callback
			next(error);
		} else if (books.length > 0) {
			// Author has book(s) in the database, Author CAN NOT be deleted.  Passing message to callback.
			next(new Error('Can not delete author.  There are book(s) associated with the author.'));
			// console.log('Can not delete author.  There are book(s) associated with the author.');
		} else {
			// Author CAN be deleted.  Resuming execution of callback function.
			next();
		}
	});
});

// Exporting the "model" object to be used by Application
// "Author":       Name of Table in MongoDB
// "authorSchema": Table Schema for Authors
module.exports = mongoose.model('Author', authorSchema);
