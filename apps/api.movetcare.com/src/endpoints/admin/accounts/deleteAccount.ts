import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  DEBUG,
  admin,
} from "../../../config/config";
import {logEvent} from "../../../utils/logging/logEvent";

export const deleteAccount = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth)
      return await throwError({message: "MISSING AUTHENTICATION"});
    else if (data?.apiKey === mobileClientApiKey) {
      if (DEBUG) console.log("DELETING ACCOUNT", context.auth?.uid);
      return await admin
        .auth()
        .deleteUser(context.auth?.uid)
        .then(
          async () =>
            await logEvent({
              tag: "delete-account",
              origin: "api",
              success: true,
              data: {
                message: `:sob: ${
                  context.auth?.email || context.auth?.uid
                } has deleted their MoVET account!`,
              },
              sendToSlack: true,
            })
              .then(() => true)
              .catch(async (error: any) => await throwError(error))
        )
        .catch(async (error: any) => await throwError(error));
    } else return await throwError("MISSING API KEY");
  });
