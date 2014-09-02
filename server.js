var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongoose');

mongo.connect('mongodb://localhost/test');

var bookSchema = mongo.Schema({
	id: Number,
	author: String,
	title: String,
	customerId: Number
});
var Book = mongo.model('Book', bookSchema);

var customerSchema = mongo.Schema({
	id: Number,
	name: String
});
var Customer = mongo.model('Customer', customerSchema);

var app = express();
app.use(bodyParser.urlencoded());

/**
 * GET /books
 * GET POST PUT DELETE /books/:id
 * GET /books/:id/customers
 */

app.get('/books', function(req, resp) {
	Book.find(function(err, books) {
		resp.send(books);
	});
});

app.post('/books/:id', function(req, resp) {
	var newBook = new Book({
		id: req.param('id'),
		author: req.param('author'),
		title: req.param('title'),
		customerId: null
	});
	newBook.save(function(err, book) {
		if (err) console.log(err);
		resp.send(book);
	});
});

app.put('/books/:id', function(req, resp) {
	var id = req.param('id');
	Book.findOneAndUpdate({
		id: id
	}, {
		$set: {
			author: req.param('author'),
			title: req.param('title')
		}
	}, function(err, book) {
		if (err) console.log(err);
		resp.send(book);
	});
});

app.delete('/books/:id', function(req, resp) {
	var id = req.param('id');
	Book.remove({
		id: id
	}, function(err) {
		if (err) console.log(err);
		resp.send('Book with id = ' + id + ' was deleted.');
	});
});

/*
 * GET /customers
 * GET POST PUT DELETE /customers/:id
 * GET /customers/:id/books
 * POST DELETE /customers/:id/books/:id
 */

app.get('/customers', function(req, resp) {
	Customer.find(function(err, customers) {
		resp.send(customers);
	});
});

app.post('/customers/:id', function(req, resp) {
	var newCustomer = new Customer({
		id: req.param('id'),
		name: req.param('name')
	});
	newCustomer.save(function(err, customer) {
		if (err) console.log(err);
		resp.send(customer);
	});
});

app.put('/customers/:id', function(req, resp) {
	var id = req.param('id');
	Customer.findOneAndUpdate({
		id: id
	}, {
		$set: {
			name: req.param('name')
		}
	}, function(err, customer) {
		if (err) console.log(err);
		resp.send(customer);
	});
});

app.delete('/customers/:id', function(req, resp) {
	var id = req.param('id');
	Customer.remove({
		id: id
	}, function(err) {
		if (err) console.log(err);
		resp.send('Customer with id = ' + id + ' was deleted.');
	});
});

app.post('/customers/:id/books/:bookId', function(req, resp) {
	var customerId = req.param('id');
	var bookId = req.param('bookId');
	Book.findOneAndUpdate({id: bookId}, {
		$set: {
			customerId: customerId
		}
	}, function(err, book) {
		if (err) console.log(err);
		resp.send(book);
	});
});

app.delete('/customers/:id/books/:bookId', function(req, resp) {
	var customerId = req.param('id');
	var bookId = req.param('bookId');
	Book.findOneAndUpdate({id: bookId}, {
		$set: {
			customerId: null
		}
	}, function(err, book) {
		if (err) console.log(err);
		resp.send(book);
	});
});

app.get('/customers/:id/books', function(req, resp) {
	var id = req.param('id');
	Book.find({customerId: id}, function(err, books) {
		resp.send(books);
	});
});

app.use(function(err, req, resp, next) {
	console.error(err.stack);
	resp.status(500).send('batman broke...');
});

var server = app.listen(8080, function() {
	console.log('batman is listening...');
});