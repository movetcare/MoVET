import { Request, Response } from "express";
import { AuthorizationCode } from "simple-oauth2";
import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";

export const configureProVetAuth = async (
  request: Request,
  response: Response,
) => {
  try {
    const oauthClient = new AuthorizationCode({
      client: {
        id: request.body?.client_id,
        secret: request.body?.client_secret,
      },
      auth: {
        tokenHost: "https://us.provetcloud.com/",
        tokenPath: "/4285/oauth2/token/",
        refreshPath: "/4285/oauth2/token/",
        revokePath: "/4285/oauth2/revoke_token/",
        authorizeHost: "https://us.provetcloud.com/",
        authorizePath: "/4285/oauth2/authorize/",
      },
    });

    const authorizationUrl = oauthClient.authorizeURL({
      redirect_uri:
        "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/provet/webhook/",
      scope: "restapi",
    });

    console.log("configureProVetAuth - authorizationUrl =>", authorizationUrl);
    admin
      .firestore()
      .collection("configuration")
      .doc("provet")
      .set({
        authorizationUrl,
        status: "AUTH_REQUIRED",
        createdOn: new Date(),
      })
      .catch((error: any) => throwError(error));
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: ProVet API O Auth Token Reset Required - ${authorizationUrl}`,
      },
    });
    return response.status(200).send({ received: true });
  } catch (error: any) {
    console.error("configureProVetAuth ERROR => ", JSON.stringify(error));
    throwError(error);
    return response.status(500).send({ received: false });
  }

  // (axios.defaults.headers as any).common["User-Agent"] = "MoVET/3.0";
  // (axios.defaults.headers as any).post["Content-Type"] = "application/json";

  // await axios
  //   .request({
  //     method: "POST",
  //     url: `${token_url}?response_type=code&client_id=${client_id}&scope=restapi&redirect_uri=https%3A%2F%2Fapp.movetcare.com%2F`,
  //     headers: {
  //       Authorization: `Basic ${Buffer.from(
  //         `${client_id}:${client_secret}`,
  //       ).toString("base64")}`,
  //       "content-type": "application/x-www-form-urlencoded",
  //     },
  //   })
  //   .then((response: any) => {
  //     if (DEBUG)
  //       console.log(
  //         "configureProVetAuth => authorize -> PROVET API RESPONSE",
  //         response.data,
  //       );
  //     //return response.data.access_token;
  //   })
  //   .catch((error: any) => throwError(error));
  //  const params = new Proxy(
  //    new URLSearchParams(authorizationUrl.split("?")[1]),
  //    {
  //      get: (searchParams, prop: any) => searchParams.get(prop),
  //    },
  //  ) as any;
  //  const code = params.code;
  //  if (DEBUG) {
  //    console.log("PROVET AUTH - authorizationUrl params =>", params);
  //    console.log("PROVET AUTH - code =>", code);
  //  }
  //  let tokenResponse = null;
  //  try {
  //    tokenResponse = await oauthClient.getToken({
  //      code,
  //      redirect_uri: redirectUrl,
  //      scope: "restapi",
  //    } as any);
  //    if (DEBUG)
  //      console.log("processProVetWebhook => tokenResponse", tokenResponse);
  //  } catch (error: any) {
  //    throwError(error);
  //    return response.sendStatus(500);
  //  }
  //  if (tokenResponse) {
  //    admin
  //      .firestore()
  //      .collection("configuration")
  //      .doc("provet")
  //      .set(
  //        {
  //          ...tokenResponse.token,
  //          authorizationUrl,
  //          status: "READY",
  //          createdOn: new Date(),
  //          updatedOn: new Date(),
  //        },
  //        { merge: true },
  //      )
  //      .catch((error: any) => throwError(error));
  //    return response.status(200).send({ received: true });
  //  } else return response.sendStatus(500).send({ received: false });
};
