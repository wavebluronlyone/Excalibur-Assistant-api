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
      update_at: now,
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
       $set : {
         ...rawData 
      },
    };
    const updatedate = {
      $set: {
        update_at : now,
      }
    }
    try {
      const result = await col.updateOne(filter, updateData, option);
      await col.updateOne(filter, updatedate, option) 
      return result;
    } catch (error) {
      throw error;   
    }
    
}

