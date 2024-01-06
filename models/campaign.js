const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	characters: {
		type: Array,
		required: true
	},
	createdAt: {
		type: String,
		required: true
	}
});

campaignSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Campaign', campaignSchema);