import {
  throwError,
  functions,
  admin,
  // DEBUG,
  emailClient,
  environment,
} from "./../../../config/config";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { createProVetNote } from "../../../integrations/provet/entities/note/createProVetNote";

const DEBUG = false;
export const syncChatLogWithProVet = functions.firestore
  .document("/telehealth_chat/{clientId}")
  .onWrite(async (change: any, context: any) => {
    const document = change.after.exists ? change.after.data() : null;
    const { status } = document || {};
    if (status === "complete") {
      const { email, displayName, phoneNumber } = await getAuthUserById(
        context.params.clientId,
        ["email", "displayName", "phoneNumber"]
      );
      const lastQuestionTimestamp = await admin
        .firestore()
        .collection("telehealth_chat")
        .doc(context.params.clientId)
        .collection("log")
        .where("startNewThread", "==", true)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get()
        .then((snapshot: any) => {
          let timestamp = null;
          snapshot.forEach((doc: any) => {
            timestamp = doc.data()?.createdAt;
          });
          return timestamp;
        })
        .catch((error: any) => throwError(error));
      const chatLog = await admin
        .firestore()
        .collection("telehealth_chat")
        .doc(context.params.clientId)
        .collection("log")
        .where("createdAt", ">=", lastQuestionTimestamp)
        .orderBy("createdAt", "asc")
        .get()
        .then((snapshot: any) => {
          let messages = "";
          snapshot.forEach((doc: any) => {
            messages +=
              doc.data()?.user?._id !== "0"
                ? `(${doc
                    .data()
                    ?.createdAt?.toDate()
                    ?.toLocaleTimeString("en-US")}) ${
                    displayName ? displayName : "Client"
                  }: ${doc.data()?.text}<br/>`
                : `(${doc
                    .data()
                    ?.createdAt?.toDate()
                    ?.toLocaleTimeString("en-US")}) MoVET Support: ${
                    doc.data()?.text
                  }<br/>`;
          });
          return messages;
        })
        .catch((error: any) => throwError(error));
      if (DEBUG) {
        console.log("status", status);
        console.log("email", email);
        console.log("displayName", displayName);
        console.log("phoneNumber", phoneNumber);
        console.log("lastQuestionTimestamp", lastQuestionTimestamp);
        console.log("chatLog", chatLog);
      }
      createProVetNote({
        type: 12,
        subject: "Telehealth Chat Log",
        message: JSON.stringify(chatLog),
        client: context.params.clientId,
        patients: [],
      });
      const emailText = `${
        displayName ? `<p>Hi ${displayName},</p>` : "Hey there,"
      }<p>Thank you for reaching out to MoVET today!<p><p>Please find your chat log summary below:</p>\n\n${chatLog}\n\n<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or "Ask a Question" via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>- The MoVET Team</p>`;
      const emailConfig: any = {
        to: email,
        from: "info@movetcare.com",
        bcc: ["support@movetcare.com", "info@movetcare.com"],
        replyTo: "info@movetcare.com",
        subject: "Chat Summary w/ MoVET",
        text: emailText.replace(/(<([^>]+)>)/gi, ""),
        html: emailText,
      };
      if (environment?.type === "production")
        await emailClient
          .send(emailConfig)
          .then(async () => {
            if (DEBUG) console.log("EMAIL SENT!", emailConfig);
            createProVetNote({
              type: 1,
              subject: "Chat Summary w/ MoVET",
              message: emailConfig.html
                .replaceAll("client", displayName || "You")
                .replaceAll("Client", displayName || "You"),
              client: context.params.clientId,
              patients: [],
            });
          })
          .catch((error: any) => throwError(error));
      else if (DEBUG) console.log("SIMULATING EMAIL NOTIFICATION", emailConfig);
    }
    return null;
  });
