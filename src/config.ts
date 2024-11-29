import dotenv from 'dotenv';
import nconf, { use } from 'nconf';
import path from 'path';
import { fileURLToPath } from 'url';
import { LogLevel } from '@credo-ts/core'

// const dirName = path.dirname(fileURLToPath(import.meta.url));
const dirName = __dirname;
const configFileName = 'config.json';
const env = process.env.NODE_ENV ?? 'development';

if (env === 'development') {
  dotenv.config();
}

/**
 * These settings contain sensitive information and should not be
 * stored in the repo. They are extracted from environment variables
 * and added to the config.
 */

console.log("***************", process.env.AGENT_PORT);
const agentPort = Number(process.env.AGENT_PORT ?? 3110) ;

// overrides are always as defined
nconf.overrides({
  db: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    adminUser: process.env.POSTGRES_ADMIN_USER,
    adminPassword: process.env.POSTGRES_ADMIN_PASSWORD,
  },
  agent: {
    port: agentPort,
    endpoints: process.env.AGENT_ENDPOINTS ? process.env.AGENT_ENDPOINTS.split(',') : null,
    name: process.env.AGENT_NAME,
    invitationUrl: process.env.INVITATION_URL,
    logLevel: process.env.LOG_LEVEL ?? LogLevel.debug,
    usePushNotifications: process.env.USE_PUSH_NOTIFICATIONS === 'true',
    notificationWebhookUrl: process.env.NOTIFICATION_WEBHOOK_URL,
  },
  wallet: {
    name: process.env.WALLET_NAME,
    key: process.env.WALLET_KEY,
  }
});

// load other properties from file.
nconf
  .argv()
  .env()
  .file({ file: path.join(dirName, '../', configFileName) });

// if nothing else is set, use defaults. This will be set if
// they do not exist in overrides or the config file.
nconf.defaults({
  agent: {
    port: agentPort,
    endpoints: process.env.AGENT_ENDPOINTS ?? [
      `http://localhost:${agentPort}`,
      `ws://localhost:${agentPort}`,
    ],
    name: 'My Mediator',
    logLevel: LogLevel.debug,
  },
  wallet: {
    name: 'mediator-dev',
    key: 'blarbzzz',
  }
});

if (env === 'development') {
  console.log('Agent Configuration:', nconf.get("agent"));
  console.log('Database Configuration:', nconf.get("db"));
  console.log('Wallet Configuration:', nconf.get("wallet"));
  console.log(nconf.get("agent:name"));
}

export default nconf;