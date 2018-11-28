const port = process.env.PORT || 3003;

function errorNoEnv(key) {
	console.log('Error no config variable key: ', key);
	process.exit(0);
}

//Line 
const channelAccessToken = process.env.channelAccessToken ? process.env.channelAccessToken : errorNoEnv('channelAccessToken (line)');
const channelSecret = process.env.channelSecret ? process.env.channelSecret : errorNoEnv('channelSecret (line)');
const lineUrl = 'https://api.line.me/v2/bot/message/reply';

// facebook
const facebookGraphUrl = 'https://graph.facebook.com/v3.2';
const pageToken = process.env.pageToken ? process.env.pageToken : errorNoEnv('pageToken');
const pageid = process.env.pageid ? process.env.pageid : errorNoEnv('pageid');
const secret = 'whoisyourdady';

// -- Mongo -- //
const mongoUrl = process.env.MONGO || 'mongodb://waveblur:waveza555@ds247688.mlab.com:47688/heroku_ngg8khv8';
const dbName = process.env.dbName || 'heroku_ngg8khv8';

module.exports = {
	port,
	channelAccessToken,
	channelSecret,
	mongoUrl,
	lineUrl,
	dbName,
	secret,
	facebookGraphUrl,
	pageToken,
	pageid,
};
