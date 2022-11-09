import { admin, throwError } from "../config/config";
import { updateCustomField } from "../integrations/provet/entities/patient/updateCustomField";
import { logEvent } from "../utils/logging/logEvent";
import { moveFile } from "../utils/moveFile";
import { reverseDateStringMDY } from "../utils/reverseDateStringMDY";
import { createProVetPatient } from "./../integrations/provet/entities/patient/createProVetPatient";
const DEBUG = true;

export const addNewPatient = async (
  booking: string,
  client: string,
  patient: any
): Promise<boolean> => {
  if (DEBUG) {
    console.log("addNewPatient booking", booking);
    console.log("addNewPatient client", client);
    console.log("addNewPatient patient", patient);
  }
  const newPatientId = await createProVetPatient({
    client,
    name: patient?.name,
    species: patient?.type,
    gender: patient?.gender,
    breed: patient?.breed?.value,
    birthday: reverseDateStringMDY(patient?.birthday),
    weight: patient?.weight,
    notes: `${
      patient?.aggressionStatus?.name
        ? `${
            patient?.aggressionStatus?.name.includes("no history of aggression")
              ? ""
              : "BE CAREFUL - PATIENT IS AGGRESSIVE!"
          }\n\n`
        : ""
    }`,
    vcprRequired: true,
    spayedOrNeutered: patient?.spayedOrNeutered,
  });
  if (newPatientId) {
    if (patient?.aggressionStatus?.name)
      await updateCustomField(
        newPatientId,
        4,
        patient?.aggressionStatus?.name.includes("no history of aggression")
          ? "False"
          : "True"
      );
    if (patient?.notes)
      await updateCustomField(newPatientId, 6, patient?.notes);
    if (patient?.vet?.label)
      await updateCustomField(
        newPatientId,
        5,
        `${patient?.vet?.label}${
          patient?.vet?.value?.place_id
            ? ` - https://www.google.com/maps/place/?q=place_id:${patient?.vet?.value?.place_id}`
            : ""
        }`
      );
    if (patient?.photo) {
      await moveFile(
        `clients/${client}/patients/new/photo/${patient?.photo.name}`,
        `clients/${client}/patients/${newPatientId}/photo/${patient?.photo.name}`
      );
    }
    if (patient?.records) {
      await moveFile(
        `clients/${client}/patients/new/records/${patient?.records.name}`,
        `clients/${client}/patients/${newPatientId}/records/${patient?.records.name}`
      );
    }
  }
  // if (patient?.vet?.label)
  //   await request
  //     .post("/task/", {
  //       status: 1,
  //       task_type: 5,
  //       favourite: true,
  //       remind: 60,
  //       title: `Retrieve Medial Records for ${patient.name}`,
  //       text: `Please contact ${
  //         patient.name
  //       }'s previous vet and have them email their medical records to info@movetcare.com\n\n${
  //         patient?.vet?.label
  //           ? `Previous Vet: ${patient?.vet?.label}${
  //               patient?.vet?.value?.place_id
  //                 ? `- https://www.google.com/maps/place/?q=place_id:${patient?.vet?.value?.place_id}`
  //                 : ""
  //             }`
  //           : ""
  //       }`,
  //       client: `${proVetApiUrl}/client/${client}/`,
  //       patients: [`${proVetApiUrl}/patient/${newPatientId}/`],
  //       user: `${proVetApiUrl}/user/7/`,
  //       created_user: `${proVetApiUrl}/user/7/`,
  //       due: toIsoString(new Date()),
  //     })
  //     .then(async (response: any) => {
  //       if (DEBUG) console.log("API Response: POST /task/ => ", response.data);
  //     })
  //     .catch(async (error: any) => await throwError(error));

  if (newPatientId)
    return await admin
      .firestore()
      .collection("bookings")
      .doc(booking)
      .set(
        { step: "patient-selection", updatedOn: new Date() },
        { merge: true }
      )
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
