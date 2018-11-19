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
const dbuser = process.env.dbuser || 'waveblur' ;
const dbpass = process.env.dbpass || 'waveza555';
const mongoUrl = `mongodb://${dbuser}:${dbpass}@${ process.env.MONGO || 'ds247688.mlab.com:47688/heroku_ngg8khv8'}`;
const dbName = process.env.dbName || 'heroku_ngg8khv8';

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
