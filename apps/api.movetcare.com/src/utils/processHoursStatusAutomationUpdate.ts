/* eslint-disable quotes */
import { DEBUG, admin } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { todayIsAGlobalClosure } from "./todayIsAGlobalClosure";

export const processHoursStatusAutomationUpdate = async (options: {
  action: "open" | "close";
  type: "clinic" | "housecall" | "walkins" | "boutique";
  dayOfWeek: number;
  automatedOpenTime: number;
  automatedCloseTime: number;
  user?: string;
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
                user: options?.user || null,
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
                user: options?.user || null,
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
                user: options?.user || null,
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
                user: options?.user || null,
                updatedOn: new Date(),
              },
              { merge: true },
            );
        break;
      default:
        break;
    }
    if (todayIsAClosure === false)
      sendNotification({
        type: "email",
        payload: {
          to: ["info@movetcare.com", "alex.rodriguez@movetcare.com"],
          replyTo: "alex.rodriguez@movetcare.com",
          subject: `${options?.user ? `(User: #${options?.user}) - ` : ""}${type?.toUpperCase()} HOURS AUTOMATION STATUS UPDATED -  ${action?.toUpperCase()}`,
          message:
            '<p>No further action is required. This is just an alert to let you know the hours automation has run successfully.</p><p><a href="https://admin.movetcare.com/settings/manage-hours/" target="_blank">View Hours Automation Settings</a></p>',
        },
      });
    else
      sendNotification({
        type: "email",
        payload: {
          to: ["info@movetcare.com", "alex.rodriguez@movetcare.com"],
          replyTo: "alex.rodriguez@movetcare.com",
          subject: `SKIPPED ${type?.toUpperCase()} HOURS AUTOMATION STATUS UPDATE`,
          message:
            '<p>This automation has been skipped because today is marked as a global closure. No further action is required.</p><p><a href="https://admin.movetcare.com/settings/manage-hours/" target="_blank">View Hours Automation Settings</a></p>',
        },
      });
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
              user: options?.user || null,
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
              user: options?.user || null,
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
              user: options?.user || null,
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
              user: options?.user || null,
              updatedOn: new Date(),
            },
            { merge: true },
          );
        break;
      default:
        break;
    }
    sendNotification({
      type: "email",
      payload: {
        to: ["info@movetcare.com", "alex.rodriguez@movetcare.com"],
        replyTo: "alex.rodriguez@movetcare.com",
        subject: `${options?.user ? `(User: #${options?.user}) - ` : ""}${type?.toUpperCase()} HOURS AUTOMATION STATUS UPDATED -  ${action?.toUpperCase()}`,
        message:
          '<p>No further action is required. This is just an alert to let you know the hours automation has run successfully.</p><p><a href="https://admin.movetcare.com/settings/manage-hours/" target="_blank">View Hours Automation Settings</a></p>',
      },
    });
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
            {
              type: "mrkdwn",
              text: "*USER:*",
            },
            {
              type: "plain_text",
              text: options?.user || "None",
            },
          ],
        },
      ],
    },
  });
  return true;
};
