const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');
const tokenDecoder = require('../utils/tokenDecoder');

usersRouter.get('/', async (request, response, next) => {

	// The populate method, from the mongoose library, works like a join method from relational DBs.
	// We indicate which collection we want to relate to, and the properties we want returned.
	// The functionality of the populate method of Mongoose is based on the fact that we have 
	// defined "types" to the references in the Mongoose schema with the ref option
	try {
		// Verifies if user is admin
		const decodedToken = tokenDecoder(request.token);
		if (!decodedToken) {
			return response.status(401).json({
				error: 'Invalid token.'
			});
		}
		const user = await User.findById(decodedToken);

		if (!user.isAdmin) {
			return response.status(401).json({
				error: 'Unauthorized'
			});
		}
		const users = await User.find({}).populate('campaigns', { title: 1, category: 1, characters: 1, createdAt: 1 });

		response.status(200).json(users);
	} catch(error) {
		next(error);
	}
});

usersRouter.post('/', async (request, response, next) => {
	const { username, name, password } = request.body;

	try {
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
			name,
			passwordHash
		});


		const savedUser = await user.save();
		response.status(201).json(savedUser);
	} catch(error) {
		next(error);
	}
});

usersRouter.get('/:id', async (request, response, next) => {
	try {
		const user = await User.findById(request.params.id);
		if (user) {
			response.status(200).json(user);
		} else {
			response.status(404).end();
		}
	} catch(error) {
		next(error);
	} 
});

usersRouter.delete('/:id', async (request, response, next) => {
	// Verifies if user is admin
	const decodedToken = tokenDecoder(request.token);
	if (!decodedToken) {
		return response.status(401).json({
			error: 'Invalid token.'
		});
	}
	const user = await User.findById(decodedToken);

	if (!user.isAdmin) {
		return response.status(401).json({
			error: 'Unauthorized'
		});
	}

	try {
		await User.findByIdAndRemove(request.params.id);

		response.status(204).end();
	} catch(error) {
		next(error);
	}

});


module.exports = usersRouter;