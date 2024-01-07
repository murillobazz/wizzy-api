const campaignsRouter = require('express').Router();
const Campaign = require('../models/campaign');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const tokenDecoder = (token) => {
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!decodedToken.id) {
		return null;
	}
	return decodedToken.id;
};

// This GET call has been modified to only show campaigns that belong to the logged user.
campaignsRouter.get('/', async (request, response, next) => {
	const decodedToken = tokenDecoder(request.token);
	if (!decodedToken) {
		return response.status(401).json({
			error: 'Invalid token.'
		});
	}
	const user = await User.findById(decodedToken);

	try {
		// The populate method, from the mongoose library, works like a join method from relational DBs.
		// We indicate which collection we want to relate to, and the properties we want returned.
		// The functionality of the populate method of Mongoose is based on the fact that we have 
		// defined "types" to the references in the Mongoose schema with the ref option
		const campaigns = await Campaign.find({ user:  user.id }).populate('user', { username: 1 });

		response.json(campaigns);
	} catch(error) {
		next(error);
	}

});

campaignsRouter.get('/:id', async (request, response, next) => {
	const decodedToken = tokenDecoder(request.token);
	if (!decodedToken) {
		return response.status(401).json({
			error: 'Invalid token.'
		});
	}

	try {
		const campaign = await Campaign.findById(request.params.id);
		
		response.json(campaign);
	} catch(error) {
		next(error);
	}

});

campaignsRouter.post('/', async (request, response, next) => {
	const body = request.body;

	try {
		// Verifies if the user is logged in with a valid token.
		// jwt.verify returns an object with username and id, which tell the server who made the request.
		const decodedToken = tokenDecoder(request.token);
		if (!decodedToken) {
			return response.status(401).json({
				error: 'Invalid token.'
			});
		}
	
		const user = await User.findById(decodedToken);

		const campaign = new Campaign({
			title: body.title,
			category: body.category,
			characters: body.characters,
			createdAt: new Date().toLocaleDateString('pt-br'),
			user: user._id
		});

		const savedCampaign = await campaign.save();
		user.campaigns = user.campaigns.concat(savedCampaign._id);
		await user.save();

		response.status(201).json(savedCampaign);
	} catch (error) {
		next(error);
	}
});

campaignsRouter.put('/:id', async (request, response, next) => {
	const { title, category, characters } = request.body;

	const decodedToken = tokenDecoder(request.token);
	if (!decodedToken) {
		return response.status(401).json({
			error: 'Invalid token.'
		});
	}

	const user = await User.findById(decodedToken);
	if (!(user.campaigns.includes(request.params.id))) {
		return response.status(401).json({
			error: 'Unauthorized'
		});
	}

	try {
		// When the { new: true } parameter is included, the event handler 'updatedCampaign' will be the new document, instead of the replaced one.
		const updatedCampaign = await Campaign.findByIdAndUpdate(
			request.params.id,
			{ title, category, characters }, 
			{ new: true, runValidators: true, context: 'query' }
		);

		response.status(200).json(updatedCampaign);
	} catch(error) {
		next(error);
	}


});

campaignsRouter.delete('/:id', async (request, response, next) => {
	const decodedToken = tokenDecoder(request.token);
	if (!decodedToken) {
		return response.status(401).json({
			error: 'Invalid token.'
		});
	}

	const user = await User.findById(decodedToken);
	console.log(user);
	if (!(user.campaigns.includes(request.params.id))) {
		return response.status(401).json({
			error: 'Unauthorized'
		});
	}

	try {
		await Campaign.findByIdAndRemove(request.params.id);

		response.status(204).end();
	} catch(error) {
		next(error);
	}
});

module.exports = campaignsRouter;
