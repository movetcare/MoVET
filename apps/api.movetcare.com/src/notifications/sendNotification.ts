/* eslint-disable no-case-declarations */
import {
  admin,
  emailClient,
  environment,
  throwError,
  request,
  // DEBUG,
} from "../config/config";
import { findSlackChannel } from "../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../utils/logging/sendSlackMessage";
import { createProVetNote } from "../integrations/provet/entities/note/createProVetNote";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../utils/getClientNotificationSettings";
import { fetchNewGoToAccessToken } from "../integrations/goto/fetchNewGoToAccessToken";
//import { pushNotification } from "../integrations/expo/pushNotification";
const DEBUG = true;
export const sendNotification = async ({
  type,
  payload,
}: {
  type: "slack" | "email" | "sms" | "push";
  payload: any;
}): Promise<void> => {
  if (DEBUG) {
    console.log(
      `sendNotification => NOTIFICATION OF TYPE "${type.toUpperCase()}" TRIGGERED`,
    );
    console.log("sendNotification => PAYLOAD", payload);
  }
  const sendSlackMessageToChannel = async (message: string | null = null) => {
    if (DEBUG) {
      console.log("sendSlackMessageToChannel message", message);
      console.log(
        "sendSlackMessageToChannel payload?.message",
        JSON.stringify(payload?.message),
      );
    }
    const channelId: any = await findSlackChannel(
      environment.type === "production" && payload?.channel
        ? payload?.channel
        : environment.type === "production"
        ? "production-logs"
        : "development-feed",
    );
    if (DEBUG) console.log("sendNotification => channelId", channelId);
    if (
      Array.isArray(payload?.message) &&
      payload?.message[0]?.fields?.length <= 10
    ) {
      if (DEBUG) {
        console.log(
          "sendNotification => SENDING SLACK MESSAGE AS A BLOCK",
          JSON.stringify(payload?.message),
        );
      }
      sendSlackMessage(channelId, null, payload?.message);
    } else if (payload?.message !== null && message === null) {
      if (DEBUG)
        console.log(
          "sendNotification => SENDING SLACK MESSAGE FROM PAYLOAD",
          payload?.message,
        );
      sendSlackMessage(channelId, payload?.message);
    } else if (message) {
      if (DEBUG)
        console.log(
          "sendNotification => SENDING SLACK MESSAGE (HARDCODED)",
          payload?.message,
        );
      sendSlackMessage(channelId, message);
    } else
      console.log("SLACK MESSAGE NOT SENT - BAD MESSAGE FORMAT", {
        message,
        payload: payload?.message,
      });
  };

  switch (type) {
    case "slack":
      if (payload?.message) sendSlackMessageToChannel();
      else if (DEBUG)
        console.log("DID NOT SEND SLACK MESSAGE - MISSING MESSAGE", payload);
      break;
    case "email":
      const emailConfig: any = {
        to:
          environment.type === "production"
            ? payload?.to || "info@movetcare.com"
            : "support+staging@movetcare.com",
        from: payload?.from || "info@movetcare.com",
        // bcc: "alex.rodriguez@movetcare.com",
        replyTo: payload?.replyTo || "info@movetcare.com",
        subject:
          (environment.type === "staging" ? "(STAGING) " : "") +
          (payload?.subject || "WHOOPS! Something Went Wrong..."),
        text: payload?.message?.replace(/(<([^>]+)>)/gi, ""),
        html: payload?.message,
      };
      if (DEBUG) console.log("emailConfig =>", emailConfig);
      const sendEmailNotification = () => {
        if (
          environment.type !== "production" ||
          emailConfig?.to?.toLowerCase().includes("+test")
        )
          sendSlackMessageToChannel(
            `:e-mail: ${environment.type} Environment Email NOT Sent to ${
              emailConfig?.to?.toLowerCase()?.includes("+test")
                ? "TEST Client"
                : "Client"
            }:\n\nTO: ${emailConfig.to}\n\nFROM: ${
              emailConfig.from
            }\n\nSUBJECT: ${emailConfig.subject}`,
          );
        else if (
          !emailConfig?.to?.toLowerCase()?.includes("+test") &&
          !emailConfig?.replyTo?.toLowerCase()?.includes("+test")
        )
          emailClient
            .send(emailConfig)
            .then(() => {
              if (DEBUG) console.log("EMAIL SENT!", emailConfig);
              if (payload?.client && emailConfig.to !== "info@movetcare.com") {
                createProVetNote({
                  type: 1,
                  subject: emailConfig.subject,
                  message: emailConfig.message,
                  client: `${payload?.client}`,
                  patients: payload?.patients || [],
                });
                admin
                  .firestore()
                  .collection("clients")
                  .doc(`${payload?.client}`)
                  .collection("notifications")
                  .add({
                    type: "email",
                    ...emailConfig,
                    createdOn: new Date(),
                  })
                  .catch((error: any) => throwError(error));
              }
              sendSlackMessageToChannel(
                `:e-mail: System Email Sent:\n\nTO: ${emailConfig.to}\n\nFROM: ${emailConfig.from}\n\nSUBJECT: ${emailConfig.subject}`,
              );
            })
            .catch((error: any) => {
              if (DEBUG) console.log("EMAIL FAILED TO SEND!", emailConfig);
              sendSlackMessageToChannel(
                `:e-mail: System Email FAILED:\n\nTO: ${
                  emailConfig.to
                }\n\nFROM: ${emailConfig.from}\n\nSUBJECT: ${
                  emailConfig.subject
                }\n\nREASON: \`\`\`${JSON.stringify(error)}}\`\`\``,
              );
              if (payload?.client)
                createProVetNote({
                  type: 0,
                  subject: "FAILED TO SEND: " + payload?.subject,
                  message:
                    "ERROR MESSAGE: " +
                    JSON.stringify(error) +
                    "\n\nMESSAGE CONTENTS:\n" +
                    payload?.message,
                  client: payload?.client,
                  patients: payload?.patients || [],
                });
              throwError(error);
            });
      };
      if (payload?.client) {
        const userNotificationSettings: UserNotificationSettings | false =
          await getClientNotificationSettings(payload?.client);
        if (
          userNotificationSettings &&
          userNotificationSettings?.sendEmail &&
          environment?.type === "production" &&
          !emailConfig?.to?.toLowerCase()?.includes("+test")
        ) {
          sendEmailNotification();
        } else if (DEBUG)
          console.log("DID NOT SEND EMAIL", {
            sendEmail:
              userNotificationSettings && userNotificationSettings?.sendEmail,
            ...emailConfig,
          });
      } else if (environment?.type === "production") sendEmailNotification();
      break;
    case "sms":
      if (payload?.client) {
        const phone = await admin
          .firestore()
          .collection("clients")
          .doc(`${payload?.client}`)
          .get()
          .then(
            (doc: any) =>
              doc
                .data()
                ?.phone.replace("(", "")
                .replace(")", "")
                .replace("-", "")
                .replace(" ", ""),
          )
          .catch((error: any) => throwError(error));
        if (phone) {
          const userNotificationSettings: UserNotificationSettings | false =
            await getClientNotificationSettings(payload?.client);
          if (
            userNotificationSettings &&
            userNotificationSettings?.sendSms &&
            phone &&
            environment?.type === "production"
          ) {
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
                  url: "https://api.jive.com/messaging/v1/messages",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "content-type": "application/json",
                  },
                  data: {
                    ownerPhoneNumber: "+17205077387",
                    contactPhoneNumbers: [phone],
                    body: payload?.message,
                  },
                })
                .then((response: any) => {
                  if (DEBUG)
                    console.log(
                      "processGoToWebhook => GOTO SMS RESPONSE",
                      response.data,
                    );
                  sendSlackMessageToChannel(
                    `:speech_balloon: System SMS Sent:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}`,
                  );
                  createProVetNote({
                    type: 0,
                    subject: payload?.subject,
                    message: payload?.message,
                    client: payload?.client,
                    patients: payload?.patients || [],
                  });
                  admin
                    .firestore()
                    .collection("clients")
                    .doc(`${payload?.client}`)
                    .collection("notifications")
                    .add({
                      type: "sms",
                      body: payload?.message,
                      from: "+17206775047",
                      to: phone,
                      createdOn: new Date(),
                    })
                    .catch((error: any) => throwError(error));
                })
                .catch(async (error: any) => {
                  const handleError = (error: any) => {
                    sendSlackMessageToChannel(
                      `:speech_balloon: System SMS FAILED:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nREASON: ${
                        error?.message || JSON.stringify(error)
                      }`,
                    );
                    createProVetNote({
                      type: 0,
                      subject: "FAILED TO SEND: " + payload?.subject,
                      message:
                        "ERROR MESSAGE: " +
                        JSON.stringify(error) +
                        "\n\nMESSAGE CONTENTS:\n" +
                        payload?.message,
                      client: payload?.client,
                      patients: payload?.patients || [],
                    });
                    throwError(error);
                  };
                  if (error.message.includes("401")) {
                    const newAccessToken =
                      await fetchNewGoToAccessToken(refreshToken);
                    if (DEBUG) console.log("newAccessToken", newAccessToken);
                    if (newAccessToken)
                      request
                        .request({
                          method: "POST",
                          url: "https://api.jive.com/messaging/v1/messages",
                          headers: {
                            Authorization: `Bearer ${newAccessToken}`,
                            "content-type": "application/json",
                          },
                          data: {
                            ownerPhoneNumber: "+17205077387",
                            contactPhoneNumbers: [phone],
                            body: payload?.message,
                          },
                        })
                        .then((response: any) => {
                          if (DEBUG)
                            console.log(
                              "processGoToWebhook => GOTO SMS RESPONSE",
                              response.data,
                            );
                          sendSlackMessageToChannel(
                            `:speech_balloon: System SMS Sent:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}`,
                          );
                          createProVetNote({
                            type: 0,
                            subject: payload?.subject,
                            message: payload?.message,
                            client: payload?.client,
                            patients: payload?.patients || [],
                          });
                          admin
                            .firestore()
                            .collection("clients")
                            .doc(`${payload?.client}`)
                            .collection("notifications")
                            .add({
                              type: "sms",
                              body: payload?.message,
                              from: "+17206775047",
                              to: phone,
                              createdOn: new Date(),
                            })
                            .catch((error: any) => handleError(error));
                        })
                        .catch((error: any) => handleError(error));
                  } else {
                    handleError(error);
                  }
                });
            }
          } else {
            if (DEBUG)
              console.log("DID NOT SEND SMS", {
                sendSms:
                  userNotificationSettings && userNotificationSettings?.sendSms,
                subject: payload?.subject,
                body: payload?.message,
                to: phone,
              });
            sendSlackMessageToChannel(
              `:speech_balloon: System SMS SKIPPED:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nCLIENT SMS ENABLED: ${
                userNotificationSettings &&
                userNotificationSettings?.sendSms.toString()
              }`,
            );
          }
        } else {
          if (DEBUG)
            console.log(
              "DID NOT SEND SMS - MISSING CLIENT PHONE NUMBER",
              payload?.subject,
            );
          sendSlackMessageToChannel(
            `:speech_balloon: System SMS FAILED:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nREASON: MISSING CLIENT PHONE NUMBER`,
          );
        }
      } else {
        if (DEBUG)
          console.log("DID NOT SEND SMS - MISSING CLIENT ID", payload?.subject);
        sendSlackMessageToChannel(
          `:speech_balloon: System SMS FAILED:\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nREASON: MISSING CLIENT ID`,
        );
      }
      break;
    case "push":
      if (payload?.category === "admin-telehealth") {
        let adminFcmTokens: Array<string> | null = null;
        const allAdminTokenData: Array<any> = [];
        if (payload?.category === "admin-telehealth")
          adminFcmTokens = await admin
            .firestore()
            .collection("fcmTokensAdmin")
            .get()
            .then((querySnapshot: any) => {
              const allValidTokens: Array<string> = [];
              querySnapshot.forEach((doc: any) => {
                if (DEBUG) console.log(doc.id, " => ", doc.data());
                doc.data()?.tokens?.forEach((token: any) => {
                  if (token.isActive) {
                    allValidTokens.push(token.token);
                    allAdminTokenData.push({ uid: doc.id, token: token.token });
                  }
                });
              });
              return allValidTokens;
            })
            .catch((error: any) => throwError(error));
        if (DEBUG) {
          console.log("adminFcmTokens", adminFcmTokens);
        }
        if (adminFcmTokens && adminFcmTokens.length > 0)
          admin
            .messaging()
            .sendMulticast({
              tokens: adminFcmTokens,
              notification: {
                title: payload?.title,
                body: payload?.message,
              },
              data: payload?.data || { test: "testing" },
              webpush: {
                headers: {
                  Urgency: payload?.urgency || "high",
                },
                notification: {
                  body: payload?.message,
                  requireInteraction: "true",
                  badge: "/images/logo/logo-paw-black.png",
                },
                fcm_options: {
                  link:
                    (environment?.type === "production"
                      ? "https://admin.movetcare.com"
                      : "http://localhost:3002") + payload?.path,
                },
              },
            })
            .then(async (response: any) => {
              sendSlackMessageToChannel(
                `:outbox_tray: Push Notifications Sent!\nPAYLOAD:\n${JSON.stringify(
                  {
                    tokens: adminFcmTokens,
                    notification: {
                      title: payload?.title,
                      body: payload?.message,
                    },
                    data: payload?.data || { test: "testing" },
                    webpush: {
                      headers: {
                        Urgency: payload?.urgency || "high",
                      },
                      notification: {
                        body: payload?.message,
                        requireInteraction: "true",
                        badge: "/images/logo/logo-paw-black.png",
                      },
                      fcm_options: {
                        link:
                          (environment?.type === "production"
                            ? "https://admin.movetcare.com"
                            : "http://localhost:3002") + payload?.path,
                      },
                    },
                  },
                )}\nRESPONSE:\n${JSON.stringify(response)}`,
              );
              if (response.failureCount > 0) {
                const failedTokens: any = [];
                response.responses.forEach((resp: any, index: number) => {
                  if (!resp.success) {
                    failedTokens.push(
                      adminFcmTokens ? adminFcmTokens[index] : [],
                    );
                  }
                });
                if (DEBUG)
                  console.log(
                    "List of tokens that caused failures: " + failedTokens,
                  );
                if (failedTokens.length > 0) {
                  const adminTokensToDisable: Array<{
                    uid: string;
                    token: string;
                  }> = [];
                  allAdminTokenData.map((tokenData: any) => {
                    if (failedTokens.includes(tokenData.token))
                      adminTokensToDisable.push({
                        uid: tokenData.uid,
                        token: tokenData.token,
                      });
                  });
                  if (DEBUG)
                    console.log("adminTokensToDisable", adminTokensToDisable);
                  await Promise.all(
                    adminTokensToDisable.map(async (tokenData: any) => {
                      const adminUserTokens = await admin
                        .firestore()
                        .collection("fcmTokensAdmin")
                        .doc(tokenData.uid)
                        .get()
                        .then((doc: any) => doc.data().tokens)
                        .catch((error: any) => throwError(error));
                      if (adminUserTokens) {
                        const updatedTokens = adminUserTokens.map(
                          (token: any) => {
                            if (token.token === tokenData.token)
                              return { ...token, isActive: false };
                            else return token;
                          },
                        );
                        await admin
                          .firestore()
                          .collection("fcmTokensAdmin")
                          .doc(tokenData.uid)
                          .update({ tokens: updatedTokens })
                          .catch((error: any) => throwError(error));
                      }
                    }),
                  );
                }
              }
            })
            .catch((error: any) => throwError(error));
        else if (DEBUG) console.log("NO TOKENS FOUND", { adminFcmTokens });
      } else if (payload?.category === "client-telehealth") {
        const clientFcmTokens = await admin
          .firestore()
          .collection("fcmTokensClient")
          .doc(payload?.user?.uid)
          .get()
          .then((doc: any) => {
            const allValidTokens: Array<string> = [];
            if (DEBUG) console.log(doc.id, " => ", doc.data());
            doc.data()?.tokens?.forEach((token: any) => {
              console.log("TOKEN ARRAY", token);
              if (token.isActive) allValidTokens.push(token.token);
            });
            return allValidTokens;
          })
          .catch((error: any) => throwError(error));
        if (DEBUG) console.log("clientFcmTokens", clientFcmTokens);
      } else if (DEBUG) console.log("UNSUPPORTED PUSH NOTIFICATION TYPE!");
      break;
    default:
      break;
  }
};
