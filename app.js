const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const campaignsRouter = require('./controllers/campaigns');
const usersRouter = require('./controllers/users');
const cors = require('cors');

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

app.use(cors());
// This is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({error: 'Malformatted id.'});
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message});
	}

	next(error);
};

app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', usersRouter);
app.use(errorHandler);

module.exports = app;