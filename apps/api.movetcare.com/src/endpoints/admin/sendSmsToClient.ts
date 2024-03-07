import { sendNotification } from "../../notifications/sendNotification";
import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
  admin,
  request,
  throwError,
} from "../../config/config";
import { requestIsAuthorized } from "../../utils/requestIsAuthorized";
import { fetchNewGoToAccessToken } from "../../integrations/goto/fetchNewGoToAccessToken";

export const sendSmsToClient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      {
        id,
        message,
        phone,
      }: { id: string | null; message: string; phone: string | undefined },
      context: any,
    ): Promise<boolean> => {
      if (DEBUG) console.log("sendSmsToClient DATA =>", id);
      if (await requestIsAuthorized(context)) {
        if (id === null && phone !== undefined && message !== undefined) {
          const { accessToken, refreshToken } = await admin
            .firestore()
            .collection("configuration")
            .doc("goto")
            .get()
            .then((doc: any) => {
              return {
                accessToken: doc.data()?.access_token,
                refreshToken: doc.data()?.refresh_token,
              };
            })
            .catch((error: any) => throwError(error));
          if (DEBUG) console.log("GOTO ACCESS TOKEN: ", accessToken);
          if (accessToken) {
            request
              .request({
                method: "POST",
                url: "https://api.goto.com/messaging/v1/messages",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "content-type": "application/json",
                },
                data: {
                  ownerPhoneNumber: "+17205077387",
                  contactPhoneNumbers: [phone],
                  body: message,
                },
              })
              .then((response: any) => {
                if (DEBUG)
                  console.log(
                    "sendSmsToClient => GOTO SMS RESPONSE",
                    response.data,
                  );
              })
              .catch(async (error: any) => {
                if (error.message.includes("401")) {
                  const newAccessToken =
                    await fetchNewGoToAccessToken(refreshToken);
                  if (DEBUG) console.log("newAccessToken", newAccessToken);
                  if (newAccessToken)
                    request
                      .request({
                        method: "POST",
                        url: "https://api.goto.com/messaging/v1/messages",
                        headers: {
                          Authorization: `Bearer ${newAccessToken}`,
                          "content-type": "application/json",
                        },
                        data: {
                          ownerPhoneNumber: "+17205077387",
                          contactPhoneNumbers: [phone],
                          body: message,
                        },
                      })
                      .then((response: any) => {
                        if (DEBUG)
                          console.log(
                            "sendSmsToClient => GOTO SMS RESPONSE",
                            response.data,
                          );
                      })
                      .catch((error: any) => throwError(error));
                } else {
                  throwError(error);
                }
              });
          }
        } else
          sendNotification({
            type: "sms",
            payload: {
              client: id,
              message,
            },
          });
        return true;
      } else return false;
    },
  );
