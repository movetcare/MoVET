import { randomUUID } from "crypto";
import {
  functions,
  //DEBUG,
  environment,
  admin,
  throwError,
} from "../../../config/config";
import { getAuthUserById } from "../../../utils/auth/getAuthUserById";
import { findSlackChannel } from "../../../utils/logging/findSlackChannel";
import { sendSlackMessage } from "../../../utils/logging/sendSlackMessage";
const DEBUG = true;
export const newClientTelehealthMessage = functions.firestore
  .document("/telehealth_chat/{clientId}/log/{messageId}")
  .onCreate(async (snapshot: any, context: any) => {
    const { user, text, startNewThread } = snapshot.data();
    const channelId: any = await findSlackChannel("telehealth-alerts");
    const { email, displayName, phoneNumber } = await getAuthUserById(
      context.params.clientId,
      ["email", "displayName", "phoneNumber"],
    );
    if (DEBUG) {
      console.log("user", user);
      console.log("text", text);
      console.log("startNewThread", startNewThread);
      console.log("channelId", channelId);
      console.log("email", email);
      console.log("displayName", displayName);
      console.log("phoneNumber", phoneNumber);
    }
    if (
      startNewThread &&
      user?._id === context.params.clientId &&
      channelId !== null
    ) {
      if (environment.type === "production") {
        const result: any = await sendSlackMessage(
          channelId,
          `:question: @channel New Telehealth Inquiry: ${
            text
              ? `*"${text}"* :question:`
              : "No Question Provided!? :question:"
          }\n\n\`${displayName ? `Name: ${displayName}` : "No Name Found!"} | ${
            context.params.clientId
              ? `ProVet ID: ${context.params.clientId}`
              : "No ProVet ID Found!?"
          } | ${email ? ` Email: ${email}` : "No Email Found!?"} | ${
            phoneNumber ? `Phone: ${phoneNumber}` : "No Phone Number"
          }\`\n\n${`:exclamation: _Please respond in a thread ASAP_ : https://admin.movetcare.com/telehealth/chat/?id=${context.params.clientId} :exclamation:`}`,
        );
        if (DEBUG) console.log("result", result);
        if (result?.message?.ts)
          await admin
            .firestore()
            .collection("telehealth_chat")
            .doc(context.params.clientId)
            .set(
              {
                client: await admin
                  .firestore()
                  .collection("clients")
                  .doc(context.params.clientId)
                  .get()
                  .then((doc: any) => doc?.data()),
                updatedOn: new Date(),
                lastSlackThread: result?.message?.ts,
                status: "active",
              },
              { merge: true },
            )
            .catch((error: any) => throwError(error));
      }
      const { onlineAutoReply, offlineAutoReply, isOnline } = await admin
        .firestore()
        .collection("alerts")
        .doc("telehealth")
        .get()
        .then((doc: any) => {
          return {
            onlineAutoReply: doc.data()?.onlineAutoReply,
            offlineAutoReply: doc.data()?.offlineAutoReply,
            isOnline: doc.data()?.isOnline,
          };
        });
      if (DEBUG)
        console.log("Telehealth Status:", {
          onlineAutoReply,
          offlineAutoReply,
          isOnline,
        });
      await admin
        .firestore()
        .collection("telehealth_chat")
        .doc(context.params.clientId)
        .set(
          {
            client: await admin
              .firestore()
              .collection("clients")
              .doc(context.params.clientId)
              .get()
              .then((doc: any) => doc?.data()),
            updatedOn: new Date(),
            status: "active",
          },
          { merge: true },
        )
        .then(
          () => DEBUG && console.log("Updated Client Info on Telehealth Chat"),
        )
        .catch((error: any) => throwError(error));
      await admin
        .firestore()
        .collection("telehealth_chat")
        .doc(context.params.clientId)
        .collection("log")
        .add({
          _id: randomUUID(),
          text: isOnline ? onlineAutoReply : offlineAutoReply,
          user: {
            _id: "0",
            name: "MoVET",
            avatar: "https://movetcare.com/images/logos/logo-paw-black.png",
          },
          createdAt: new Date(),
        })
        .then(
          () =>
            DEBUG &&
            console.log("Auto Reply Successfully Generated: ", {
              _id: randomUUID(),
              text: isOnline ? onlineAutoReply : offlineAutoReply,
              user: {
                _id: "0",
                name: "MoVET",
                avatar: "https://movetcare.com/images/logos/logo-paw-black.png",
              },
              createdAt: new Date(),
            }),
        )
        .catch((error: any) => throwError(error));
    }
    if (user?._id === context.params.clientId) {
      const adminFcmTokens: any = await admin
        .firestore()
        .collection("fcmTokensAdmin")
        .get()
        .then((querySnapshot: any) => {
          const allValidTokens: any = [];
          querySnapshot.forEach((doc: any) => {
            if (DEBUG) console.log(doc.id, " => ", doc.data());
            doc.data()?.tokens?.forEach((token: any) => {
              console.log("TOKEN ARRAY", token);
              if (token.isActive) allValidTokens.push(token.token);
            });
          });
          return allValidTokens;
        });
      if (DEBUG) console.log("adminFcmTokens", adminFcmTokens);
      //TODO: https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.messaging.md#messagingsendtodevice
      admin.messaging().sendToDevice(
        adminFcmTokens,
        {
          notification: {
            title: "New Telehealth Message",
            body: `${displayName} has sent a new message!`,
            icon: "https://movetcare.com/images/logos/logo-paw-black.png",
            click_action: `https://admin.movetcare.com/telehealth/chat/?id=${context.params.clientId}`,
          },
        },
        {
          contentAvailable: true,
          priority: "high",
        },
      );
    }
    return null;
  });
