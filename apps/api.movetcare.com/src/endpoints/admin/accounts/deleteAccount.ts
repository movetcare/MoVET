import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  DEBUG,
  admin,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";

export const deleteAccount = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    else if (data?.apiKey === mobileClientApiKey) {
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
    } else return throwError("MISSING API KEY");
  });
