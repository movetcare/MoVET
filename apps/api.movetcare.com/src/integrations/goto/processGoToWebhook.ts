import {
  environment,
  throwError,
  functions,
  admin,
  DEBUG,
} from "../../config/config";
import { Request, Response } from "express";
import * as Crypto from "crypto";
import { AuthorizationCode } from "simple-oauth2";
import { sendNotification } from "../../notifications/sendNotification";

export const processGoToWebhook = async (
  request: Request,
  response: Response
): Promise<any> => {
  const oauthClient = new AuthorizationCode({
    client: {
      id: functions.config()?.goto.client_id,
      secret: functions.config()?.goto.client_secret,
    },
    auth: {
      tokenHost: "https://authentication.logmeininc.com",
    },
  } as any);
  const redirectUrl =
    environment.type === "production"
      ? "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/goto/login/"
      : "http://localhost:5001/movet-care-staging/us-central1/incomingWebhook/goto/login/";
  const expectedStateForAuthorizationCode =
    Crypto.randomBytes(15).toString("hex");
  const authorizationUrl = oauthClient.authorizeURL({
    redirect_uri: redirectUrl,
    scope: "messaging.v1.send",
    state: expectedStateForAuthorizationCode,
  });
  if (DEBUG) console.log("processGoToWebhook req =>", request?.body);
  if (request.query.state != expectedStateForAuthorizationCode) {
    if (DEBUG)
      console.log("GoTo -> Ignoring authorization code with unexpected state");
    admin
      .firestore()
      .collection("configuration")
      .doc("goto")
      .set({
        authorizationUrl,
        status: "AUTH_REQUIRED",
        createdOn: new Date(),
      })
      .catch((error: any) => throwError(error));
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: GoTo API O Auth Token Reset Required - ${authorizationUrl}`,
      },
    });
    return response.sendStatus(403);
  }
  let tokenResponse = null;
  try {
    tokenResponse = await oauthClient.getToken({
      code: request.query.code,
      redirect_uri: redirectUrl,
      scope: "messaging.v1.send",
    } as any);
    if (DEBUG)
      console.log("processGoToWebhook => tokenResponse", tokenResponse);
  } catch (error: any) {
    throwError(error);
    return response.sendStatus(500);
  }
  if (tokenResponse)
    admin
      .firestore()
      .collection("configuration")
      .doc("goto")
      .set(
        {
          ...tokenResponse.token,
          authorizationUrl,
          status: "READY",
          createdOn: new Date(),
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .catch((error: any) => throwError(error));
  else return response.sendStatus(500);
};
