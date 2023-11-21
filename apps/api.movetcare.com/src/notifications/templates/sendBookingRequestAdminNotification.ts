import { admin, throwError } from "../../config/config";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
const DEBUG = false;
export const sendBookingRequestAdminNotification = async ({
  id,
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
  createdAt,
  trackingCode,
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
  trackingCode: string;
}) => {
  if (DEBUG)
    console.log("NOT isExistingClient bookingRef vars: ", {
      id,
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
      createdAt,
      trackingCode,
    });
  const { client }: any = await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("START bookingRef doc.data(): ", doc.data());
      return doc.data();
    })
    .catch((error: any) => throwError(error));
  const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
    ?.toDate()
    ?.toLocaleString("en-US", {
      timeZone: "America/Denver",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })}</p>${
    trackingCode ? `<p><b>Tracking Code:</b> ${trackingCode}</p>` : ""
  }${
    firstName ? `<p><b>Client Name:</b> ${firstName} ${lastName}</p>` : ""
  }<p><b>Client Email:</b> ${email}</p>${
    phone
      ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
          phone?.replaceAll("+1", ""),
        )}</a></p>`
      : ""
  }
    ${numberOfPets ? `<p><b>Number of Pets:</b> ${numberOfPets}</p>` : ""}
    ${
      numberOfPetsWithMinorIllness
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
                text:
                  numberOfPets +
                  ` Pet(s) (${numberOfPetsWithMinorIllness} w/ Minor Illness)`,
              },
              {
                type: "mrkdwn",
                text: "*Pet Notes*",
              },
              {
                type: "plain_text",
                text: notes?.length > 0 ? notes : "None",
              },
              {
                type: "mrkdwn",
                text: "*Location*",
              },
              {
                type: "plain_text",
                text: locationType,
              },
              {
                type: "mrkdwn",
                text: "*Requested Time & Date*",
              },
              {
                type: "plain_text",
                text: `${new Date(selectedDate)?.toLocaleDateString("en-us", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} - ${selectedTime} ${
                  specificTime ? `- ${specificTime}` : ""
                }`,
              },
            ],
          },
        ],
      },
    });
  }
};
