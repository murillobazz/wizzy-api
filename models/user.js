const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minLength: 3,
		required: true
	},
	passwordHash: String,
	campaigns: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Campaign'
		}
	]
});

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// the passwordHash should NEVER be revealed!!!
		delete returnedObject.passwordHash;
	}
});

module.exports = mongoose.model('User', userSchema);