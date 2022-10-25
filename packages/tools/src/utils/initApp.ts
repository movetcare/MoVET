const config = require('./firebase.json');
const dotenv = require('dotenv');
dotenv.config({path: '../../.env'});
console.log(
  "process.env?.STAGING_FIREBASE_PROJECT_ID",
  process.env?.STAGING_FIREBASE_PROJECT_ID
);
const initializeApp = (
  mode: string,
  environment: string = process.env.APP_ENVIRONMENT || 'development'
) => {
  if (environment === 'development' || environment === 'test') {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = `localhost:${config.emulators.auth.port}`;
    process.env.FIRESTORE_EMULATOR_HOST = `localhost:${config.emulators.firestore.port}`;
    process.env.FIREBASE_FUNCTIONS_EMULATOR_HOST = `localhost:${config.emulators.functions.port}`;
  }
  if (mode === 'admin') {
    const firebase = require('firebase-admin');
    if (environment === 'production') {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          credential: firebase.credential.cert({
            projectId: process.env?.PRODUCTION_FIREBASE_PROJECT_ID,
            clientEmail: process.env?.PRODUCTION_FIREBASE_EMAIL,
            privateKey: process.env?.PRODUCTION_FIREBASE_PRIVATE_KEY?.replace(
              /\\n/g,
              '\n'
            ),
          }),
        });
      }
    } else {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          credential: firebase.credential.cert({
            projectId: process.env?.STAGING_FIREBASE_PROJECT_ID,
            clientEmail: process.env?.STAGING_FIREBASE_EMAIL,
            privateKey: process.env?.STAGING_FIREBASE_PRIVATE_KEY?.replace(
              /\\n/g,
              '\n'
            ),
          }),
        });
      }
    }
    firebase.firestore().settings(
      environment === 'development' || environment === 'test'
        ? {
            host: `localhost:${config.emulators.firestore.port}`,
            ssl: false,
            ignoreUndefinedProperties: true,
            experimentalForceLongPolling: true,
          }
        : {ignoreUndefinedProperties: true}
    );
    return firebase;
  } else {
    const firebase = require('firebase');
    require('firebase/functions');
    if (environment === 'production') {
      firebase.initializeApp({
        apiKey: process.env?.PRODUCTION_FIREBASE_API_KEY,
        authDomain: process.env?.PRODUCTION_FIREBASE_AUTH_ID,
        projectId: process.env?.PRODUCTION_FIREBASE_PROJECT_ID,
        databaseURL: process.env?.PRODUCTION_FIREBASE_DATABASE_URL,
      });
    } else {
      firebase.initializeApp({
        apiKey: process.env?.STAGING_FIREBASE_API_KEY,
        authDomain: process.env?.STAGING_FIREBASE_AUTH_ID,
        projectId: process.env?.STAGING_FIREBASE_PROJECT_ID,
        databaseURL: process.env?.STAGING_FIREBASE_DATABASE_URL,
      });
    }
    firebase.functions();
    return firebase;
  }
};

exports.initializeApp = initializeApp;
