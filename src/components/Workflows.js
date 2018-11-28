/* eslint-disable no-mixed-spaces-and-tabs */
const { ObjectId } = require('mongodb');
const line = require('@line/bot-sdk');
const axios = require('axios');
const { find, update, create } = require('../utils/mongodb');
const config = require('../config');

class SessionAndMessageEngine {
	async currentSession(app, userId) {
		const filter = {
			userId,
		};
		try {
			const result = await find(app, config.dbName, 'Sessions', filter);
			return result[0];
		} catch (error) {
			throw error.stack;
		}
	}

	async getWorkflowById(app, workflowId) {
		const filter = {
			_id: ObjectId(workflowId),
		};
		try {
			const workflow = await find(app, config.dbName, 'Workflows', filter);
			if (workflow[0] === undefined) {
				return;
			}
			return workflow[0];
		} catch (error) {
			throw error.stack;
		}
	}

	async getWorkflowByKeyword(app, keyword) {
		const filter = {
			start_keywords: keyword,
		};
		try {
			const workflow = await find(app, config.dbName, 'Workflows', filter);
			if (workflow[0] === undefined) {
				return;
			}
			return workflow[0];
		} catch (error) {
			throw error.stack;
		}
	}

	async startWorkflow(app, userId, workflowId) {
		const filter = {
			userId,
		};

		let sessionData = {};
		const workflow = await this.getWorkflowById(app, workflowId);
		workflow.states.length <= 1
			? (sessionData = {
				userId,
				workflowId,
				currentState: 'end',
				status: 'finish',
			  })
			: (sessionData = {
				userId,
				workflowId,
				currentState: 'start',
				status: 'pending',
			  });

		try {
			await update(
				app,
				config.dbName,
				'Sessions',
				filter,
				{ upsert: true },
				sessionData,
			);
		} catch (error) {
			throw error.stack;
		}
	}

	async nextStateWorkflow(app, userId) {
		const Session = await this.currentSession(app, userId);
		let workflow;
		if (Session) {
			workflow = await this.getWorkflowById(app, Session.workflowId);
		} else {
			return;
		}

		const raw_currentState = Session.currentState;
		const currentState = workflow.states.filter(
			state => state.state_name === raw_currentState,
		);
		const nextStateName = currentState[0].next_state;
		const nextState = workflow.states.filter(
			state => state.state_name === nextStateName,
		);
		let updateSessionData = {};

		if (nextState[0].state_type !== 'end') {
			updateSessionData = {
				currentState: currentState[0].next_state,
				status: 'pending',
			};
		} else {
			updateSessionData = {
				currentState: 'end',
				status: 'finish',
			};
		}
		try {
			await update(
				app,
				config.dbName,
				'Sessions',
				{ userId },
				{},
				updateSessionData,
			);
		} catch (error) {
			throw error.stack;
		}
	}

	async sendState(app, userId, media = 'line') {
		const Session = await this.currentSession(app, userId);
		const currentState = Session.currentState;
		const workflow = await this.getWorkflowById(app, Session.workflowId);
		const configLine = {
			channelAccessToken: config.channelAccessToken,
			channelSecret: config.channelSecret,
		};
		const contents = workflow.states.filter(
			state => currentState === state.state_name,
		);
		try {
			contents.forEach(async content => {
				const logData = {
					userId,
					replyMessage: content.reply_content,
				};
				if (media === 'line') {
					const client = new line.Client(configLine);
					await client.pushMessage(userId, content.reply_content);
					await create(app, config.dbName, 'Logs', logData);
				} else if (media === 'facebook') {
					content.reply_content.forEach(async message => {
						let facebookContent = {};
						if (message.type === 'text') {
							facebookContent = {
								messaging_type: 'RESPONSE',
								recipient: {
									id: userId,
								},
								message: {
									text: message.text,
								},
							};
						} else if (message.type === 'image') {
							facebookContent = {
								messaging_type: 'RESPONSE',
								recipient: {
									id: userId,
								},
								message: {
									attachment: {
										type: 'image',
										payload: {
											url: message.originalContentUrl,
										},
									},
								},
							};
						} else {
							facebookContent = {
								messaging_type: 'RESPONSE',
								recipient: {
									id: userId,
								},
								sender_action: 'mark_seen',
							};
						}
						const url = `${config.facebookGraphUrl}/${
							config.pageid
						}/messages?access_token=${config.pageToken}`;
						await axios.post(url, facebookContent);
					});
				}
				console.log('Reply to: ', userId);
				console.log('Content:', content.reply_content);
			});
		} catch (error) {
			throw error.stack;
		}
	}
}

module.exports = new SessionAndMessageEngine();
