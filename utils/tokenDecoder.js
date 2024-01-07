const jwt = require('jsonwebtoken');

const tokenDecoder = (token) => {
	const decodedToken = jwt.verify(token, process.env.SECRET);
	if (!decodedToken.id) {
		return null;
	}
	return decodedToken.id;
};

module.exports = tokenDecoder;
