import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
  admin,
  DEBUG,
} from "../../../config/config";

export const getBookingToken = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth.uid)
      return throwError({ message: "MISSING AUTHENTICATION" });
    if (data?.apiKey === mobileClientApiKey) {
      return await admin
        .auth()
        .createCustomToken(context.auth.uid)
        .then((customToken: any) => {
          if (DEBUG) console.log("customToken", customToken);
          return customToken;
        })
        .catch((error: any) => throwError(error));
    } else return false;
  });
