const axios = require("axios").default;
import {Response} from "express";
import {
  functions,
  environment,
  defaultRuntimeOptions,
  admin,
  stripeApiVersion,
  DEBUG,
} from "../../config/config";

export const webhookProxyDev: Promise<Response> = functions
  .runWith(defaultRuntimeOptions)
  .https.onRequest(async (request: any, response: any) => {
    if (
      (environment.type === "staging" || environment.type === "development") &&
      request.headers.host ===
        "us-central1-movet-care-staging.cloudfunctions.net"
    ) {
      return await admin
        .firestore()
        .collection("configuration")
        .doc("development")
        .collection("webhooks")
        .where("updatedOn", ">", new Date(Date.now() - 5 * 60 * 1000))
        .get()
        .then((querySnapshot: any) => {
          return querySnapshot.forEach(async (doc: any) =>
            request.body?.livemode === false
              ? await axios
                  .post(
                    `${doc.data()?.url}/${
                      environment.project_id
                    }/us-central1/incomingWebhook/stripe/webhook/`,
                    request.body
                  )
                  .then((res: any) => {
                    if (DEBUG) console.log("NGROK RESPONSE => ", res.body);
                    return response.status(200).send();
                  })
                  .catch((error: any) => {
                    if (DEBUG) console.error(error);
                    return response.status(200).send();
                  })
              : await axios
                  .post(
                    `${doc.data()?.url}/${
                      environment.project_id
                    }/us-central1/incomingWebhook/provet/webhook/`,
                    request.body
                  )
                  .then((res: any) => {
                    if (DEBUG) console.log("NGROK RESPONSE => ", res.body);
                    return response.status(200).send();
                  })
                  .catch((error: any) => {
                    if (DEBUG) console.error(error);
                    return response.status(200).send();
                  })
          );
        })
        .catch((error: any) => {
          if (DEBUG) console.error(error);
          return response.status(500).send();
        });
    }
    return response.status(400).send();
  });
