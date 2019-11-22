// Development: "DATABASE_URL" comes from ".env" file and database is pointing to local database.
// Production (Heroku): "DATABASE_URL" comes from server's configuration variables and database
//                      is pointing to MongoDB database.
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
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
const methodOverride = require('method-override');

// REFERENCING ROUTERS
// Referencing DEFAULT Routes
const indexRouter = require('./routes/index');
// Referencing AUTHORS Routes
const authorsRouter = require('./routes/authors');
// Referencing BOOKS Routes
const booksRouter = require('./routes/books');

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
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
// Instructing Express Application to USE the "body-parser" Package to Parse ALL REQUESTS
app.use(
	bodyParser.urlencoded({
		limit    : '10mb',
		extended : false
	})
);
// Instructing Express Application to USE "method-override" Package for REQUESTS.
// such as PUT or DELETE.
app.use(methodOverride('_method'));

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

// Routing DEFAULT REQUESTS
app.use('/', indexRouter);
// Routing AUTHORS REQUESTS
app.use('/authors', authorsRouter);
// Routing BOOKS REQUESTS
app.use('/books', booksRouter);

// Starting Server and Defining Listening Port
// "process.env.PORT" for Production
// "3000" for Development
app.listen(process.env.PORT || 3000);
