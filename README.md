# Excalibur Assistant (EAss)
Like other chat bot base on start keyword trigering. Support only Facebook and Line (Slack and Discord are <b>coming soon</b>)
## Feature
- Light and clean with <b>fastify</b>
- Fastest respone with ask and answer
- Easy to understanding workflow
- Reponse Messenge Understanding System ( work with wit.ai and integrate DialogFlow) <b>in V.2 Alpha </b>
## System Requirement
- nodemon (<code>yarn global add nodemon</code> or <code>npm install nodemon -g</code>)
- Webhook
- Work on MongoDB
- Facebook or Line Developer App
- MQ for more handle event (<b>optional</b>)
## Deployment
### Development
Run <code>(npm or yarn) start</code>

### Production (Docker)
Run <code>docker-compose --file docker/api.production.yml up --d<code>
