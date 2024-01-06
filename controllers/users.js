const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response, next) => {
	User.find({})
		.then(users => {
			response.status(200).json(users);
		})
		.catch(error => next(error));
});

usersRouter.post('/', async (request, response, next) => {
	const { username, password } = request.body;

	if (!password) {
		return response.status(400).json({
			error: 'Password is required.'
		});
	} else if (password.length < 8) {
		return response.status(400).json({
			error: 'Password must be at least 8 digits long.'
		});
	}

	const saltRounds = 13;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		passwordHash
	});

	try {
		const savedUser = await user.save();
		response.status(201).json(savedUser);
	} catch(error) {
		next(error);
	}
});

usersRouter.get('/:id', async (request, response, next) => {
	User.findById(request.params.id)
		.then(user => {
			if (user) {
				response.status(200).json(user);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

usersRouter.delete('/:id', (request, response, next) => {
	User.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});


module.exports = usersRouter;