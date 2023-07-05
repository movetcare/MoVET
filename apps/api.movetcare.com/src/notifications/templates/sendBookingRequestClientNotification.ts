import { admin, throwError } from "../../config/config";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
const DEBUG = true;
export const sendBookingRequestClientNotification = async ({
  id,
}: {
  id: string;
}) => {
  const { client }: any = await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
  const { email, isExistingClient } = client;
  if (!email?.toLowerCase()?.includes("+test") && !isExistingClient) {
    const {
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      email,
      firstName,
      lastName,
      phone,
    }: any = await admin
      .firestore()
      .collection("bookings")
      .doc(id)
      .get()
      .then((doc: any) => doc.data())
      .catch((error: any) => throwError(error));
    const message = `<p>Hi ${firstName},</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request below and let us know (by replying to this email) if anything needs to be changed.</p>${
      firstName && lastName
        ? `<p><b>Name:</b> ${firstName} ${lastName}</p>`
        : ""
    }<p><b>Email:</b> ${email}</p>${
      phone
        ? `<p><b>Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", ""),
          )}</a></p>`
        : ""
    }
    ${numberOfPets ? `<p><b>Number of Pets:</b> ${numberOfPets}</p>` : ""}
    ${
      numberOfPetsWithMinorIllness && numberOfPetsWithMinorIllness > 0
        ? `<p><b>Pets w/ Minor Illness:</b> ${numberOfPetsWithMinorIllness}</p>`
        : ""
    }
    ${notes && notes !== "" ? `<p><b>Pet Notes:</b> ${notes}</p>` : ""}
    ${locationType ? `<p><b>Requested Location:</b> ${locationType}</p>` : ""}
  ${
    selectedDate
      ? `<p><b>Requested Date:</b> ${new Date(
          selectedDate,
        ).toLocaleDateString()}</p>`
      : ""
  }${selectedTime ? `<p><b>Requested Time:</b> ${selectedTime}</p>` : ""}${
    selectedTime === "Specific Time Preference" && specificTime !== ""
      ? `<p><b>Specific Time Requested:</b> "${specificTime}"</p>`
      : ""
  }<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or "Ask a Question" via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
    if (DEBUG)
      console.log("Sending CLIENT Appointment Request for New Client", message);
    sendNotification({
      type: "email",
      payload: {
        client: client?.uid,
        to: email,
        // bcc: "alex.rodriguez@movetcare.com",
        replyTo: "info@movetcare.com",
        subject: "MoVET | We have received your appointment request!",
        message,
      },
    });
  }
};
