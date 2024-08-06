/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { admin, throwError } from "../../config/config";

import * as func from "firebase-functions";
const axios = require("axios").default;
const DEBUG = false;

axios.defaults.baseURL = func.config()?.provet_cloud?.api_base;
// (axios.defaults.headers as any).common["Authorization"] =
//   `Bearer ${accessToken}` as any;
(axios.defaults.headers as any).common["User-Agent"] = "MoVET/3.0";
(axios.defaults.headers as any).post["Content-Type"] = "application/json";

export const fetchNewProVetAccessToken = async (
  refreshToken: string,
): Promise<string | false> => {
  if (DEBUG)
    console.log("fetchNewProVetAccessToken => refreshToken", refreshToken);
  const newToken = await axios
    .request({
      method: "POST",
      url: `/oauth2/token/?grant_type=refresh_token&refresh_token=${refreshToken}`,
      // headers: {
      //   Authorization: `Basic ${Buffer.from(
      //     `${functions.config()?.goto.client_id}:${functions.config()?.goto
      //       .client_secret}`,
      //   ).toString("base64")}`,
      //   "content-type": "application/x-www-form-urlencoded",
      // },
    })
    .then((response: any) => {
      if (DEBUG)
        console.log(
          "fetchNewProVetAccessToken => refreshToken -> PROVET API RESPONSE",
          response.data,
        );
      admin
        .firestore()
        .collection("configuration")
        .doc("provet")
        .set(
          {
            ...response.data,
            status: "RENEWED",
            updatedOn: new Date(),
          },
          { merge: true },
        )
        .catch((error: any) => throwError(error));
      return response.data.access_token;
    })
    .catch((error: any) => throwError(error));
  return newToken;
};
