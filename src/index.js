const cors = require('cors');
const config = require('./config');
const { MongoClient } = require('mongodb');
const fastify = require('fastify');
const fastifyMongo = require('fastify-mongodb');
const Line = require('./routes/Line');
const Facebook = require('./routes/Facebook');

const port = config.port;
const mongoUrl = config.mongoUrl;

MongoClient.connect(`${mongoUrl}`,
	{ useNewUrlParser: true })
	.then(client => {
		const app = new fastify();
		app.use(cors());
		app
			.register(Line, { prefix: '/line' })
			.register(Facebook, { prefix: '/facebook' })
			.register(fastifyMongo, { client });

		app.get('/api/healthcheck', (req, reply) => {
			reply.status(200).send({ status: 'ok' });
		});

		app.get('/', (req, reply) => {
			reply.send('Excalibur Bot api');
		});

		app.listen(port, '0.0.0.0', err => {
			if (err) throw err;
			console.log(`Excalibur Bot api Running on ${port}`);
		});
		app.ready(() => {
			console.log(app.printRoutes());
		});
	})
	.catch(err => {
		console.log(err.stack);
	});
