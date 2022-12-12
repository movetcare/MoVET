import { admin, throwError, DEBUG } from "../config/config";
import { updateCustomField } from "../integrations/provet/entities/patient/updateCustomField";
import { sendNotification } from "../notifications/sendNotification";
import { moveFile } from "../utils/moveFile";
import { reverseDateStringMDY } from "../utils/reverseDateStringMDY";
import { createProVetPatient } from "./../integrations/provet/entities/patient/createProVetPatient";

export const addNewPatient = async (
  booking: string,
  client: string,
  patient: any
): Promise<void> => {
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
      updateCustomField(
        newPatientId,
        4,
        patient?.aggressionStatus?.name.includes("no history of aggression")
          ? "False"
          : "True"
      );
    if (patient?.notes) updateCustomField(newPatientId, 6, patient?.notes);
    if (patient?.vet?.label)
      updateCustomField(
        newPatientId,
        5,
        `${patient?.vet?.label}${
          patient?.vet?.value?.place_id
            ? ` - https://www.google.com/maps/place/?q=place_id:${patient?.vet?.value?.place_id}`
            : ""
        }`
      );
    if (patient?.photo) {
      moveFile(
        `clients/${client}/patients/new/photo/${patient?.photo.name}`,
        `clients/${client}/patients/${newPatientId}/photo/${patient?.photo.name}`
      );
    }
    if (patient?.records) {
      moveFile(
        `clients/${client}/patients/new/records/${patient?.records.name}`,
        `clients/${client}/patients/${newPatientId}/records/${patient?.records.name}`
      );
    }
  }

  if (newPatientId)
    admin
      .firestore()
      .collection("bookings")
      .doc(booking)
      .set(
        {
          step: "patient-selection",
          vcprRequired: true,
          updatedOn: new Date(),
        },
        { merge: true }
      )
      .then(() =>
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
                    text: `${
                      patient?.name ? `${patient?.name}` : "Not Found?"
                    }`,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Species*",
                  },
                  {
                    type: "plain_text",
                    text: `${
                      patient?.type ? `${patient?.type}` : "Not Found?"
                    }`,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Notes*",
                  },
                  {
                    type: "plain_text",
                    text: `${
                      patient?.notes ? `${patient?.notes}` : "None Provided"
                    }`,
                  },
                ],
              },
            ],
          },
        })
      )
      .catch((error: any) => throwError(error));
  else
    throwError({
      message: "FAILED TO CREATE NEW PATIENT IN PROVET",
    });
};
