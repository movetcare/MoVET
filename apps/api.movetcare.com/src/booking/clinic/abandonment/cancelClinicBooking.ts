import { DEBUG, admin, throwError } from "../../../config/config";
import { createProVetNote } from "../../../integrations/provet/entities/note/createProVetNote";
import { sendNotification } from "../../../notifications/sendNotification";
import type { ClinicBooking } from "../../../types/booking";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";
import { getYYMMDDFromString } from "../../../utils/getYYMMDDFromString";

export const cancelClinicBooking = (
  id: string,
  {
    client,
    createdAt,
    patients,
    clinic,
    requestedDateTime,
    step,
    selectedPatients,
  }: ClinicBooking,
) => {
  if (DEBUG)
    console.log("ARCHIVING CLINIC BOOKING DATA", {
      id,
    });
  admin
    .firestore()
    .collection("clinic_bookings")
    .doc(id)
    .set(
      {
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY ARCHIVED BOOKING", {
          id,
        });
      if (step === "cancelled-client") {
        let message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
          ?.toDate()
          ?.toString()}</p>`;
        let allPatients = "";
        if (Array.isArray(selectedPatients) && Array.isArray(patients))
          selectedPatients.forEach((selectedPatient: any) => {
            patients.map((patient: any) => {
              if (selectedPatient === patient?.id)
                allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${
                  patient?.name
                }</p><p><b>Species:</b> ${
                  patient?.species
                }</p><p><b>Gender:</b> ${patient?.gender}</p>${
                  patient?.illnessDetails
                    ? `<p><b>Minor Illness:</b> ${
                        patient?.illnessDetails
                          ? `${JSON.stringify(
                              patient?.illnessDetails?.symptoms,
                            )} - ${patient?.illnessDetails?.notes}`
                          : " None"
                      }</p>`
                    : ""
                }<p><b>-----------------------------------</b></p>`;
            });
          });

        if (client)
          message += `${
            client?.firstName && client?.lastName
              ? `<p><b>Name:</b> ${client?.firstName} ${client?.lastName}</p>`
              : ""
          }<p><b>Email:</b> ${client.email}</p>${
            client.phone
              ? `<p><b>Phone:</b> <a href="tel://${
                  client.phone
                }">${formatPhoneNumber(
                  client.phone?.replaceAll("+1", ""),
                )}</a></p>`
              : ""
          }${allPatients}
    <p><b>Reason:</b> ${clinic?.name}</p>
    ${
      requestedDateTime?.date
        ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
            requestedDateTime?.date,
          )}</p>`
        : ""
    }${
      requestedDateTime?.time
        ? `<p><b>Requested Time:</b> ${requestedDateTime?.time}</p>`
        : ""
    }<p></p><p></p><p>CANCELLATION REASON: NOT PROVIDED</p><p>CANCELLATION DETAILS: NOT PROVIDED</p>`;

        const subject = `${
          client?.firstName && client?.lastName
            ? `${client?.firstName} ${client?.lastName}`
            : client?.email
              ? client?.email
              : "Unknown Client"
        } has Cancelled their "${clinic?.name}" Clinic Booking Request`;

        const allPatientIds: any = [];
        if (Array.isArray(selectedPatients) && Array.isArray(patients))
          selectedPatients.forEach((selectedPatient: any) => {
            patients.map((patient: any) => {
              if (selectedPatient === patient?.id)
                allPatientIds.push(patient?.id || patient?.value);
            });
          });

        if (DEBUG)
          console.log("createProVetNote() =>", {
            type: 12,
            subject,
            message,
            client: `${client?.uid}`,
            patients: Array.isArray(selectedPatients) ? allPatientIds : [],
          });
        createProVetNote({
          type: 12,
          subject,
          message,
          client: `${client?.uid}`,
          patients: Array.isArray(selectedPatients) ? allPatientIds : [],
        });

        sendNotification({
          type: "slack",
          payload: {
            channel: "appointment-request",
            message: [
              {
                type: "section",
                text: {
                  text: `:book: _"${clinic?.name}" Clinic Booking_ *CANCELLED*`,
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
                    text: "CANCELLED BY CLIENT",
                  },
                  {
                    type: "mrkdwn",
                    text: "*Reason*",
                  },
                  {
                    type: "plain_text",
                    text: "Not Provided",
                  },
                ],
              },
            ],
          },
        });
      } else
        sendNotification({
          type: "slack",
          payload: {
            message: [
              {
                type: "section",
                text: {
                  text: `:book: _"${clinic?.name}" Clinic Booking_ *RESTARTED*`,
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
                    text: step,
                  },
                ],
              },
            ],
          },
        });
    })
    .catch((error: any) => throwError(error));
};
