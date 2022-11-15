import {
  admin,
  request,
  projectApiKey,
  throwError,
  environment,
  DEBUG,
} from "../../config/config";
// https://github.com/firebase/firebase-admin-node/issues/46#issuecomment-625026299
// https://cloud.google.com/identity-platform/docs/reference/rest/v1/accounts/sendOobCode
const exchangeCustomTokenEndpoint =
  environment.type === "development"
    ? `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${projectApiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${projectApiKey}`;
const sendEmailVerificationEndpoint =
  environment.type === "development"
    ? `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${projectApiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${projectApiKey}`;

export const sendVerificationEmail = async (user: any) => {
  if (DEBUG) console.log("USER INFO = ", user);
  if (!user?.emailVerified) {
    const customToken = await admin
      .auth()
      .createCustomToken(user?.uid)
      .catch((error: any) => throwError(error));
    const { idToken }: any = await request
      .post(
        exchangeCustomTokenEndpoint,
        {
          token: customToken,
          returnSecureToken: true,
        },
        { headers: { "Content-Type": "application/json", Authorization: "" } }
      )
      .then((response: any) => response.data)
      .catch((error: any) => throwError(error));
    if (idToken) {
      const response = await request
        .post(
          sendEmailVerificationEndpoint,
          {
            requestType: "VERIFY_EMAIL",
            idToken: idToken,
          },
          { headers: { "Content-Type": "application/json", Authorization: "" } }
        )
        .then((response: any) => response.data)
        .catch((error: any) => throwError(error));
      if (DEBUG) console.log(`Sent email verification to ${response.email}`);
    }
  }
};
