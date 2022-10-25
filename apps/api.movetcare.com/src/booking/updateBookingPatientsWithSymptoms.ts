import {admin, throwError} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";

const DEBUG = false;
export const updateBookingPatientsWithSymptoms = async (
  id: string,
  allPatients: Array<any>,
  illnessDetails: any
) => {
  if (DEBUG) console.log("updateBookingPatientsWithIllness", illnessDetails);
  let nextPatient: string | null = null;
  const updatedPatients: any = [];
  allPatients.forEach((patient: any) => {
    if (illnessDetails.id === patient.value)
      updatedPatients.push({
        ...patient,
        illnessDetails: {
          symptoms: illnessDetails?.symptoms,
          notes: illnessDetails?.notes,
        },
      });
    else {
      updatedPatients.push(patient);

      if (patient?.illnessDetails === undefined && patient?.hasMinorIllness) {
        nextPatient = patient.value;
        console.log("HIT", patient.value);
      }
    }
  });
  if (DEBUG) {
    console.log("updatedPatients", updatedPatients);
    console.log("nextPatient", nextPatient);
  }
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        nextPatient,
        step: nextPatient ? "illness-assignment" : "choose-location",
        updatedOn: new Date(),
        patients: updatedPatients,
        illnessDetails: null,
      },
      {merge: true}
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY UPDATED BOOKING W/ PATIENT SYMPTOM DATA", {
          id,
          illnessDetails,
          updatedPatients,
        });
      return await logEvent({
        tag: "appointment-booking",
        origin: "api",
        success: true,
        sendToSlack: true,
        data: {
          id,
          status: "illness-assignment",
          updatedOn: new Date(),
          illnessDetails,
          updatedPatients,
          message: [
            {
              type: "section",
              text: {
                text: ":book: _Appointment Booking_ *UPDATE*",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Session ID*",
                },
                {
                  type: "plain_text",
                  text: id,
                },
                {
                  type: "mrkdwn",
                  text: "*Step*",
                },
                {
                  type: "plain_text",
                  text: "Illness Assignment",
                },
                {
                  type: "mrkdwn",
                  text: "*Selected Illness*",
                },
                {
                  type: "plain_text",
                  text: `${
                    updatedPatients && updatedPatients.length > 0
                      ? ` ${updatedPatients.map(
                          (patient: any) =>
                            `${patient.name}${
                              patient.illnessDetails
                                ? ` - ${JSON.stringify(patient.illnessDetails)}`
                                : ""
                            }`
                        )}`
                      : ""
                  }`,
                },
              ],
            },
          ],
        },
      });
    })
    .catch(async (error: any) => await throwError(error));
};
