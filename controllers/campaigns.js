const campaignsRouter = require('express').Router();
const Campaign = require('../models/campaign');

campaignsRouter.get('/', async (request, response, next) => {
	Campaign.find({}).sort( { createdBy: -1 } )
		.then(campaigns => {
			response.status(200).json(campaigns);
		})
		.catch(error => next(error));
});

campaignsRouter.get('/:id', (request, response, next) => {
	Campaign.findById(request.params.id)
		.then(campaign => {
			if (campaign) {
				response.status(200).json(campaign);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

campaignsRouter.post('/', (request, response, next) => {
	const body = request.body;

	const campaign = new Campaign({
		title: body.title,
		category: body.category,
		characters: body.characters,
		createdAt: new Date().toLocaleDateString('pt-br')
	});

	campaign.save()
		.then(savedCampaign => {
			response.status(201).json(savedCampaign);
		})
		.catch(error => next(error));
});

campaignsRouter.put('/:id', (request, response, next) => {
	const { title, category, characters } = request.body;

	// When the { new: true } parameter is included, the event handler 'updatedCampaign' will be the new document, instead of the replaced one.
	Campaign.findByIdAndUpdate(
		request.params.id,
		{ title, category, characters }, 
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updatedCampaign => {
			response.status(200).json(updatedCampaign);
		})
		.catch(error => next(error));
});

campaignsRouter.delete('/:id', (request, response, next) => {
	Campaign.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

module.exports = campaignsRouter;
