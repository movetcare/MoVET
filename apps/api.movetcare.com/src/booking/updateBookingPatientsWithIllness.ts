import { admin, throwError, DEBUG } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateBookingPatientsWithIllness = (
  id: string,
  allPatients: Array<any>,
  illPatients: Array<string>
) => {
  if (DEBUG) console.log("updateBookingPatientsWithIllness", illPatients);
  const updatedPatients: any = [];
  allPatients.forEach((patient: any) => {
    let didMarkPatientAsIll = false;
    illPatients.forEach((illPatient: string) => {
      if (illPatient === patient.value) {
        updatedPatients.push({ ...patient, hasMinorIllness: true });
        didMarkPatientAsIll = true;
      }
    });
    if (!didMarkPatientAsIll)
      updatedPatients.push({ ...patient, hasMinorIllness: false });
  });
  if (DEBUG) console.log("updatedPatients", updatedPatients);
  admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        step: illPatients.length > 0 ? "illness-assignment" : "choose-location",
        updatedOn: new Date(),
        patients: updatedPatients,
      },
      { merge: true }
    )
    .then(() => {
      if (DEBUG)
        console.log("SUCCESSFULLY UPDATED BOOKING W/ PATIENT ILLNESS DATA", {
          id,
          illPatients,
          updatedPatients,
        });
      sendNotification({
        type: "slack",
        payload: {
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
                  text: "Wellness Check",
                },
                {
                  type: "mrkdwn",
                  text: "*Selected Patients w/ Illness*",
                },
                {
                  type: "plain_text",
                  text: `${
                    updatedPatients && updatedPatients.length > 0
                      ? ` ${updatedPatients.map(
                          (patient: any) =>
                            `${patient.name}${
                              patient.hasMinorIllness
                                ? " - Has minor illness"
                                : ""
                            }`
                        )} `
                      : "Not Found?"
                  }`,
                },
              ],
            },
          ],
        },
      });
    })
    .catch((error: any) => throwError(error));
};
