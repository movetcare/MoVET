import {
  functions,
  defaultRuntimeOptions,
  throwError,
  mobileClientApiKey,
  DEBUG,
} from "../../../config/config";
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
      if (DEBUG)
        console.log(
          "deleteAccount => CLIENT IS DELETING ACCOUNT",
          context.auth?.uid
        );
      return await deleteAllAccountData(context.auth?.uid);
    } else if ((await requestIsAuthorized(context)) && data?.id) {
      if (DEBUG)
        console.log("deleteAccount => ADMIN IS DELETING ACCOUNT", data?.id);
      return await deleteAllAccountData(data?.id);
    } else return throwError({ message: "AUTHENTICATION FAILED" });
  });
