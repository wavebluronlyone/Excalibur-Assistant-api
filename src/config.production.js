const port = process.env.PORT || 3003;

function errorNoEnv(key) {
	console.log('Error no config variable key: ',key);
	process.exit(0);
}

//Line 
const channelAccessToken = process.env.channelAccessToken ? process.env.channelAccessToken: errorNoEnv('channelAccessToken (line)'); 
const channelSecret = process.env.channelSecret ? process.env.channelSecret : errorNoEnv('channelSecret (line)'); 
const lineUrl =  'https://api.line.me/v2/bot/message/reply';

// facebook
const facebookGraphUrl = 'https://graph.facebook.com/v3.2';
const pageToken = process.env.pageToken ? process.env.pageToken : errorNoEnv('pageToken');
const pageid = '2167996479889568';
const secret = 'whoisyourdady';

// -- Mongo -- //
const dbuser = 'waveblur';
const dbpass = 'waveza555';
const mongoUrl = `mongodb://${dbuser}:${dbpass}@ds123532.mlab.com:23532/heroku_c5rxsb5d`;
const dbName = 'heroku_c5rxsb5d';

export default {
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
