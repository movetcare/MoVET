import { DEBUG, functions } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";

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
    sendNotification({
      type: "slack",
      payload: {
        message: `:interrobang: Cloud Functions Auth Error\n\n\`\`\`${JSON.stringify(
          context.auth
        )}\`\`\`\n\n`,
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
