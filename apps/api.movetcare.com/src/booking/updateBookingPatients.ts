import {admin, throwError} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";
const DEBUG = false;
export const updateBookingPatients = async (
  id: string,
  patients: Array<string>,
  vcprRequired: boolean
): Promise<boolean> => {
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
              .catch(async (error: any) => await throwError(error))
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
        .catch(async (error: any) => await throwError(error));
  if (DEBUG) {
    console.log("fullPatientData", fullPatientData);
    // console.log('vcprRequired', vcprRequired);
  }
  return await admin
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
      {merge: true}
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY UPDATED BOOKING W/ PATIENT DATA", {
          id,
          patients,
        });
      return await logEvent({
        tag: "appointment-booking",
        origin: "api",
        success: true,
        sendToSlack: true,
        data: {
          id,
          status: "patient-selection",
          updatedOn: new Date(),
          patients,
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
    .catch(async (error: any) => await throwError(error));
};
