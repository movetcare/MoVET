import { admin, throwError, DEBUG } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { createBookingAbandonmentNotifications } from "./abandonment/createBookingAbandonmentNotifications";

export const startNewBooking = async (
  client: any,
  device: string
): Promise<any> => {
  const newBookingSession = await admin
    .firestore()
    .collection("bookings")
    .add({
      client: {
        uid: client?.uid,
        email: client?.email,
        displayName: client?.displayName,
        phoneNumber: client?.phoneNumber,
      },
      device,
      createdAt: new Date(),
      isActive: true,
      step: "started",
    })
    .catch((error: any) => throwError(error));
  if (DEBUG)
    console.log(
      `ADDING BOOKING ABANDONMENT AUTOMATION TASK TO QUEUE FOR ${newBookingSession?.id}`
    );
  createBookingAbandonmentNotifications(newBookingSession?.id);
  sendNotification({
    type: "slack",
    payload: {
      message: [
        {
          type: "section",
          text: {
            text: ":book: _Appointment Booking_ *STARTED*",
            type: "mrkdwn",
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*Session ID*",
            },
            {
              type: "plain_text",
              text: newBookingSession?.id,
            },
            {
              type: "mrkdwn",
              text: "*Step*",
            },
            {
              type: "plain_text",
              text: "Start Booking",
            },
            {
              type: "mrkdwn",
              text: "*Client*",
            },
            {
              type: "plain_text",
              text: `${client?.uid ? `ID: ${client?.uid}\n\n` : ""}${
                client?.email ? ` - Email: ${client?.email}\n\n` : ""
              }${
                client?.displayName ? ` - Name: ${client?.displayName}\n\n` : ""
              }${
                client?.phoneNumber
                  ? ` -  Phone: ${client?.phoneNumber}\n\n`
                  : ""
              }`,
            },
            {
              type: "mrkdwn",
              text: "*Device*",
            },
            {
              type: "plain_text",
              text: JSON.stringify(device) || "Unknown",
            },
          ],
        },
      ],
    },
  });
  return newBookingSession;
};
