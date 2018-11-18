import * as line from '@line/bot-sdk';
import config from '../config';
import { create, find } from '../utils/mongodb';
import { saveUserData } from '../modules/Users';
import fastifyJwt from 'fastify-jwt';
import SessionManager from '../modules/SessionManager';

export default async (app, option, next) => {
	function verifyToken(req, reply) {
		const bearer = req.headers['authorization'];
		if(typeof bearer !== 'undefined') {
			const token = bearer.split(' ')[1];
			app.jwt.verify(token, (err, decode) => {
				err ? reply.status(401).send('token invalid !') : '';
			});
		} else {
			return reply.status(401).send('token invalid !');
		}
	}
	const dbName = config.dbName;
	const configLine = {
		channelAccessToken: config.channelAccessToken,
		channelSecret: config.channelSecret,
	};
	const client = new line.Client(configLine);
  
	app.register(fastifyJwt, { secret: `${config.secret}`});

	app.post('/api/messenger/receive/', async (req,reply) => {
		const data =  req.body.data;
		// console.log(JSON.stringify(data));
		// {
		//   "object": "page",
		//   "entry": [
		//     {
		//       "id": "2167996479889568",
		//       "time": 1542471641739,
		//       "messaging": [
		//         {
		//           "sender": {
		//             "id": "2156043167741968"
		//           },
		//           "recipient": {
		//             "id": "2167996479889568"
		//           },
		//           "timestamp": 1542471641287,
		//           "message": {
		//             "mid": "EkwV67X9ifWJMIsIKgKieRXWdyIJgzhQ7nJI-zG3ABWivBV9KdFpfGFNMh-t9b02td84NkaIwQnLWft10fl3FQ",
		//             "seq": 621701,
		//             "text": "test"
		//           }
		//         }
		//       ]
		//     }
		//   ]
		// }
		console.log('[Facebook]');
		const userId = data.entry[0].messaging[0].sender.id;
		const incomingMessage = data.entry[0].messaging[0].message;
		let receiveMessage = incomingMessage;
		console.log(`Receive Message from UserID: ${userId}`);
		console.log(`Content: ${JSON.stringify(incomingMessage)}`);
		const logData = {
			userId,
			receiveMessage,
		};
		if (typeof incomingMessage === 'undefined') {
			console.log('Receive unknown message');
			reply.status(200).send({ repsoneMessage : 'receive unknown message ' });
			return;
		}
		try {
			// function to keep user input
			await create(app, dbName, 'Logs', logData);
			// await saveUserData(userId, app, 'facebook');
			const currentSession = await SessionManager.currentSession(app, userId);
			if( currentSession !== undefined && currentSession.status !== 'finish' ) {
				await SessionManager.nextStateWorkflow(app, userId);
				await SessionManager.sendState(app, userId, 'facebook');	
			} else {
				const keyword = incomingMessage.text;
				const workflow = await SessionManager.getWorkflowByKeyword(app, keyword);
				if((workflow && workflow._id) !== undefined){
					await SessionManager.startWorkflow(app, userId, workflow._id);
					await SessionManager.sendState(app, userId, 'facebook');
				}
			}
			reply.status(200).send({ repsoneMessage : 'receive message' });
		} catch (error) {
			reply.status(500).send({ error : error.stack });
			console.log(error.stack);
		}
	});

	app.post('/api/messenger/sendmsg/',async (req,reply) => {
		verifyToken(req, reply);
		const replyContent = req.body.replycontent;
		const userId = req.query.userid;
		if(typeof userId === 'undefined' || userId === '') {
			return reply.status(401).send('require userid');
		}
		console.log('to : ',userId);
		console.log(replyContent);
		const logData = {
			userId,
			replyMessage: replyContent,
		};

		try {
			await create(app, dbName, 'Logs', logData);
			await saveUserData(client, userId, app);
			await client.pushMessage(userId, replyContent);
			reply.status(200).send({ repsoneMessage : `1 Content Sended to ID: ${userId}` });
		} catch(error) {
			reply.status(500).send({ error : error.stack });
			console.log(error.stack);
		}
	});
    
	app.get('/api/messenger/logs/',async (req,reply) => {
		verifyToken(req, reply);
		const lineid = req.query.userid;
		let filter = {};

		if(lineid !== undefined) {
			filter = {
				userId : lineid,
			};
			console.log('find logs by lineid', lineid);
		} else {
			console.log('find all logs');
		}

		try {
			const logs = await find(app, dbName, 'Logs',filter,{ _id : -1 });
			reply.send(logs);
		} catch (error) {
			reply.status(500).send({ error : error.stack });
			console.log(error.stack);
		}
      
	});

	app.get('/gtoken',async (req,reply) => {
		reply.jwtSign({'SurpiceMother': 'fucker'},(err, token) => {
			if(err) console.log(err.stack);
			return reply.send( err|| {token} );
		});
	});
	next();
};
