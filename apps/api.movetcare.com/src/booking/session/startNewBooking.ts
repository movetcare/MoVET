import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { PatientData, BookingError } from "../../types/booking";
import { createBookingAbandonmentNotifications } from "../abandonment/createBookingAbandonmentNotifications";
import { getAllActivePatients } from "./getAllActivePatients";
import { verifyClientInfo } from "./verifyClientInfo";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
const DEBUG = true;
export const startNewBooking = async (
  client: UserRecord,
  device: string
): Promise<any> => {
  const patients: Array<PatientData> | BookingError | any =
    await getAllActivePatients(client?.uid);
  const requiresInfo = await verifyClientInfo(client);
  const newBookingSession = await admin
    .firestore()
    .collection("bookings")
    .add({
      client: {
        uid: client?.uid,
        email: client?.email,
        displayName: client?.displayName,
        phone: client?.phoneNumber,
        requiresInfo,
      },
      patients,
      device,
      createdAt: new Date(),
      isActive: true,
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
            text: `:book: _Appointment Booking_ *STARTED* (${newBookingSession?.id})`,
            type: "mrkdwn",
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*DEVICE*",
            },
            {
              type: "plain_text",
              text: device || "Unknown",
            },
            {
              type: "mrkdwn",
              text: "*CLIENT ID*",
            },
            {
              type: "plain_text",
              text: client?.uid,
            },
            {
              type: "mrkdwn",
              text: "*EMAIL*",
            },
            {
              type: "plain_text",
              text: client?.email,
            },
            {
              type: "mrkdwn",
              text: "*REQUIRES CLIENT INFO*",
            },
            {
              type: "plain_text",
              text: requiresInfo ? "Yes" : "No",
            },
            {
              type: "mrkdwn",
              text: "*PATIENTS*",
            },
            {
              type: "plain_text",
              text: `${patients?.length}`,
            },
          ],
        },
      ],
    },
  });
  return newBookingSession;
};
