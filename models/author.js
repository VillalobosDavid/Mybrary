// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');

// Database Schema for Authors
const authorSchema = new mongoose.Schema({
	name : {
		type     : String,
		required : true
	}
});

// Exporting the "model" object to be used by Application
// "Author":       Name of Table in MongoDB
// "authorSchema": Table Schema for Authors
module.exports = mongoose.model('Author', authorSchema);
