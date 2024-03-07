const axios = require("axios").default;
import {
  DEBUG,
  defaultRuntimeOptions,
  functions,
  environment as serverEnv,
} from "../../config/config";
import { requestIsAuthorized } from "../../utils/requestIsAuthorized";

export const syncData = functions.runWith(defaultRuntimeOptions).https.onCall(
  async (
    {
      environment,
      type,
    }: {
      environment: "production";
      type: "bookings" | "closures" | "openings";
    },
    context: any,
  ): Promise<any> => {
    if (DEBUG) console.log("syncData DATA =>", { environment, type });
    if (
      (await requestIsAuthorized(context)) &&
      environment === "production" &&
      serverEnv.type === "development"
    ) {
      switch (type) {
        case "bookings":
          return await axios
            .get(
              "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/bookings/",
            )
            .then(async (response: any) => {
              const { data, status } = response;
              if (DEBUG)
                console.log(
                  "API Response: GET https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/bookings/ =>",
                  data,
                );
              return status !== 200 && status !== 201
                ? { error: { code: status }, data }
                : data;
            })
            .catch((error: any) => error);
        case "openings":
          return await axios
            .get(
              "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/openings/",
            )
            .then(async (response: any) => {
              const { data, status } = response;
              if (DEBUG)
                console.log(
                  "API Response: POST https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/openings/ =>",
                  data,
                );
              return status !== 200 && status !== 201
                ? { error: { code: status }, data }
                : data;
            })
            .catch((error: any) => error);
        case "closures":
          return await axios
            .get(
              "https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/closures/",
            )
            .then(async (response: any) => {
              const { data, status } = response;
              if (DEBUG)
                console.log(
                  "API Response: POST https://us-central1-movet-care.cloudfunctions.net/incomingWebhook/configuration/closures/ =>",
                  data,
                );
              return status !== 200 && status !== 201
                ? { error: { code: status }, data }
                : data;
            })
            .catch((error: any) => error);
        default:
          return false;
      }
    } else return false;
  },
);
