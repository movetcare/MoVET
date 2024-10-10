/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-require-imports */
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
import { processGoToWebhook } from "../../integrations/goto/processGoToWebhook";
import { getClosingsConfiguration } from "../../config/getClosingsConfiguration";
import { getOpeningsConfiguration } from "../../config/getOpeningsConfiguration";
import { getBookingsConfiguration } from "../../config/getBookingsConfiguration";
import { getReasonsConfiguration } from "../../config/getReasonsConfiguration";

const decodeJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
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
  }),
);

app.use(decodeJWT);

app.post("/app/config/", runAsync(initProVetConfig));
app.post("/provet/webhook/", runAsync(processProVetWebhook));
app.post("/expo/webhook/", runAsync(processExpoWebhook));
app.post("/stripe/webhook/", runAsync(processStripeWebhook));
app.get("/goto/login/", runAsync(processGoToWebhook));
app.get("/configuration/bookings/", runAsync(getBookingsConfiguration));
app.get("/configuration/openings/", runAsync(getOpeningsConfiguration));
app.get("/configuration/closings/", runAsync(getClosingsConfiguration));
app.get("/configuration/reasons/", runAsync(getReasonsConfiguration));

export const incomingWebhook: Promise<Response> = functions
  .runWith({
    ...defaultRuntimeOptions,
    memory: "4GB",
    minInstances: 1,
  })
  .https.onRequest(app);
