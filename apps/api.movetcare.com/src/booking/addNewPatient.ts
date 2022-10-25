import {admin, proVetApiUrl, request, throwError} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";
import {reverseDateStringMDY} from "../utils/reverseDateStringMDY";
import {toIsoString} from "../utils/toIsoString";
import {createProVetPatient} from "./../integrations/provet/entities/patient/createProVetPatient";
const DEBUG = false;
export const addNewPatient = async (
  booking: string,
  client: string,
  patient: any
): Promise<boolean> => {
  if (DEBUG) {
    console.log("booking", booking);
    console.log("client", client);
    console.log("patient", patient);
  }
  const didCreateNewPatient = await createProVetPatient({
    client,
    name: patient?.name,
    species: patient?.type,
    gender: patient?.gender,
    breed: patient?.breed?.value,
    birthday: reverseDateStringMDY(patient?.birthday),
    weight: patient?.weight,
    notes: `${
      patient?.weight ? `Initial Weight: ${patient?.weight} lbs.\n\n` : ""
    }${patient?.notes ? `Client Comments: ${patient?.notes}\n\n` : ""}${
      patient?.vet?.label
        ? `Previous Vet: ${patient?.vet?.label}${
            patient?.vet?.value?.place_id
              ? `- https://www.google.com/maps/place/?q=place_id:${patient?.vet?.value?.place_id}`
              : ""
          }`
        : ""
    }`,
    vcprRequired: true,
    spayedOrNeutered: patient?.spayedOrNeutered,
  });
  if (patient?.vet?.label)
    await request
      .post("/task/", {
        status: 1,
        task_type: 5,
        favourite: true,
        remind: 60,
        title: `Retrieve Medial Records for ${patient.name}`,
        text: `Please contact ${
          patient.name
        }'s previous vet and have them email their medical records to info@movetcare.com\n\n${
          patient?.vet?.label
            ? `Previous Vet: ${patient?.vet?.label}${
                patient?.vet?.value?.place_id
                  ? `- https://www.google.com/maps/place/?q=place_id:${patient?.vet?.value?.place_id}`
                  : ""
              }`
            : ""
        }`,
        client: `${proVetApiUrl}/client/${client}/`,
        patients: [`${proVetApiUrl}/patient/${didCreateNewPatient}/`],
        user: `${proVetApiUrl}/user/7/`,
        created_user: `${proVetApiUrl}/user/7/`,
        due: toIsoString(new Date()),
      })
      .then(async (response: any) => {
        if (DEBUG) console.log("API Response: POST /task/ => ", response.data);
      })
      .catch(async (error: any) => await throwError(error));

  if (DEBUG) console.log("didCreateNewPatient", didCreateNewPatient);
  if (didCreateNewPatient)
    return await admin
      .firestore()
      .collection("bookings")
      .doc(booking)
      .set({step: "patient-selection", updatedOn: new Date()}, {merge: true})
      .then(
        async () =>
          await logEvent({
            tag: "appointment-booking",
            origin: "api",
            success: true,
            sendToSlack: true,
            data: {
              id: booking,
              status: "patient-selection",
              updatedOn: new Date(),
              patient: {
                client,
                name: patient?.name,
                species: patient?.type,
                gender: patient?.gender,
                breed: patient?.breed,
                birthday: reverseDateStringMDY(patient?.birthday),
                weight: patient?.weight,
                notes: patient?.notes,
                spayedOrNeutered: patient?.spayedOrNeutered,
              },
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
                      text: booking,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Step*",
                    },
                    {
                      type: "plain_text",
                      text: "Add Patient",
                    },
                    {
                      type: "mrkdwn",
                      text: "*Name*",
                    },
                    {
                      type: "plain_text",
                      text: `${patient?.name ? `${patient?.name}` : ""}`,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Notes*",
                    },
                    {
                      type: "plain_text",
                      text: `${patient?.notes ? `${patient?.notes}` : ""}`,
                    },
                  ],
                },
              ],
            },
          })
      )
      .catch(async (error: any) => await throwError(error));
  else
    return await throwError({
      message: "FAILED TO CREATE NEW PATIENT IN PROVET",
    });
};
