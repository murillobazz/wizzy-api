const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response, next) => {
	const { username, password } = request.body;
	// Query the DB to check for user existence
	const user = await User.findOne({ username });
	// Check if password is correct
	const passwordCorrect = user === null
		? false
		: bcrypt.compare(password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: 'Invalid username or password.'
		});
	}
	// Data to create the token
	const userForToken = {
		username: user.username,
		id: user._id
	};
	// We create the token and set the time for expiration
	const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '14 days'});

	response.status(200).send({
		token,
		username: user.username,
		name: user.name
	});
});

module.exports = loginRouter;