import {webhookHeartbeat} from './utils/webhookHeartbeat';
const request = require('axios');
const config = require('./utils/firebase.json');
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/../.env'});
const interval = 1 * 60 * 1000;
let runs = 0;

console.log('APP ENV =>', process.env?.APP_ENVIRONMENT);

request.defaults.baseURL = `http://localhost:${
  config.emulators.functions.port
}/${
  process.env?.APP_ENVIRONMENT === 'production'
    ? process.env?.FIREBASE_PROJECT_ID
    : process.env?.STAGING_FIREBASE_PROJECT_ID
}/us-central1/taskRunnerDev`;

const executeCron = () =>
  request()
    .then((response) =>
      console.log(`/taskRunnerDev => ${JSON.stringify(response.data)}`)
    )
    .catch((error) => {
      console.error(
        `FAIL: ${request.defaults.baseURL} => ${error.syscall} ${error.code}: ${error.address}:${error.port}\n\nAre you sure "npm run dev" is running?\n`
      );
      console.error(error);
    });

console.log('Starting Cron\n');
executeCron();
setInterval(() => {
  executeCron();
  webhookHeartbeat();
  if (
    runs === 120 ||
    runs === 125 ||
    runs === 130 ||
    runs === 135 ||
    runs === 140
  ) {
    console.log('\n\n**************************************************\n\n');
    console.log(
      'ATTENTION: YOUR FREE 2 HOUR NGROK TUNNEL TIME LIMIT HAS EXPIRED!\n'
    );
    console.log(
      'YOUR ENVIRONNEMENT WILL NO LONGER RECEIVE PROVET CLOUD OR STRIPE WEBHOOKS'
    );
    console.log('\nSOME FEATURES MAY NO LONGER WORK CORRECTLY...\n');
    console.log('RERUN THE START SCRIPT TO SETUP A NEW NGROK TUNNEL');
    console.log('\n\n**************************************************\n\n');
  }
  runs++;
}, interval);

export {};
