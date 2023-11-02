import { sendNotification } from "./../notifications/sendNotification";
import * as firebase from "firebase-admin";
import * as func from "firebase-functions";
const axios = require("axios").default;
import Stripe from "stripe";
import * as email from "@sendgrid/mail";
import * as client from "@sendgrid/client";
import { WebClient, LogLevel } from "@slack/web-api";
process.env.TZ = "America/Denver";
let firebaseInstance: any = null;
export const environment: any = func.config()?.environment;
export const DEBUG = false;
//environment.type !== "production" && environment.type !== "development";

if (environment.type !== "development") {
  console.log = func.logger.log;
  console.error = func.logger.error;
  console.debug = func.logger.debug;
}
// else if (environment.type === "development")
//   process.env.FUNCTIONS_EMULATOR_TIMEOUT_SECONDS = "540s";

export const throwError = (error: any): false => {
  if (error && error !== undefined && error !== null) {
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: NEW ERROR:\`\`\`${JSON.stringify(
          error?.message || error,
        )}\`\`\``,
      },
    });
    sendNotification({
      type: "email",
      payload: {
        to: "alex.rodriguez@movetcare.com",
        subject: error?.message
          ? "NEW ERROR => " + JSON.stringify(error?.message)
          : "NEW ERROR",
        message: JSON.stringify(error),
      },
    });
  } else console.error("UNKNOWN ERROR", error);
  console.error("FULL ERROR", JSON.stringify(error));
  if (error?.response) {
    console.error("ERROR HEADERS", JSON.stringify(error.response?.headers));
    console.error("ERROR STATUS", JSON.stringify(error.response?.data));
    console.error("ERROR BODY", JSON.stringify(error.response?.body));
  } else if (error?.request)
    console.error("ERROR REQUEST", JSON.stringify(error?.request));
  else console.error("ERROR MESSAGE", error?.message);
  return false;
};

export const defaultRuntimeOptions = {
  timeoutSeconds: 300,
  memory: "512MB",
  //minInstances: environment.type === "production" ? 1 : 0,
  //maxInstances: 100,
};

firebaseInstance = firebase.initializeApp(
  environment.type !== "production"
    ? {
        credential: firebase.credential.cert({
          projectId: func.config()?.environment.project_id,
          clientEmail: func.config()?.environment.client_email,
          privateKey: func
            .config()
            ?.environment.private_key.replace(/\\n/g, "\n"),
        }),
      }
    : {},
);

if (environment.type === "development") {
  firebaseInstance.firestore().settings({
    host: "localhost:8080",
    ssl: false,
    ignoreUndefinedProperties: true,
    experimentalForceLongPolling: true,
  });
  func.app.setEmulatedAdminApp(firebaseInstance);
} else
  firebaseInstance.firestore().settings({ ignoreUndefinedProperties: true });

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
export const admin: any = firebaseInstance;
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
// const sms = require("twilio")(
//   func.config()?.twilio.account_sid,
//   func.config()?.twilio.auth_token
// );
// export const smsClient = sms;
export const slackBotToken = func.config()?.slack.o_auth_bot_token;
export const slackClient = new WebClient(slackBotToken, {
  logLevel: DEBUG ? LogLevel.DEBUG : undefined,
});
