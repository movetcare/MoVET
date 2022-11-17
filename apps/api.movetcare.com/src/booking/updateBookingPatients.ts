import { admin, throwError, DEBUG } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateBookingPatients = async (
  id: string,
  patients: Array<string>,
  vcprRequired: boolean
): Promise<void> => {
  if (DEBUG)
    console.log("UPDATING PATIENT BOOKING DATA", {
      id,
      patients,
      vcprRequired,
    });
  const fullPatientData = Array.isArray(patients)
    ? await Promise.all(
        patients.map(
          async (patient: string) =>
            await admin
              .firestore()
              .collection("patients")
              .doc(patient)
              .get()
              .then((doc: any) => {
                return {
                  name: doc.data().name,
                  value: `${doc.data().id}`,
                  vcprRequired: doc.data().vcprRequired,
                  gender: doc.data().gender,
                  species: doc.data().species,
                };
              })
              .catch((error: any) => throwError(error))
        )
      )
    : await admin
        .firestore()
        .collection("patients")
        .doc(patients)
        .get()
        .then((doc: any) => {
          return {
            name: doc.data().name,
            value: `${doc.data().id}`,
            vcprRequired: doc.data().vcprRequired,
            gender: doc.data().gender,
            species: doc.data().species,
          };
        })
        .catch((error: any) => throwError(error));
  if (DEBUG) console.log("fullPatientData", fullPatientData);

  admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        id,
        step:
          Array.isArray(fullPatientData) && vcprRequired
            ? "wellness-check"
            : fullPatientData?.vcprRequired
            ? "wellness-check"
            : "choose-location",
        updatedOn: new Date(),
        patients: Array.isArray(fullPatientData)
          ? fullPatientData
          : [fullPatientData],
      },
      { merge: true }
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY UPDATED BOOKING W/ PATIENT DATA", {
          id,
          patients,
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
                  text: "Patient Selection",
                },
                {
                  type: "mrkdwn",
                  text: "*Selected Patients*",
                },
                {
                  type: "plain_text",
                  text: `${
                    patients && fullPatientData.length > 0
                      ? `\nPatients: ${fullPatientData.map(
                          (patient: any) => patient.name
                        )}`
                      : ""
                  }`,
                },
                {
                  type: "mrkdwn",
                  text: "*VCPR Required*",
                },
                {
                  type: "plain_text",
                  text: vcprRequired ? "TRUE" : "FALSE",
                },
              ],
            },
          ],
        },
      });
    })
    .catch((error: any) => throwError(error));
};
