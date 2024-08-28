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
import { sendNotification } from "../../../notifications/sendNotification";
import { truncateString } from "../../../utils/truncateString";
import { getClientFirstNameFromDisplayName } from "../../../utils/getClientFirstNameFromDisplayName";
import type { PatientBookingData } from "../../../types/booking";
import { getAllActivePatients } from "../../../utils/getAllActivePatients";
import { createProVetNote } from "../../../integrations/provet/entities/note/createProVetNote";
const DEBUG = false;
export const newClientTelehealthMessage = functions.firestore
  .document("/telehealth_chat/{clientId}/log/{messageId}")
  .onCreate(async (snapshot: any, context: any) => {
    const { user, text, startNewThread, image } = snapshot.data();
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
    if (user?._id === context.params.clientId) {
      sendNotification({
        type: "push",
        payload: {
          category: "admin",
          title: "New Telehealth Message",
          message: `${displayName} has sent a new message!`,
          path: `/telehealth/chat/?id=${context.params.clientId}`,
        },
      });
      sendNotification({
        type: "email",
        payload: {
          to: "info@movetcare.com",
          replyTo: email,
          subject: `New Telehealth Chat Message from ${displayName} (#${context.params.clientId})`,
          message: text
            ? `<p>"${text}"</p><p></p><a href="https://admin.movetcare.com/telehealth/chat/?id=${context.params.clientId}"><b>Reply to Message</b></a>`
            : `<img src="${image}" alt="image"/><p></p><a href="https://admin.movetcare.com/telehealth/chat/?id=${context.params.clientId}"><b>Reply to Message</b></a>`,
        },
      });
    } else
      sendNotification({
        type: "push",
        payload: {
          user: { uid: context.params.clientId },
          category: "client-telehealth",
          title: "New Message from MoVET",
          message: truncateString(text),
          path: "/chat",
        },
      });
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
              : "Image Uploaded: " + image + " :question:"
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
                createdOn: new Date(),
                lastSlackThread: result?.message?.ts,
                status: "active",
              },
              { merge: true },
            )
            .catch((error: any) => throwError(error));
      }
      if (image)
        createProVetNote({
          type: 12,
          subject: "Telehealth Chat - Image Uploaded",
          message: image,
          client: context.params.clientId,
          patients: [],
        });
      const patients: Array<PatientBookingData> | any =
        await getAllActivePatients(context.params.clientId);
      const patientQuestion =
        Array.isArray(patients) && patients?.length > 0
          ? patients?.length > 1
            ? `While you wait, please let us know which pet is this for.\n${patients.map(
                (patient: PatientBookingData, index: number) =>
                  `\n${
                    index === patients?.length - 1
                      ? ` or ${patient?.name}`
                      : patient?.name
                  }`,
              )}`
            : `Is this inquiry for ${patients[0]?.name} or a different pet?`
          : "While you wait, please let us know which pet is this for.\n\nProvide your pet's name, age, and breed. As well as any symptoms you are seeing or questions you have for us.";
      const { onlineAutoReply, offlineAutoReply, isOnline } = await admin
        .firestore()
        .collection("alerts")
        .doc("telehealth")
        .get()
        .then((doc: any) => {
          return {
            onlineAutoReply: displayName
              ? `Hi ${getClientFirstNameFromDisplayName(displayName)}.\n\n` +
                doc.data()?.onlineAutoReply
              : "" + doc.data()?.onlineAutoReply,
            offlineAutoReply: displayName
              ? `Hi ${getClientFirstNameFromDisplayName(displayName)}.\n\n` +
                doc.data()?.offlineAutoReply
              : "" + doc.data()?.offlineAutoReply,
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
      const autoReplyMessageId = randomUUID();
      const autoReplyQuestionMessageId = randomUUID();
      await admin
        .firestore()
        .collection("telehealth_chat")
        .doc(context.params.clientId)
        .collection("log")
        .add({
          _id: autoReplyMessageId,
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
              _id: autoReplyMessageId,
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

      const patientNames =
        Array.isArray(patients) && patients?.length > 0
          ? patients.map((patient: PatientBookingData) => patient?.name)
          : null;

      let patientMentioned = false;
      if (patientNames)
        patientNames?.map((name: string) => {
          if (text?.toLowerCase()?.includes(name?.toLowerCase()))
            patientMentioned = true;
        });

      if (
        (Array.isArray(patients) && patients?.length === 0) ||
        !patientMentioned
      )
        await admin
          .firestore()
          .collection("telehealth_chat")
          .doc(context.params.clientId)
          .collection("log")
          .add({
            _id: autoReplyQuestionMessageId,
            text: patientQuestion,
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
                _id: autoReplyQuestionMessageId,
                text: patientQuestion,
                user: {
                  _id: "0",
                  name: "MoVET",
                  avatar:
                    "https://movetcare.com/images/logos/logo-paw-black.png",
                },
                createdAt: new Date(),
              }),
          )
          .catch((error: any) => throwError(error));
    }
    return null;
  });
