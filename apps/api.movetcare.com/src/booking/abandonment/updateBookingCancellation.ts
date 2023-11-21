import { DEBUG } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
import { sendNotification } from "../../notifications/sendNotification";
import type { Booking } from "../../types/booking";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";

export const updateBookingCancellation = async (
  id: string,
  {
    client,
    patients,
    reason,
    requestedDateTime,
    location,
    address,
    selectedStaff,
    cancelReason,
    cancelDetails,
    selectedPatients,
  }: Booking,
) => {
  if (cancelReason) {
    let message = `<p>CANCELLATION REASON: ${cancelReason}</p><p>CANCELLATION DETAILS: ${
      cancelDetails ? cancelDetails : "None Provided (Yet)"
    }</p><p></p><p><b>Session ID:</b> ${id}</p>`;
    let allPatients = "";
    if (Array.isArray(selectedPatients) && Array.isArray(patients))
      selectedPatients.forEach((selectedPatient: any) => {
        patients.map((patient: any) => {
          if (selectedPatient === patient?.id)
            allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${patient?.name}</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${patient?.gender}</p>${
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
            }">${formatPhoneNumber(client.phone?.replaceAll("+1", ""))}</a></p>`
          : ""
      }${allPatients}
    ${
      reason
        ? `<p><b>Reason:</b> ${reason.label}</p>`
        : "<p><b>Reason:</b> Establish Care Exam</p>"
    }
    ${
      requestedDateTime?.date
        ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
            requestedDateTime.date,
          )}</p>`
        : ""
    }${
      requestedDateTime?.time
        ? `<p><b>Requested Time:</b> ${requestedDateTime.time}</p>`
        : ""
    }${
      location
        ? `<p><b>Requested Location:</b> ${location} ${
            address ? `- ${address?.full} (${address?.info})` : ""
          }</p>`
        : ""
    }${
      selectedStaff
        ? `<p><b>Requested Expert:</b> ${selectedStaff?.title} ${selectedStaff?.firstName} ${selectedStaff?.lastName}</p>`
        : ""
    }<p></p><p>We look forward to seeing you soon!</p><p>- The MoVET Team</p>`;

    const subject = `Appointment Booking Request Cancellation Reason Provided: "${cancelReason?.toUpperCase()}"`;
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        bcc: "alex.rodriguez@movetcare.com",
        replyTo: client?.email,
        subject,
        message,
      },
    });

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
        type: 1,
        subject,
        message,
        client: `${client?.uid}`,
        patients: Array.isArray(selectedPatients) ? allPatientIds : [],
      });

    createProVetNote({
      type: 4,
      subject,
      message,
      client: `${client?.uid}`,
      patients: Array.isArray(selectedPatients) ? allPatientIds : [],
    });
  }
  sendNotification({
    type: "slack",
    payload: {
      channel: "appointment-request",
      message: [
        {
          type: "section",
          text: {
            text: ":book: _Appointment Booking_ *CANCELLED*",
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
              text: `${
                cancelDetails
                  ? `${cancelReason} - ${cancelDetails}`
                  : cancelReason
              }`,
            },
          ],
        },
      ],
    },
  });
};
