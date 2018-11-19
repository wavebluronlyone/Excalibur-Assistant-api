const port = process.env.PORT || 3003;


//Production 
const channelAccessToken = 'DvWUMt4/HO35bxaw7gB8iakGcQ9XpCLPCNFFx4QG32WXCrUTaWuWNyfiBi3OgveStgdgP1rU0t0porXG8rbtrA+GGSet2+f24uxFfSZfVI0tA4CDJJL39eWoB0VclGV2yXN1n2BEEOGZ3fnysEOVuAdB04t89/1O/w1cDnyilFU=';
const channelSecret = '07e6be49c56c7f5b0dc477d5295d611d';


//--- Development --- //
// const channelAccessToken = 'JaO5vXIRtENhyJDaeRq3klFB8wlRaAqpx3Ykgr7THZku8Eylt3lWQXVOtbxYp0xuPg5sxrrXlhKbolEm+Kswsh9Kcn2Y5BtLrNz3S46spcZXkgQ5J39CwmKnJ5h8B6E+eGo+B6r1a+Us0ckkf5P5VgdB04t89/1O/w1cDnyilFU=';
// const channelSecret = '51c00251de813ee59ce74d5602b02419';


const lineUrl = 'https://api.line.me/v2/bot/message/reply';
const facebookGraphUrl = 'https://graph.facebook.com/v3.2';
const pageToken = 'EAAEoh1A3uxMBAMWZBUZAXSM7xHoeNouaVaAqmQEAzJxEndZCaaOK3z1uVq9UzFwjgvNsZAZA3apKy9UNoRPDvHzZBBcPaPdhGT7KV9WS7HRB6gYZBOCWA0iryrtyOfVlTorMT2Yw1WsdJYxxd1FE7rmHI9pzpJEDWXUYpmPdjLjxntbEZAYcQd2g';
const appToken = '326036608236307|URloOjuDuSZo0uIrAZmDlKm8IAk';
const pageid = '2167996479889568';
const secret = 'whoisyourdady';

// -- Mongo -- //
const dbuser = 'waveblur';
const dbpass = 'waveza555';
const mongoUrl = `mongodb://${dbuser}:${dbpass}@ds247688.mlab.com:47688/heroku_ngg8khv8`;
const dbName = 'heroku_ngg8khv8';

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
	appToken,
	pageid,
};
