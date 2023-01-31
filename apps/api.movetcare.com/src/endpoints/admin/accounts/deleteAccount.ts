import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  DEBUG,
  admin,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import { requestIsAuthorized } from "../pos/requestIsAuthorized";

export const deleteAccount = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    else if (
      data?.apiKey === mobileClientApiKey &&
      !(await requestIsAuthorized(context)) &&
      data?.id === undefined
    ) {
      if (DEBUG) console.log("DELETING ACCOUNT", context.auth?.uid);
      return await admin
        .auth()
        .deleteUser(context.auth?.uid)
        .then(() => {
          sendNotification({
            type: "slack",
            payload: {
              message: `:sob: ${
                context.auth?.email || context.auth?.uid
              } has deleted their MoVET account!`,
            },
          });
          return true;
        })
        .catch((error: any) => throwError(error));
    } else if ((await requestIsAuthorized(context)) && data?.id)
      return await admin
        .auth()
        .deleteUser(data?.id)
        .then(() => {
          sendNotification({
            type: "slack",
            payload: {
              message: `:sob: ${
                context.auth?.displayName || context.auth?.email
              } has deleted ${data.id}'s MoVET account!`,
            },
          });
          return true;
        })
        .catch((error: any) => throwError(error));
    else return await throwError({ message: "AUTHENTICATION FAILED" });
  });
