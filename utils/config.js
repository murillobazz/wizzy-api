require('dotenv').config();

const PORT = process.env.PORT;
// The crossenv package allows the app to easily alternate
// enviroment variables, between test and production.
const MONGODB_URI = process.env.NODE_ENV === 'development'
	? process.env.DEV_MONGODB_URI
	: process.env.MONGODB_URI;

module.exports = {
	MONGODB_URI,
	PORT
};