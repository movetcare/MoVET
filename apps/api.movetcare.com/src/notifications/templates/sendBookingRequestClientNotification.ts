import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
import { getAuthUserByEmail } from "../../utils/auth/getAuthUserByEmail";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
const DEBUG = false;
export const sendBookingRequestClientNotification = async ({
  locationType,
  notes,
  numberOfPets,
  numberOfPetsWithMinorIllness,
  selectedDate,
  selectedTime,
  specificTime,
  firstName,
  lastName,
  email,
  phone,
}: {
  id: string;
  locationType: "Home" | "Virtual" | "Clinic";
  notes: string;
  numberOfPets: number;
  numberOfPetsWithMinorIllness: number;
  selectedDate: string;
  selectedTime: string;
  specificTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: any;
}) => {
  const client: UserRecord | null = await getAuthUserByEmail(email);
  const message = `<p>Hi ${firstName},</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request below and let us know (by replying to this email) if anything needs to be changed.</p>${
    firstName && lastName ? `<p><b>Name:</b> ${firstName} ${lastName}</p>` : ""
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
      ? `<p><b>Requested Date:</b> ${new Date(selectedDate)?.toLocaleDateString(
          "en-us",
          {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )}</p>`
      : ""
  }${selectedTime ? `<p><b>Requested Time:</b> ${selectedTime}</p>` : ""}${
    selectedTime === "Specific Time Preference" && specificTime !== ""
      ? `<p><b>Specific Time Requested:</b> "${specificTime}"</p>`
      : ""
  }<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or chat with us via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
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
