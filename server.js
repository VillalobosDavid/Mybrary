if (process.env.NODE_ENV !== 'production') {
	// NOT WORKING...
	// require('dotenv').parse();

	// Needed to access variables in ".env" file
	require('dotenv').config();
}
// console.log('process.env.DATABASE_URL: ' + process.env.DATABASE_URL);

// Fast, un-opinionated, minimalist web framework for node.
const express = require('express');
// Layout support for "ejs" (Embedded JavaScript templates) in express
const expressLayouts = require('express-ejs-layouts');
// Referencing the "index.js" Routes File
const indexRouter = require('./routes/index');

// Create Express Application Object
const app = express();
// SET View Engine to "ejs" (Embedded JavaScript templates) Package
app.set('view engine', 'ejs');
// SET Location of All Views
app.set('views', __dirname + '/views');
// SET Layout.ejs File within "views" Folder (TEMPLATE HTML FILE FOR ALL HTML FILES)
app.set('layout', 'layouts/layout');
// Instructing Express Application to USE "express-ejs-layouts" Package for Layouts
app.use(expressLayouts);
// Instructing Express Application to USE the Defined Location of All Public Files
app.use(express.static('public'));

// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
// Mongoose supports both promises and callbacks.
const mongoose = require('mongoose');
// Connecting to Database
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser    : true,
	useUnifiedTopology : true
});
const db = mongoose.connection;
// ERROR Event Listener
db.on('error', (error) => {
	console.error(error);
});
// SUCCESS Event Listener, called only once when Database has been opened.
db.once('open', () => {
	console.log('Connected to Mongoose Database.');
});

// Referencing the GET REQUEST of "index.js" Router File
app.use('/', indexRouter);

// Starting Server and Defining Listening Port
// "process.env.PORT" for Production
// "3000" for Development
app.listen(process.env.PORT || 3000);
