const ngrok = require("ngrok");
const app = require("./utils/initApp");
const publicIp = require("public-ip");
const firebaseConfig = require("./utils/firebase.json");

const DEBUG = true;

(async () => {
  const admin = app.initializeApp("admin", "staging");
  const ipv4 = await publicIp.v4();
  const url = await ngrok.connect({
    proto: "http",
    addr: firebaseConfig.emulators.functions.port,
    authtoken: process.env.NGROK_AUTH_TOKEN,
    region: "us",
    onStatusChange: (status) =>
      DEBUG && console.log(`\n\nSTATUS CHANGED: ${status.toUpperCase()}\n\n`),
    onLogEvent: (data) =>
      DEBUG && console.log(`NGROK EVENT: ${JSON.stringify(data)}`),
  });
  if (DEBUG)
    console.log("\n\nTUNNEL URLS: ", await ngrok.getApi().listTunnels());
  await admin
    .firestore()
    .collection("configuration")
    .doc("development")
    .collection("webhooks")
    .doc(`${ipv4}`)
    .set(
      {
        ipv4,
        url,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .then(async () => {
      console.log("\nWEBHOOK TUNNEL SETUP COMPLETE!");
      console.log("\nNGROK CONSOLE URL: ", await ngrok.getUrl());
      console.log("\nNGROK Tunnel URL: ", url);
      console.log(
        "\nPROVET CLOUD WEBHOOKS                    DEVELOPMENT WEBHOOK PROXY                                                     DEVELOPMENT ENVIRONMENT",
      );
      console.log(
        `${process.env.STAGING_PROVET_CLOUD_API_BASE} ==> https://us-central1-movet-care-staging.cloudfunctions.net/webhookProxyDev ==> https://${ipv4}:${firebaseConfig.emulators.functions.port}\n\n`,
      );
    })
    .catch((error) => {
      console.error(error);
      return process.exit(1);
    });
})();
