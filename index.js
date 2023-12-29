require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Campaign = require('./models/campaign');

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({error: 'Malformatted id.'});
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message});
	}

	next(error);
};

app.use(cors());

// This is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json());
app.use(errorHandler);

app.get('/api/campaigns', (request, response, next) => {
	Campaign.find({}).sort( { createdBy: -1 } )
		.then(campaigns => {
			response.json(campaigns);
		})
		.catch(error => next(error));
});

app.get('/api/campaigns/:id', (request, response, next) => {
	Campaign.findById(request.params.id)
		.then(campaign => {
			if (campaign) {
				response.json(campaign);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

app.post('/api/campaigns', (request, response, next) => {
	const body = request.body;

	const campaign = new Campaign({
		title: body.title,
		category: body.category,
		characters: body.characters,
		createdAt: new Date().toLocaleDateString('pt-br')
	});

	campaign.save()
		.then(savedCampaign => {
			response.json(savedCampaign);
		})
		.catch(error => next(error));
});

app.put('/api/campaigns/:id', (request, response, next) => {
	const { title, category, characters } = request.body;

	// When the { new: true } parameter is included, the event handler 'updatedCampaign' will be the new document, instead of the replaced one.
	Campaign.findByIdAndUpdate(
		request.params.id,
		{ title, category, characters }, 
		{ new: true, runValidators: true, context: 'query' }
	)
		.then(updatedCampaign => {
			response.json(updatedCampaign);
		})
		.catch(error => next(error));
});

app.delete('/api/campaigns/:id', (request, response, next) => {
	Campaign.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
