import * as line from '@line/bot-sdk';
import config from '../config';
import { create, find } from '../utils/mongodb';
import { getProfile } from '../modules/Profile';
import fastifyJwt from 'fastify-jwt';

module.exports = async (app, option, next) => {
  function verifyToken(req) {
    const bearer = req.headers[`authorization`];
    const token = bearer.split(' ')[1];
    app.jwt.verify(token);
  }
  const dbName = config.dbName;
  const configLine = {
    channelAccessToken: config.channelAccessToken,
    channelSecret: config.channelSecret,
  };
  const client = new line.Client(configLine);
  
  
  app.register(fastifyJwt, { secret: `${config.secret}` });

  app.post('/api/messenger/receive/', async (req,reply) =>{
    const { data } =  req.body;
    const replyToken = data.replyToken;
    const userId = data.source.userId;
    const incomingMessage = data.message;
    let receiveMessage = incomingMessage;
    let replyMessage = {};
    console.log(`Receive Message from UserID: ${userId}`);
    switch (incomingMessage.type) {
      case 'text' : {
        console.log('type : text');
        console.log(`"${incomingMessage.text}"`);
        replyMessage = {
            type: 'text',
            text: `${incomingMessage.text}`,
        }
        break;
      }
      case 'sticker' : {
        console.log('type : sticker');
        console.log(`Stciker ID: ${incomingMessage.stickerId}`);
        console.log(`Package ID: ${incomingMessage.packageId}`);
        replyMessage = {
            type: 'sticker',
            stickerId: `${incomingMessage.stickerId}`,
            packageId:`${incomingMessage.packageId}`,  
        }
        break;
          
      }
      default: {
        console.log('unknown type');
        receiveMessage = null;
        break;
      }
    };
    const logData = {
        userId,
        receiveMessage,
        replyMessage,
    };

    const event =  req.body;
    const url = config.apiUrl;
    try {
      await create(app, dbName, 'Logs', logData);
      await getProfile(client, userId, app);
    } catch (error) {
      console.log(error.stack);
    }

    reply.status(200).send({ repsoneMessage : 'receive message' });
  });

  app.post('/api/messenger/sendmsg/',async (req,reply) => {
    verifyToken(req);
    
    const replyContent = req.body.replycontent;
    const userId = req.query.userid;
    console.log('to : ',userId);
    console.log(replyContent);

    const logData = {
      userId,
      replyMessage: replyContent,
    };

    try {
      await create(app, dbName, 'Logs', logData);
      await getProfile(client, userId, app);
      await client.pushMessage(userId,replyContent);
      reply.status(200).send({ repsoneMessage : 'sended message' });
    } catch(error) {
      reply.status(401).send({ error : error.stack });
      throw error.stack;
    }
    });
    
    app.get('/api/messenger/logs/',async (req,reply) => {
      
      verifyToken(req);
      const lineid = req.query.userid;
      let filter = {};

      if(lineid !== undefined) {
        filter = {
          userId : lineid,
        }
        console.log('find logs by lineid', lineid);
      } else {
        console.log('find all logs');
      }
      
      const logs = await find(app, dbName, 'Logs',filter,{ _id : -1 });
      reply.send(logs);
    });
}