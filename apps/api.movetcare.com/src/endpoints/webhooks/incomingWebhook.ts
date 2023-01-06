const express = require("express");
const cors = require("cors");
import { Request, Response, NextFunction } from "express";
import {
  admin,
  defaultRuntimeOptions,
  functions,
  DEBUG,
} from "../../config/config";

import { processProVetWebhook } from "../../integrations/provet/processWebhook";
import { initProVetConfig } from "../../config/initConfig";
import { processExpoWebhook } from "../../integrations/expo/processWebhook";
import { processStripeWebhook } from "../../integrations/stripe/processWebhook";

const decodeJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    if (DEBUG) {
      console.log("idToken", idToken);
      console.log("req", req);
      console.log("res", res);
    }

    try {
      const decodedToken = await admin.auth.verifyIdToken(idToken);
      // @ts-ignore
      req["currentUser"] = decodedToken;
    } catch (error: any) {
      console.error(error);
    }
  }

  next();
};

const runAsync =
  (callback: Function) =>
  (req: Request, res: Response, next: NextFunction): Promise<any> =>
    callback(req, res, next).catch(next);

const app = express();

app.use(cors({ origin: true }));

app.use(
  express.json({
    verify: (req: any, res: any, buffer: any) => (req["rawBody"] = buffer),
  })
);

app.use(decodeJWT);

app.post("/app/config/", runAsync(initProVetConfig));
app.post("/provet/webhook/", runAsync(processProVetWebhook));
app.post("/expo/webhook/", runAsync(processExpoWebhook));
app.post("/stripe/webhook/", runAsync(processStripeWebhook));

export const incomingWebhook: Promise<Response> = functions
  .runWith({
    ...defaultRuntimeOptions,
    memory: "2GB",
  })
  .https.onRequest(app);
