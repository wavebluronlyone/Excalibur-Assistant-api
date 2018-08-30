import { update } from '../utils/mongodb';
import config from '../config';

const dbName = config.dbName;

export const getProfile = async (client, userId, app) => {
    try {
      const profile = await client.getProfile(userId);
      await update(app, dbName, 'Users', { userId }, { upsert: true }, profile);
      return profile;
    } catch (error) {
      throw error;
    }

}