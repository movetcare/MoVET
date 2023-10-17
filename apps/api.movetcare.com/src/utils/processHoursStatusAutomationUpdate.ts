import { DEBUG, admin } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { todayIsAGlobalClosure } from "./todayIsAGlobalClosure";

export const processHoursStatusAutomationUpdate = async (options: {
  action: "open" | "close";
  type: "clinic" | "housecall" | "walkins" | "boutique";
  dayOfWeek: number;
  automatedOpenTime: number;
  automatedCloseTime: number;
}) => {
  const { action, type } = options;
  if (DEBUG) {
    console.log("options", { action, type });
    console.log("process.env.TZ", process.env.TZ);
  }
  if (action === "open") {
    const todayIsAClosure = await todayIsAGlobalClosure();
    switch (type) {
      case "clinic":
        if (todayIsAClosure === false)
          await admin
            .firestore()
            .collection("configuration")
            .doc("hours_status")
            .set(
              {
                clinicStatus: true,
                updatedOn: new Date(),
              },
              { merge: true },
            );
        break;
      case "walkins":
        if (todayIsAClosure === false)
          await admin
            .firestore()
            .collection("configuration")
            .doc("hours_status")
            .set(
              {
                walkinsStatus: true,
                updatedOn: new Date(),
              },
              { merge: true },
            );
        break;
      case "boutique":
        if (todayIsAClosure === false)
          await admin
            .firestore()
            .collection("configuration")
            .doc("hours_status")
            .set(
              {
                boutiqueStatus: true,
                updatedOn: new Date(),
              },
              { merge: true },
            );
        break;
      case "housecall":
        if (todayIsAClosure === false)
          await admin
            .firestore()
            .collection("configuration")
            .doc("hours_status")
            .set(
              {
                housecallStatus: true,
                updatedOn: new Date(),
              },
              { merge: true },
            );
        break;
      default:
        break;
    }
  } else if (action === "close") {
    switch (type) {
      case "clinic":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              clinicStatus: false,
              updatedOn: new Date(),
            },
            { merge: true },
          );
        break;
      case "walkins":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              walkinsStatus: false,
              updatedOn: new Date(),
            },
            { merge: true },
          );
        break;
      case "boutique":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              boutiqueStatus: false,
              updatedOn: new Date(),
            },
            { merge: true },
          );
        break;
      case "housecall":
        await admin
          .firestore()
          .collection("configuration")
          .doc("hours_status")
          .set(
            {
              housecallStatus: false,
              updatedOn: new Date(),
            },
            { merge: true },
          );
        break;
      default:
        break;
    }
  }
  sendNotification({
    type: "slack",
    payload: {
      message: [
        {
          type: "section",
          text: {
            text: ":robot_face: _Automated Hours Status Update Triggered!_",
            type: "mrkdwn",
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*TYPE:*",
            },
            {
              type: "plain_text",
              text: type,
            },
            {
              type: "mrkdwn",
              text: "*ACTION:*",
            },
            {
              type: "plain_text",
              text: action,
            },
          ],
        },
      ],
    },
  });
  return true;
};
