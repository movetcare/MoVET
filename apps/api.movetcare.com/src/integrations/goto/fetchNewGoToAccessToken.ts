import { admin, functions, request, throwError } from "../../config/config";
const DEBUG = true;
export const fetchNewGoToAccessToken = async (
  refreshToken: string
): Promise<string | false> => {
  if (DEBUG)
    console.log("fetchNewGoToAccessToken => refreshToken", refreshToken);
  const newToken = await request
    .request({
      method: "POST",
      url: `https://authentication.logmeininc.com/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${functions.config()?.goto.client_id}:${
            functions.config()?.goto.client_secret
          }`
        ).toString("base64")}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    })
    .then((response: any) => {
      if (DEBUG)
        console.log(
          "fetchNewGoToAccessToken => refreshToken -> GOTO API RESPONSE",
          response.data
        );
      admin
        .firestore()
        .collection("configuration")
        .doc("goto")
        .set(
          {
            ...response.data,
            status: "RENEWED",
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .catch((error: any) => throwError(error));
      return response.data.access_token;
    })
    .catch((error: any) => throwError(error));
  return newToken;
};
