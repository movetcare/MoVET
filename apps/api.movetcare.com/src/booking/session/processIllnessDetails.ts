import { admin, throwError } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { BookingError, Booking } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";
const DEBUG = false;
export const processIllnessDetails = async (
  id: string,
  illnessDetails: {
    symptoms: Array<any>;
    id: string;
    notes: string;
  }
): Promise<Booking | BookingError> => {
  const data = { id, illnessDetails };
  if (DEBUG) console.log("ILL PETS DATA", data);
  if (illnessDetails?.id) {
    const bookingRef = admin.firestore().collection("bookings").doc(id);
    const session = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
      });
    const newPatientsData: any = [];
    let nextPatient: null | string = null;
    session.patients.forEach(
      (patient: {
        gender: string;
        id: string;
        name: string;
        species: string;
        vcprRequired: boolean;
      }) => {
        if (patient?.id === illnessDetails?.id)
          newPatientsData.push({
            ...patient,
            illnessDetails: {
              symptoms: illnessDetails?.symptoms,
              notes: illnessDetails?.notes,
            },
          });
        else newPatientsData.push(patient);
      }
    );
    session.illPatientSelection.forEach((patientId: string, index: number) => {
      if (patientId === illnessDetails?.id)
        nextPatient = session.illPatientSelection[index + 1];
    });
    if (DEBUG) {
      console.log("newPatientsData", newPatientsData);
      console.log("nextPatient", nextPatient);
    }
    await bookingRef
      .set(
        {
          patients: newPatientsData,
          nextPatient,
          step: "illness-selection" as Booking["step"],
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(
          error,
          "UPDATE ILLNESS DETAILS FAILED"
        );
      });

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
                text: "ILLNESS SELECTION",
              },
              {
                type: "mrkdwn",
                text: "*ILLNESS DETAILS*",
              },
              {
                type: "plain_text",
                text: JSON.stringify(illnessDetails),
              },
            ],
          },
        ],
      },
    });
    return {
      ...session,
      patients: newPatientsData,
      nextPatient,
      id,
      client: {
        uid: session?.client?.uid,
        requiresInfo: session?.client?.requiresInfo,
      },
    };
  } else
    return await handleFailedBooking(data, "FAILED TO HANDLE ILLNESS DETAILS");
};
