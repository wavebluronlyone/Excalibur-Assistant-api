const configfile = require(`./config/${process.env.NODE_ENV || 'dev' }`);

const config = {
	...configfile.default
};

export default {
	...config,
};
