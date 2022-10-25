import {
  request,
  projectApiKey,
  throwError,
  environment,
  admin,
} from "../../config/config";
const DEBUG = true;
const API_URL =
  environment.type === "development"
    ? `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${projectApiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${projectApiKey}`;
export const sendSignInByEmailLink = async ({
  email,
  sendEmail,
  sessionId,
}: {
  email?: string | null;
  sessionId?: string;
  sendEmail: boolean;
}): Promise<boolean | string> => {
  if (DEBUG) console.log("sendSignInByEmailLink => USER INFO", email);
  if (email && sendEmail) {
    const response = await request
      .post(
        API_URL,
        {
          requestType: "EMAIL_SIGNIN",
          email,
        },
        {headers: {"Content-Type": "application/json", Authorization: ""}}
      )
      .then((response: any) => response.data)
      .catch(async (error: any) => await throwError(error));
    if (DEBUG)
      console.log(
        `sendSignInByEmailLink => RESUME BOOKING LINK SENT TO: ${response.email}`,
        response
      );
    return true;
  } else if (email && !sendEmail) {
    return await admin.auth().generateEmailVerificationLink(email, {
      url:
        (environment.type === "production"
          ? "https://movetcare.com"
          : "http://localhost:3000") +
        "/booking" +
        `${sessionId ? `?id=${sessionId}` : ""}`,
    });
  } else {
    if (DEBUG)
      console.log(
        "sendSignInByEmailLink => FAILED TO SEND SIGN IN BY EMAIL BOOKING RECOVERY LINK - MISSING EMAIL",
        {email, sendEmail}
      );
    return false;
  }
};
