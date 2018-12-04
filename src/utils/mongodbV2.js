const di = require('./di');

class Mongodb {
	constructor(dbName) {
		this.conn = di.get('mongodb');
		this.dbName = dbName;
	}

	find(collection, filter = {}) {
		return new Promise(async(reslove, reject) => {
			try {
				const result = await this.conn.db(this.db).collection(collection).find(filter);
				reslove(result);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Mongodb;
