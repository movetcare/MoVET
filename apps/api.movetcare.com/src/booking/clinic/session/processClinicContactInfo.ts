import { DEBUG, admin, throwError } from "../../../config/config";
import { updateProVetClient } from "../../../integrations/provet/entities/client/updateProVetClient";
import { sendNotification } from "../../../notifications/sendNotification";
import type {
  ClinicBooking,
  BookingError,
  ClientBookingData,
  PatientBookingData,
} from "../../../types/booking";
import { getAllActivePatients } from "../../../utils/getAllActivePatients";
import { handleFailedBooking } from "../../session/handleFailedBooking";

export const processClinicContactInfo = async (
  id: ClinicBooking["id"],
  { firstName, lastName, phone, uid }: ClinicBooking["client"],
): Promise<ClinicBooking | BookingError> => {
  const data = { firstName, lastName, phone, uid, id };
  if (DEBUG) console.log("CONTACT INFO DATA", data);
  if (firstName && lastName && phone && uid) {
    await admin
      .firestore()
      .collection("clinic_bookings")
      .doc(id)
      .set(
        {
          client: {
            firstName,
            lastName,
            phone,
            uid,
            requiresInfo: false,
          } as ClientBookingData,
          step: "contact-info" as ClinicBooking["step"],
          updatedOn: new Date(),
        },
        { merge: true },
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "UPDATE CLIENT INFO FAILED");
      });
    const didUpdateProVetClient = await updateProVetClient({
      firstName: firstName || "UNKNOWN",
      lastName: lastName || "UNKNOWN",
      phone: phone || "UNKNOWN",
      id: uid,
    });
    if (DEBUG) console.log("didUpdateProVetClient", didUpdateProVetClient);
    const patients: Array<PatientBookingData> | BookingError | any =
      await getAllActivePatients(uid);
    if (patients && didUpdateProVetClient) {
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
        selectedPatients: null,
        requestedDateTime: null,
        step: "contact-info",
        clinic: await admin
          .firestore()
          .collection("clinic_bookings")
          .doc(id)
          .get()
          .then((doc: any) => doc.data()?.clinic)
          .catch(async (error: any) => throwError(error)),
        id,
        client: { uid, requiresInfo: false },
      };
    } else
      return await handleFailedBooking(data, "FAILED TO PROCESS CLIENT INFO");
  } else
    return await handleFailedBooking(data, "FAILED TO HANDLE CONTACT INFO");
};
