const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const campaignsRouter = require('./controllers/campaigns');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
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

// middleware to extract the token from a request
const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '');
	}
	next();
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({error: 'Malformatted id.'});
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message});
	} else if (error.name ===  'JsonWebTokenError') {
		return response.status(400).json({ error: error.message });
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({
			error: 'Token expired'
		});
	}

	next(error);
};

app.use(tokenExtractor);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

module.exports = app;