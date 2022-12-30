import { DEBUG } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
import { sendNotification } from "../../notifications/sendNotification";
import type { Booking } from "../../types/booking";
import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";

export const updateBookingCancellation = async (
  id: string,
  {
    client,
    createdAt,
    patients,
    reason,
    requestedDateTime,
    location,
    address,
    selectedStaff,
    cancelReason,
    cancelDetails,
  }: Booking
) => {
  if (cancelReason) {
    const message = `<p>CANCELLATION REASON: ${cancelReason}</p><p>CANCELLATION DETAILS: ${cancelDetails}</p><p></p><p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
      ?.toDate()
      ?.toString()}</p>${
      client?.displayName
        ? `<p><b>Client Name:</b> ${client?.displayName}</p>`
        : ""
    }<p><b>Client Email:</b> ${client?.email}</p>${
      client?.phone
        ? `<p><b>Client Phone:</b> <a href="tel://${
            client?.phone
          }">${formatPhoneNumber(client?.phone?.replaceAll("+1", ""))}</a></p>`
        : ""
    }${
      Array.isArray(patients)
        ? patients.map(
            (patient: any) =>
              `<p><b>Patient Name:</b> ${
                patient?.name
              }</p><p><b>Patient Species:</b> ${
                patient?.species
              }</p><p><b>Patient Gender:</b> ${
                patient?.gender
              }</p><p><b>Patient Minor Illness:</b> ${
                patient?.hasMinorIllness
                  ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
                      patient?.illnessDetails?.notes
                    }`
                  : " NONE"
              }</p>${
                patient.aggressionStatus
                  ? `<p><b>Aggression Status:</b> "${patient?.aggressionStatus?.name}"</p>`
                  : ""
              }${
                patient.vcprRequired
                  ? `<p><b>VCPR Required:</b> ${
                      patient?.vcprRequired ? "Yes" : "No"
                    }</p>`
                  : ""
              }`
          )
        : ""
    }
  ${reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""}${
      requestedDateTime?.date
        ? `<p><b>Requested Date:</b> ${formatDateToMMDDYY(
            requestedDateTime.date?.toDate()
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
    }`;

    const subject = `Appointment Booking Request Cancellation Reason Provided: "${cancelReason?.toUpperCase()}"`;
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        replyTo: client?.email,
        subject,
        message,
      },
    });
    if (DEBUG)
      console.log("createProVetNote() =>", {
        type: 1,
        subject,
        message,
        client: `${client?.uid}`,
        patients: Array.isArray(patients)
          ? patients.map((patient: { value: string }) => patient.value)
          : [],
      });

    createProVetNote({
      type: 4,
      subject,
      message,
      client: `${client?.uid}`,
      patients: Array.isArray(patients)
        ? patients.map((patient: { value: string }) => patient.value)
        : [],
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
