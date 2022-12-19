import { admin, DEBUG, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type {
  BookingError,
  ClientInfo,
  BookingResponse,
  PatientData,
} from "../../types/booking";
import { getAllActivePatients } from "./getAllActivePatients";
import { handleFailedBooking } from "./handleFailedBooking";

export const processContactInfo = async (
  id: string,
  { firstName, lastName, phone, uid, requiresInfo }: ClientInfo
): Promise<BookingResponse | BookingError> => {
  const data = { firstName, lastName, phone, uid, requiresInfo, id };
  if (DEBUG) console.log("CONTACT INFO DATA", data);
  if (firstName && lastName && phone && uid && requiresInfo) {
    await admin
      .firestore()
      .collection("bookings")
      .doc(id)
      .set(
        {
          client: {
            firstName,
            lastName,
            phone,
            uid,
            requiresInfo: false,
          } as ClientInfo,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE CLIENT INFO FAILED");
      });
    const patients: Array<PatientData> | BookingError | any =
      await getAllActivePatients(uid);
    if (patients) {
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: `:book: _Appointment Booking_ *UPDATED* (${id})`,
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*STEP*",
                },
                {
                  type: "plain_text",
                  text: "CONTACT INFO",
                },
                {
                  type: "mrkdwn",
                  text: "*FIRST NAME*",
                },
                {
                  type: "plain_text",
                  text: firstName,
                },
                {
                  type: "mrkdwn",
                  text: "*LAST NAME*",
                },
                {
                  type: "plain_text",
                  text: lastName,
                },
                {
                  type: "mrkdwn",
                  text: "*PHONE*",
                },
                {
                  type: "plain_text",
                  text: phone,
                },
              ],
            },
          ],
        },
      });
      return {
        patients,
        id,
        client: { uid, requiresInfo: false },
      };
    } else
      return await handleFailedBooking(data, "FAILED TO PROCESS CLIENT INFO");
  } else
    return await handleFailedBooking(data, "FAILED TO HANDLE CONTACT INFO");
};
