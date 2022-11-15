import { sendNotification } from "./../notifications/sendNotification";
import * as firebase from "firebase-admin";
import * as func from "firebase-functions";
const axios = require("axios").default;
import Stripe from "stripe";
import * as email from "@sendgrid/mail";
import * as client from "@sendgrid/client";
import { WebClient, LogLevel } from "@slack/web-api";
const Sentry = require("@sentry/node");

let stagingInstance: any = null;
let productionInstance: any = null;
export const environment: any = func.config()?.environment;
export const DEBUG = false;

if (environment.type !== "development") {
  console.log = func.logger.log;
  console.error = func.logger.error;
  console.debug = func.logger.debug;
} else process.env.FUNCTIONS_EMULATOR_TIMEOUT_SECONDS = "1500s";

export const throwError = (error: any): false => {
  if (error && error !== undefined && error !== null)
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: PLATFORM ERROR:\`\`\`${JSON.stringify(
          error || error?.message
        )}\`\`\``,
      },
    });
  else console.error("UNKNOWN ERROR", error);
  console.error("FULL ERROR", error);
  if (error.response) {
    console.error("ERROR HEADERS", error.response.headers);
    console.error("ERROR STATUS", error.response.status);
    console.error("ERROR DATA", error.response.data);
    console.error("ERROR BODY", error.response.body);
  } else if (error.request) console.error("ERROR REQUEST", error.request);
  else console.error("ERROR MESSAGE", error.message);
  return false;
};

if (environment.type !== "development") {
  Sentry.init({
    dsn: func.config()?.sentry.dsn,
    environment: environment.type,
    tracesSampleRate: 1.0,
  });
}

export const defaultRuntimeOptions = {
  timeoutSeconds: 180,
  memory: "256MB",
};

productionInstance = firebase.initializeApp();

if (environment.type === "development") {
  productionInstance.firestore().settings({
    host: "localhost:8080",
    ssl: false,
    ignoreUndefinedProperties: true,
  });
  func.app.setEmulatedAdminApp(productionInstance);
} else if (environment.type === "staging") {
  stagingInstance = firebase.initializeApp(
    {
      credential: firebase.credential.cert({
        projectId: func.config()?.environment.project_id,
        clientEmail: func.config()?.environment.client_email,
        privateKey: func
          .config()
          ?.environment.private_key.replace(/\\n/g, "\n"),
      }),
      databaseURL: `https://${
        func.config()?.environment.project_id
      }.firebaseio.com`,
      storageBucket: "movet-care-staging.appspot.com",
    },
    "staging"
  );
  stagingInstance.firestore().settings({ ignoreUndefinedProperties: true });
} else if (environment.type === "production") {
  productionInstance.firestore().settings({ ignoreUndefinedProperties: true });
}

axios.defaults.baseURL = func.config()?.provet_cloud?.api_base;
(axios.defaults.headers as any).common["Authorization"] = func.config()
  ?.provet_cloud?.auth_token as any;
(axios.defaults.headers as any).common["User-Agent"] = "MoVET/2.0";
(axios.defaults.headers as any).post["Content-Type"] = "application/json";

export const projectApiKey: string = func.config()?.project?.api_key;
export const mobileClientApiKey: string = func.config()?.events?.api_key;
export const expoWebhookSecret: string = func.config()?.expo?.webhook_secret;
export const expoAccessToken: string = func.config()?.expo.access_token;
export const proVetAppUrl: string = func.config()?.provet_cloud?.app_url;
export const proVetApiUrl: string = func.config()?.provet_cloud?.api_base;
export const recaptchaSecretKey: string = func.config()?.recaptcha?.secret_key;
export const request: any = axios;
export const admin: any =
  environment.type !== "staging" ? productionInstance : stagingInstance;
export const functions: any = func;
export const stripeApiVersion: any = func.config()?.stripe?.api_version;
export const stripeWebhookSecret = func.config()?.stripe?.webhook_secret;
export const stripe = new Stripe(func.config()?.stripe?.secret_key, {
  apiVersion: stripeApiVersion,
});
email.setApiKey(func.config()?.sendgrid.api_key);
client.setApiKey(func.config()?.sendgrid.api_key);
export const emailClient = email;
export const sendGridAPI = client;
const sms = require("twilio")(
  func.config()?.twilio.account_sid,
  func.config()?.twilio.auth_token
);
export const smsClient = sms;
export const slackBotToken = func.config()?.slack.o_auth_bot_token;
export const slackClient = new WebClient(slackBotToken, {
  logLevel: DEBUG ? LogLevel.DEBUG : undefined,
});
