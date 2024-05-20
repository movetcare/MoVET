import type { ClinicBooking } from "../../types/booking";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
const DEBUG = false;
export const sendClinicBookingRequestAdminNotification = async (
  booking: ClinicBooking,
) => {
  const { id, createdAt, client, clinic, selectedPatients, requestedDateTime } =
    booking || {};
  const { email, firstName, lastName, phone } = client || {};
  if (DEBUG) console.log("NOT isExistingClient bookingRef vars: ", booking);
  const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
    ?.toDate()
    ?.toLocaleString("en-US", {
      timeZone: "America/Denver",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}</p>${
    firstName ? `<p><b>Client Name:</b> ${firstName} ${lastName}</p>` : ""
  }<p><b>Client Email:</b> ${email}</p>${
    phone
      ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
          phone?.replaceAll("+1", ""),
        )}</a></p>`
      : ""
  }
    ${selectedPatients ? `<p><b>Number of Pets:</b> ${selectedPatients.length}</p>` : ""}
  ${
    requestedDateTime?.date
      ? `<p><b>Requested Date:</b> ${new Date(
          requestedDateTime?.date,
        )?.toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>`
      : ""
  }${requestedDateTime?.time ? `<p><b>Requested Time:</b> ${requestedDateTime?.time}</p>` : ""}${
    requestedDateTime?.notes
      ? `<p><b>Notes::</b> "${requestedDateTime?.notes}"</p>`
      : ""
  }`;
  if (DEBUG)
    console.log("Sending ADMIN Appointment Request for New Client", message);
  const { isExistingClient } = client;
  if (!email?.toLowerCase()?.includes("+test") && !isExistingClient) {
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        replyTo: email,
        subject: `MoVET | Appointment Request from ${
          firstName && lastName ? firstName + " " + lastName : email
        }`,
        message,
      },
    });
    sendNotification({
      type: "slack",
      payload: {
        channel: "appointment-request",
        message: [
          {
            type: "section",
            text: {
              text: `:exclamation: New Appointment Request - ${id} :exclamation:`,
              type: "mrkdwn",
            },
            fields: [
              {
                type: "mrkdwn",
                text: "*Clinic*",
              },
              {
                type: "plain_text",
                text: clinic?.name,
              },
              {
                type: "mrkdwn",
                text: "*Client*",
              },
              {
                type: "plain_text",
                text:
                  firstName + " " + lastName + " - " + email + " - " + phone,
              },
              {
                type: "mrkdwn",
                text: "*Patients*",
              },
              {
                type: "plain_text",
                text: (selectedPatients && selectedPatients.length) || 0,
              },
              {
                type: "mrkdwn",
                text: "*Notes*",
              },
              {
                type: "plain_text",
                text: requestedDateTime?.notes,
              },
              {
                type: "mrkdwn",
                text: "*Requested Time & Date*",
              },
              {
                type: "plain_text",
                text: `${new Date(requestedDateTime?.date)?.toLocaleDateString(
                  "en-us",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )} - ${requestedDateTime?.time} `,
              },
            ],
          },
        ],
      },
    });
  }
};
