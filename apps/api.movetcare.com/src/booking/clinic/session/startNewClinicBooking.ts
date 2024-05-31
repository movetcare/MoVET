import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, throwError, DEBUG } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import type {
  PatientBookingData,
  BookingError,
  ClinicBooking,
} from "../../../types/booking";
import { verifyClientDataExists } from "../../../utils/auth/verifyClientDataExists";
import { getAllActivePatients } from "../../../utils/getAllActivePatients";
import { createClinicBookingAbandonmentNotifications } from "../abandonment/createClinicBookingAbandonmentNotifications";

export const startNewClinicBooking = async (
  clinic: ClinicBooking["clinic"],
  client: UserRecord,
  device: any,
): Promise<any> => {
  const patients: Array<PatientBookingData> | BookingError | any =
    await getAllActivePatients(client?.uid);
  const requiresInfo = await verifyClientDataExists(client);
  const newBookingSession = await admin
    .firestore()
    .collection("clinic_bookings")
    .add({
      clinic,
      client: {
        uid: client?.uid,
        email: client?.email,
        firstName: client?.displayName?.trim()?.split(" ")[0],
        lastName: client?.displayName?.trim()?.split(" ")[1],
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
      `ADDING BOOKING ABANDONMENT AUTOMATION TASK TO QUEUE FOR ${newBookingSession?.id}`,
    );
  createClinicBookingAbandonmentNotifications(newBookingSession?.id);
  sendNotification({
    type: "slack",
    payload: {
      message: [
        {
          type: "section",
          text: {
            text: `:book: _Clinic Booking_ *STARTED* (${clinic?.name}:${newBookingSession?.id})`,
            type: "mrkdwn",
          },
          fields: [
            {
              type: "mrkdwn",
              text: "*DEVICE*",
            },
            {
              type: "plain_text",
              text: JSON.stringify(device) || "Unknown",
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
