/* eslint-disable no-case-declarations */
import {
  admin,
  emailClient,
  environment,
  smsClient,
  throwError,
  DEBUG,
} from "../config/config";
import { findSlackChannel } from "../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../utils/logging/sendSlackMessage";
import { createProVetNote } from "../integrations/provet/entities/note/createProVetNote";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../utils/getClientNotificationSettings";

export const sendNotification = async ({
  type,
  payload,
}: {
  type: "slack" | "email" | "sms";
  payload: any;
}): Promise<void> => {
  if (DEBUG) {
    console.log(
      `sendNotification => NOTIFICATION OF TYPE "${type.toUpperCase()}" TRIGGERED`
    );
    console.log("sendNotification => PAYLOAD", payload);
  }
  const sendSlackMessageToChannel = async (message: string | null = null) => {
    if (DEBUG) {
      console.log("sendSlackMessageToChannel message", message);
      console.log(
        "sendSlackMessageToChannel payload?.message",
        payload?.message
      );
    }
    const channelId: any = await findSlackChannel(
      environment.type === "production" && payload?.channel
        ? payload?.channel
        : environment.type === "production"
        ? "production-logs"
        : "development-feed"
    );
    if (DEBUG) console.log("sendNotification => channelId", channelId);
    if (Array.isArray(payload?.message)) {
      if (DEBUG)
        console.log(
          "sendNotification => SENDING SLACK MESSAGE AS A BLOCK",
          payload?.message
        );
      sendSlackMessage(channelId, null, payload?.message);
    } else if (payload?.message !== null && message === null) {
      if (DEBUG)
        console.log(
          "sendNotification => SENDING SLACK MESSAGE FROM PAYLOAD",
          payload?.message
        );
      sendSlackMessage(channelId, payload?.message);
    } else if (message) {
      if (DEBUG)
        console.log(
          "sendNotification => SENDING SLACK MESSAGE (HARDCODED)",
          payload?.message
        );
      sendSlackMessage(channelId, message);
    }
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
        bcc:
          payload?.bcc || environment.type === "production"
            ? ["support@movetcare.com", "info@movetcare.com"]
            : "support@movetcare.com",
        replyTo: payload?.replyTo || "info@movetcare.com",
        subject:
          (environment.type === "staging" ? "(STAGING) " : "") +
          (payload?.subject || "WHOOPS! Something Went Wrong..."),
        text: payload?.message?.replace(/(<([^>]+)>)/gi, ""),
        html: payload?.message,
      };
      if (DEBUG) console.log("emailConfig =>", emailConfig);
      const sendEmailNotification = () => {
        emailClient
          .send(emailConfig)
          .then(() => {
            if (DEBUG) console.log("EMAIL SENT!", emailConfig);
            if (payload?.client) {
              createProVetNote({
                type: 1,
                subject: emailConfig.subject,
                message: emailConfig.message,
                client: `${payload?.client}`,
                patients: [],
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
              `:e-mail: System Email Sent:\n\nTO: ${emailConfig.to}\n\nFROM: ${emailConfig.from}\n\nSUBJECT: ${emailConfig.subject}`
            );
          })
          .catch((error: any) => {
            if (DEBUG) console.log("EMAIL FAILED TO SEND!", emailConfig);
            sendSlackMessageToChannel(
              `:e-mail: System Email FAILED:\n\nTO: ${
                emailConfig.to
              }\n\nFROM: ${emailConfig.from}\n\nSUBJECT: ${
                emailConfig.subject
              }\n\nREASON: \`\`\`${JSON.stringify(error)}}\`\`\``
            );
            if (payload?.client)
              createProVetNote({
                type: 0,
                subject: payload?.subject,
                message: payload?.message + "\n\n" + JSON.stringify(error),
                client: payload?.client,
                patients: [],
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
          (environment?.type === "production" || environment.type === "staging")
        ) {
          sendEmailNotification();
        } else if (DEBUG)
          console.log("DID NOT SEND EMAIL", {
            sendEmail:
              userNotificationSettings && userNotificationSettings?.sendEmail,
            ...emailConfig,
          });
      } else sendEmailNotification();
      break;
    case "sms":
      if (payload?.client) {
        const phone = await admin
          .firestore()
          .collection("clients")
          .doc(`${payload?.client}`)
          .get()
          .then((doc: any) =>
            doc
              .data()
              ?.phone.replace("(", "")
              .replace(")", "")
              .replace("-", "")
              .replace(" ", "")
          )
          .catch((error: any) => throwError(error));
        if (phone) {
          const userNotificationSettings: UserNotificationSettings | false =
            await getClientNotificationSettings(payload?.client);
          if (
            userNotificationSettings &&
            userNotificationSettings?.sendSms &&
            phone &&
            (environment?.type === "production" ||
              environment.type === "staging")
          ) {
            smsClient.messages
              .create({
                body: payload?.message,
                from: "+17206775047",
                to: phone,
              })
              .then(async () => {
                if (DEBUG)
                  console.log("SMS SENT!", {
                    body: payload?.message,
                    from: "+17206775047",
                    to: phone,
                  });
                sendSlackMessageToChannel(
                  `:speech_balloon: System SMS Sent:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}`
                );
                createProVetNote({
                  type: 0,
                  subject: payload?.subject,
                  message: payload?.message,
                  client: payload?.client,
                  patients: [],
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
                if (DEBUG)
                  console.log("SMS FAILED TO SEND!", {
                    body: payload?.message,
                    from: "+17206775047",
                    to: phone,
                  });
                sendSlackMessageToChannel(
                  `:speech_balloon: System SMS FAILED:\n\nTO: ${phone}\n\nCLIENT: ${
                    payload?.client
                  }\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${
                    payload?.message
                  }\n\nREASON: ${error?.message || JSON.stringify(error)}`
                );
                createProVetNote({
                  type: 0,
                  subject: payload?.subject,
                  message: payload?.message + "\n\n" + JSON.stringify(error),
                  client: payload?.client,
                  patients: [],
                });
                throwError(error);
              });
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
              `:speech_balloon: System SMS SKIPPED:\n\nTO: ${phone}\n\nCLIENT: ${
                payload?.client
              }\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${
                payload?.message
              }\n\nCLIENT SMS ENABLED: ${
                userNotificationSettings &&
                userNotificationSettings?.sendSms.toString()
              }`
            );
          }
        } else {
          if (DEBUG)
            console.log(
              "DID NOT SEND SMS - MISSING CLIENT PHONE NUMBER",
              payload?.subject
            );
          sendSlackMessageToChannel(
            `:speech_balloon: System SMS FAILED:\n\nTO: ${phone}\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nREASON: MISSING CLIENT PHONE NUMBER`
          );
        }
      } else {
        if (DEBUG)
          console.log("DID NOT SEND SMS - MISSING CLIENT ID", payload?.subject);
        sendSlackMessageToChannel(
          `:speech_balloon: System SMS FAILED:\n\nCLIENT: ${payload?.client}\n\nSUBJECT: ${payload?.subject}\n\nMESSAGE: ${payload?.message}\n\nREASON: MISSING CLIENT ID`
        );
      }
      break;
    default:
      break;
  }
};
