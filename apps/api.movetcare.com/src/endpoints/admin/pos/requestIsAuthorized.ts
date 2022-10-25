import {DEBUG, functions} from "../../../config/config";
import {logEvent} from "../../../utils/logging/logEvent";

export const requestIsAuthorized = async (context: any): Promise<boolean> => {
  if (DEBUG) {
    console.log("REQUEST context.app => ", context.app);
    console.log("REQUEST context.auth => ", context.auth);
  }
  if (
    // context.app === undefined ||
    context.auth === undefined ||
    context.auth.token.email_verified !== true ||
    context.auth.token.firebase.sign_in_provider !== "google.com"
  ) {
    if (DEBUG) {
      console.log("requestIsAuthorized = ", false);
      console.log(
        "context.auth.token.email_verified",
        context.auth.token.email_verified
      );
      console.log(
        "context.auth.token.firebase.sign_in_provider",
        context.auth.token.firebase.sign_in_provider
      );
    }
    await logEvent({
      tag: "error-auth",
      origin: "api",
      success: false,
      sendToSlack: true,
      data: {
        ...context.auth,
      },
    });
    throw new functions.https.HttpsError("failed-precondition", "FAILED AUTH");
  } else if (
    context.auth.token.isSuperAdmin === true ||
    context.auth.token.isAdmin === true ||
    context.auth.token.isStaff === true
  ) {
    if (DEBUG) console.log("requestIsAuthorized = ", true);
    return true;
  } else {
    if (DEBUG) console.log("requestIsAuthorized = ", false);
    return false;
  }
};
