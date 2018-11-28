const line = require('@line/bot-sdk');
const { update } = require('../utils/mongodb');
const config = require('../config');
const axios = require('axios');

const saveUserData = async (userId, app, media = 'line') => {
	const { dbName } = config;
	const configLine = {
		channelAccessToken: config.channelAccessToken,
		channelSecret: config.channelSecret,
	};
	try {
		if (media === 'line') {
			const client = new line.Client(configLine);
			const profile = await client.getProfile(userId);
			await update(app, dbName, 'Users', { userId }, { upsert: true }, profile);

			return profile;
		} if (media === 'facebook') {
			console.log('Update FACEBOOK profile by id ', userId);
			const profile = await axios.get(`${config.facebookGraphUrl}/${userId}?access_token=${config.pageToken}`+
      '&fields=name,gender,profile_pic,first_name,last_name,id');
			const updateProfile = {
				facebook: {
					...profile.data,
				}
			};
			await update(app, dbName, 'Users_Facebook', { 'facebook.id': userId }, { upsert: true }, updateProfile);

			return profile;
		}
	} catch (error) {
		throw error;
	}
};

module.exports = saveUserData;
 