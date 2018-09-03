import * as line from '@line/bot-sdk';
import config from '../config';
import { create, find } from '../utils/mongodb';
import { saveUserData } from '../modules/Users';
import fastifyJwt from 'fastify-jwt';
import SessionManager from '../modules/SessionManager';

module.exports = async (app, option, next) => {
  function verifyToken(req, reply) {
    const bearer = req.headers[`authorization`];
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

  app.post('/api/messenger/receive/', async (req,reply) =>{
    const { data } =  req.body;
    const userId = data.source.userId;
    const incomingMessage = data.message;
    let receiveMessage = incomingMessage;
    console.log(`Receive Message from UserID: ${userId}`);
    console.log(`Content: ${JSON.stringify(incomingMessage)}`);
    const logData = {
        userId,
        receiveMessage,
    };
    try {
      // fucntion to keep user input
      await create(app, dbName, 'Logs', logData);
      await saveUserData(client, userId, app);
      const currentStateWorkflow = await SessionManager.currentStateWorkflow(app, userId);
      if( currentStateWorkflow !== undefined && currentStateWorkflow.status !== 'finish' ) {
        await SessionManager.nextStateWorkflow(app, userId);
        await SessionManager.sendState(app, userId);
      } else {
        const keyword = incomingMessage.text;
        const workflow = await SessionManager.getWorkflowByKeyword(app, keyword);
        const worlflowid = workflow._id;
        if(worlflowid !== undefined){
          await SessionManager.startWorkflow(app, userId, worlflowid);
          await SessionManager.sendState(app, userId);
        }
      }
    } catch (error) {
      console.log(error);
    }

    reply.status(200).send({ repsoneMessage : 'receive message' });
  });

  app.post('/api/messenger/sendmsg/',async (req,reply) => {
    verifyToken(req, reply);
    const replyContent = req.body.replycontent;
    const userId = req.query.userid;
    if(typeof userId === 'undefined' || userId === '') {
      return reply.status(400).send('require userid');
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
      await client.pushMessage(userId,replyContent);
      reply.status(200).send({ repsoneMessage : 'sended message' });
    } catch(error) {
      reply.status(401).send({ error : error.stack });
      throw error.stack;
    }
    });
    
    app.get('/api/messenger/logs/',async (req,reply) => {
      verifyToken(req, reply);
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

    app.get('/gtoken',async (req,reply) => {
      reply.jwtSign({'SurpiceMother': 'fucker'},(err, token) => {
        if(err) console.log(err.stack)
        return reply.send( err|| {token} );
      })
    });
}