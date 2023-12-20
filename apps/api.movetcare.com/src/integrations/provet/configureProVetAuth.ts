import { response } from "express";
import { AuthorizationCode } from "simple-oauth2";
import { environment, throwError, admin } from "../../config/config";
const DEBUG = true;
export const configureProVetAuth = async ({
  client_id,
  client_secret,
  token_url,
}: {
  client_id: string;
  client_secret: string;
  token_url: string;
}) => {
  const oauthClient = new AuthorizationCode({
    client: {
      id: client_id,
      secret: client_secret,
    },
    auth: {
      tokenHost: token_url,
    },
  } as any);
  const redirectUrl =
    environment.type === "production"
      ? "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/provet/webhook"
      : "http://localhost:5001/movet-care-staging/us-central1/incomingWebhook/provet/webhook";
  const authorizationUrl = oauthClient.authorizeURL({
    redirect_uri: redirectUrl,
    scope: "restapi",
  });
  if (DEBUG) console.log("PROVET AUTH - authorizationUrl =>", authorizationUrl);
  const params = new Proxy(
    new URLSearchParams("?" + authorizationUrl.split("?")[1]),
    {
      get: (searchParams, prop: any) => searchParams.get(prop),
    },
  ) as any;
  const code = params.code;
  if (DEBUG) {
    console.log("PROVET AUTH - authorizationUrl params =>", params);
    console.log("PROVET AUTH - code =>", code);
  }
  let tokenResponse = null;
  try {
    tokenResponse = await oauthClient.getToken({
      code,
      redirect_uri: redirectUrl,
      scope: "restapi",
    } as any);
    if (DEBUG)
      console.log("processProVetWebhook => tokenResponse", tokenResponse);
  } catch (error: any) {
    throwError(error);
    return response.sendStatus(500);
  }
  if (tokenResponse) {
    admin
      .firestore()
      .collection("configuration")
      .doc("provet")
      .set(
        {
          ...tokenResponse.token,
          authorizationUrl,
          status: "READY",
          createdOn: new Date(),
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .catch((error: any) => throwError(error));
    return response.status(200).send({ received: true });
  } else return response.sendStatus(500).send({ received: false });
};
