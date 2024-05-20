import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
import type { ClinicBooking } from "../../types/booking";
const DEBUG = false;
export const sendClinicBookingRequestClientNotification = async (
  booking: ClinicBooking,
) => {
  const { client, clinic, selectedPatients, requestedDateTime } = booking || {};
  const { email, firstName, lastName, phone } = client || {};
  const message = `<p>Hi ${firstName},</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request below and let us know (by replying to this email) if anything needs to be changed.</p>${
    firstName && lastName ? `<p><b>Name:</b> ${firstName} ${lastName}</p>` : ""
  }<p><b>Email:</b> ${email}</p>${
    phone
      ? `<p><b>Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
          phone?.replaceAll("+1", ""),
        )}</a></p>`
      : ""
  }
    ${selectedPatients ? `<p><b>Number of Pets:</b> ${selectedPatients?.length}</p>` : ""}
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
  }${requestedDateTime?.time ? `<p><b>Requested Time:</b> ${requestedDateTime?.time}</p>` : ""}${clinic?.name ? `<p><b>Reason:</b> ${clinic?.name}</p>` : ""}<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or chat with us via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
  if (DEBUG)
    console.log("Sending CLIENT Appointment Request for New Client", message);
  sendNotification({
    type: "email",
    payload: {
      client: client?.uid,
      to: email,
      replyTo: "info@movetcare.com",
      subject: "MoVET | We have received your appointment request!",
      message,
    },
  });
};
