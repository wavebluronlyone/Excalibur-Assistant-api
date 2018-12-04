const config = require(`./config/${process.env.NODE_ENV || 'dev'}`);
module.exports = {
	...config,
};
