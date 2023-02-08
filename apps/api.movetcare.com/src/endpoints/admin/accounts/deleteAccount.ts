import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  DEBUG,
  admin,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import { deleteAllAccountData } from "../../../utils/deleteAllAccountData";
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
        .catch(async (error: any) => {
          console.log(error);
          return await deleteAllAccountData(context.auth?.uid, false);
        });
    } else if ((await requestIsAuthorized(context)) && data?.id)
      return await admin
        .auth()
        .deleteUser(data?.id)
        .then(() => {
          sendNotification({
            type: "slack",
            payload: {
              message: `:sob: ${context.auth?.email} has deleted ${data.id}'s MoVET account!`,
            },
          });
          return true;
        })
        .catch(async (error: any) => {
          console.log(error);
          return await deleteAllAccountData(data?.id, false);
        });
    else return throwError({ message: "AUTHENTICATION FAILED" });
  });
