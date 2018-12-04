const cors = require('cors');
const config = require('./config');
const { MongoClient } = require('mongodb');
const fastify = require('fastify');
const Line = require('./routes/Line');
const Facebook = require('./routes/Facebook');
const di = require('./utils/di');

const port = config.port;
const mongoUrl = config.mongoUrl;
const app = new fastify();

app.use(cors());
// app.register(Line, { prefix: '/line' })
// 	.register(Facebook, { prefix: '/facebook' });
app.get('/api/healthcheck', (req, reply) => {
	reply.status(200).send({ status: 'ok' });
});
app.get('/', (req, reply) => {
	reply.send('Excalibur Bot api');
});
app.ready(() => {
	console.log(app.printRoutes());
});


const start = async() => {
	try {
		const client = await MongoClient.connect(`${mongoUrl}`, { useNewUrlParser: true });
		di.set('mongodb', client);
		await app.listen(port, '0.0.0.0');
	} catch (error) {
		console.log(error.stack);
	}
};

start();

module.exports = app;
