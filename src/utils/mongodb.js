export const find = async (app, dbname, collectionName, filter = {}, sort = {}) => {
    const col = app.mongo.client.db(dbname).collection(collectionName);
    const data = await col.find(filter).sort(sort).toArray();
    return data;
};

export const create = async (app, dbname, collectionName, data) => {
    const col = app.mongo.client.db(dbname).collection(collectionName);
    const now = new Date();
    const rawData = data;
    const insertData = {
      ...rawData,
      create_at: now,
    };
    try {
      const result = await col.insertOne(insertData);
      return result;
    } catch(error) {
      throw error
    }
};

export const update = async (app, dbname, collectionName, filter = {}, option = {}, data = {}) => {
    const col = app.mongo.client.db(dbname).collection(collectionName);
    const now = new Date();
    const rawData = data;
    const updateData = {
      ...rawData,
    };
    try {
      const result = await col.update(filter, updateData, option);
      return result;
    } catch (error) {
      throw error;   
    }
    
}

