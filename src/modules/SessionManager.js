import { find, update, create } from '../utils/mongodb';
import { ObjectId } from 'mongodb';
import config from '../config';
import * as line from '@line/bot-sdk';

class Session {
  async currentStateWorkflow(app, userId) {
    const filter = {
      userId,
    };
    try {
      const result = await find(app,config.dbName, 'Sessions', filter);
      return result[0];
    } catch (error) {
      throw error.stack;
    }
  }

  async getWorkflow(app ,workflowId) {
    const filter = {
      _id : ObjectId(workflowId)
    }
    try {
      const workflow = await find(app, config.dbName, 'Workflows',filter );
      if(workflow[0] === undefined) {
        return;
      }
      return workflow[0];
    } catch (error) {
      throw error.stack
    }
    
  }

  async getWorkflowIdByKeyword(app ,keyword) {
    const search = new RegExp(`${keyword}`);
    const filter = {
      "start_keywords": search
    }
    try {
      const workflow = await find(app, config.dbName, 'Workflows',filter );
      if(workflow[0] === undefined) {
        return;
      }
      return workflow[0]._id;

    } catch (error) {
      throw error.stack
    }

  }

  async startWorkflow(app , userId, workflowId) {
    const filter = {
      userId
    };

    const workflow = {
      userId,
      workflowId,
      currentState: 'start',
      status: 'pending',
    }
    try {
      await update(app,config.dbName,'Sessions', filter, { upsert : true }, workflow);
    } catch (error) {
      throw error.stack;
    }
  }

  async nextStateWorkflow(app, userId) {
    const Session = await this.currentStateWorkflow(app, userId);
    let workflow;
    if (Session) {
      workflow = await this.getWorkflow(app, Session.workflowId)
    } else {
      return;
    }
    
    const raw_currentState = Session.currentState;
    const currentState = workflow.states.filter(state => (state.state_name === raw_currentState));
    let updateSessionData = {};
    
    if(currentState.next_state) {
      updateSessionData = {
        $set: {
          currentState : currentState[0].next_state,
          status: 'pending',
        } 
      }
    } else {
      updateSessionData = {
        $set: {
          currentState : 'end',
          status: 'finish',
        } 
      }
    }
    try {
      await update(app, config.dbName, 'Sessions', { userId },{},updateSessionData);
    } catch (error) {
      throw (error.stack);
    }
    
  }

  async sendState(app, userId) {
    const Session = await this.currentStateWorkflow(app, userId);
    const currentState = Session.currentState;
    const workflow = await this.getWorkflow(app, Session.workflowId);
    const configLine = {
      channelAccessToken: config.channelAccessToken,
      channelSecret: config.channelSecret,
    };

    const contents = workflow.states.filter(state => currentState === state.state_name);
    const client = new line.Client(configLine);

    
    
    try {
      contents.forEach(async (content) => {
        const logData = {
          userId,
          replyMessage: content.reply_content,
        };
        await client.pushMessage(userId, content.reply_content);
        await create(app, config.dbName, 'Logs', logData);
        console.log('reply content to : ',userId);
        console.log('content :', content.reply_content);
      });
    } catch (error) {
      throw error.stack;
    }
    
  }


}

export default new Session();