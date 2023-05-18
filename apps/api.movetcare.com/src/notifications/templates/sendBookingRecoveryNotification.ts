import { environment, admin } from "../../config/config";
import type { Booking } from "../../types/booking";
import type { EmailConfiguration } from "../../types/email.d";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../utils/getClientNotificationSettings";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";
import { sendNotification } from "../sendNotification";
const DEBUG = true;
export const sendBookingRecoveryNotification = async ({
  id,
  type,
}: {
  id: string;
  type: "1_HOUR" | "24_HOUR" | "72_HOUR";
}): Promise<void> => {
  if (id && type) {
    const booking = await admin
      .firestore()
      .collection("bookings")
      .doc(id)
      .get()
      .then((doc: any) => {
        return { id, ...doc.data() } as Booking;
      });
    if (!booking?.client?.email?.toLowerCase()?.includes("+test")) {
      switch (type) {
        case "1_HOUR":
          sendOneHourBookingRecoveryNotification(booking);
          sendAdminBookingRecoveryNotification(booking, type);
          break;
        case "24_HOUR":
          sendTwentyFourHourBookingRecoveryNotification(booking);
          break;
        case "72_HOUR":
          sendSeventyTwoHourBookingRecoveryNotification(booking);
          break;
        default:
          if (DEBUG)
            console.log(
              // eslint-disable-next-line quotes
              "FAILED TO SEND BOOKING ABANDONMENT RECOVERY NOTIFICATION - INCORRECT \"TYPE\" ( '1_HOUR' | '24_HOUR' | '72_HOUR')",
              type
            );
          break;
      }
    }
  } else if (DEBUG)
    console.log(
      // eslint-disable-next-line quotes
      'FAILED TO SEND BOOKING ABANDONMENT RECOVERY NOTIFICATION - MISSING "ID" AND/OR "TYPE"',
      { id, type }
    );
};

const sendAdminBookingRecoveryNotification = async (
  booking: Booking,
  type: "24_HOUR" | "72_HOUR" | "1_HOUR"
) => {
  const { client, id }: any = booking;
  const { email, displayName, phone, isExistingClient } = client;
  if (isExistingClient) {
    let allPatients = "";
    const {
      id,
      createdAt,
      patients,
      reason,
      requestedDateTime,
      location,
      address,
      selectedPatients,
      selectedStaff,
      step,
    }: any = booking;
    if (selectedPatients)
      selectedPatients?.forEach((selectedPatient: any) => {
        patients.map((patient: any) => {
          if (selectedPatient === patient?.id)
            allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${
              patient?.name
            }</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${
              patient?.gender
            }</p>${
              patient?.illnessDetails
                ? `<p><b>Minor Illness:</b> ${
                    patient?.illnessDetails
                      ? `${JSON.stringify(
                          patient?.illnessDetails?.symptoms
                        )} - ${patient?.illnessDetails?.notes}`
                      : " None"
                  }</p>`
                : ""
            }${
              patient.aggressionStatus
                ? `<p><b>Aggression Status:</b> "${
                    patient?.aggressionStatus
                      ? "IS AGGRESSIVE!"
                      : "Is not aggressive" ||
                        // eslint-disable-next-line quotes
                        'UNKNOWN - Update "Is Aggressive" custom field on patient\'s profile in ProVet!'
                  } "</p>`
                : ""
            }${
              patient.vcprRequired
                ? `<p><b>VCPR Required:</b> ${
                    patient?.vcprRequired ? "Yes" : "No"
                  }</p>`
                : ""
            }<p></p><p></p>`;
        });
      });

    const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
      ?.toDate()
      ?.toString()}</p><p><b>Last Step:</b> ${step}</p>${
      displayName
        ? `<p><b>Client Name:</b> ${getClientFirstNameFromDisplayName(
            displayName
          )}</p>`
        : ""
    }<p><b>Client Email:</b> ${email}</p>${
      phone
        ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }${
      Array.isArray(patients) && Array.isArray(selectedPatients)
        ? allPatients
        : ""
    }
  ${
    reason
      ? `<p><b>Reason:</b> ${reason.label}</p>`
      : "<p><b>Reason:</b> Establish Care Exam</p>"
  }${
      requestedDateTime?.date
        ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
            requestedDateTime.date
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

    if (id && email)
      sendNotification({
        type: "email",
        payload: {
          to: "info@movetcare.com",
          replyTo: email,
          bcc: "alex.rodriguez@movetcare.com",
          subject: `${
            displayName ? displayName : email ? email : ""
          } abandoned their appointment booking request on step "${step}" ${
            type === "24_HOUR"
              ? "yesterday"
              : type === "72_HOUR"
              ? "three days ago"
              : "one hour ago"
          }`,
          message,
        },
      });
  } else {
    const {
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      createdAt,
      firstName,
      lastName,
      phone,
      email,
    }: any = booking;
    const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
      ?.toDate()
      ?.toString()}</p>${
      firstName ? `<p><b>Client Name:</b> ${firstName} ${lastName}</p>` : ""
    }<p><b>Client Email:</b> ${email}</p>${
      phone
        ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", "")
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
      ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
          new Date(selectedDate)?.toString()
        )}</p>`
      : ""
  }${selectedTime ? `<p><b>Requested Time:</b> ${selectedTime}</p>` : ""}${
      selectedTime === "Specific Time Preference" && specificTime !== ""
        ? `<p><b>Specific Time Requested:</b> ${specificTime}</p>`
        : ""
    }`;
    if (id && email)
      sendNotification({
        type: "email",
        payload: {
          to: "info@movetcare.com",
          replyTo: email,
          bcc: "alex.rodriguez@movetcare.com",
          subject: `${
            displayName ? displayName : email ? email : ""
          } abandoned their appointment booking request" ${
            type === "24_HOUR"
              ? "yesterday"
              : type === "72_HOUR"
              ? "three days ago"
              : "one hour ago"
          }`,
          message,
        },
      });
  }
};

const sendOneHourBookingRecoveryNotification = async (booking: Booking) => {
  if (DEBUG)
    console.log("SENDING ONE HOUR BOOKING RECOVERY NOTIFICATION", booking);
  const { isActive, client, id } = booking;
  const { email, uid } = client || {};
  if (isActive && id && email) {
    // const authLink = await sendSignInByEmailLink({
    //   email,
    //   sendEmail: false,
    //   sessionId: id,
    // });
    // if (DEBUG)
    //   console.log(
    //     "sendOneHourBookingRecoveryNotification => authLink",
    //     authLink
    //   );
    let emailHtml = "";
    if (client?.firstName) emailHtml += `<p>Hey ${client?.firstName}!</p>`;
    else emailHtml += "<p>Hey there!</p>";

    emailHtml += `<p>It looks like you were in the process of submitting an appointment booking request with MoVET.</p><p><b>Click the link below to resume your session:</b></p><p><a href='${
      // authLink
      //   ? authLink
      //   :
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/?email=${email}`
    }' >Complete Booking</a></p><p>At MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!</p><p>We look forward to seeing you soon!</p><p>The MoVET Team</p><p></p><p><a href="${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/cancel?id=${id}`
    }">Cancel Booking</a></p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Finish Booking Your Appointment!",
      message: emailHtml,
    };
    if (DEBUG)
      console.log("BOOKING RECOVERY NOTIFICATION EMAIL READY", emailConfig);
    if (client && uid) {
      const userNotificationSettings: UserNotificationSettings | false =
        await getClientNotificationSettings(uid);
      if (userNotificationSettings && userNotificationSettings?.sendEmail) {
        sendNotification({
          type: "email",
          payload: {
            ...emailConfig,
            bcc: "alex.rodriguez@movetcare.com",
            client: client.uid,
          },
        });
      }
    } else if (DEBUG)
      console.log(
        "FAILED TO SEND ONE HOUR BOOKING RECOVERY NOTIFICATION EMAIL",
        booking
      );
  }
};

const sendTwentyFourHourBookingRecoveryNotification = async (
  booking: Booking
) => {
  if (DEBUG)
    console.log(
      "SENDING TWENTY FOUR HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
  const { isActive, client, id } = booking;
  const { email, uid } = client || {};
  if (isActive && id && email) {
    // const authLink = await sendSignInByEmailLink({
    //   email,
    //   sendEmail: false,
    //   sessionId: id,
    // });
    // if (DEBUG)
    //   console.log(
    //     "sendTwentyFourHourBookingRecoveryNotification => authLink",
    //     authLink
    //   );
    let emailHtml = "";
    if (client?.firstName) emailHtml += `<p>Hey ${client?.firstName}!</p>`;
    else emailHtml += "<p>Hey there!</p>";

    emailHtml += `<p>It looks like you didn't finish booking your appointment with MoVET yesterday.</p><p><b>Click on the link below to resume your session:</b></p><p><a href='${
      // authLink
      //   ? authLink
      //   :
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/?email=${email}`
    }' >Complete Booking</a></p><p>At MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!</p><p>We look forward to seeing you soon!</p><p>The MoVET Team</p><p></p><p><a href="${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/cancel?id=${id}`
    }">Cancel Booking</a></p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Finish Booking Your Appointment!",
      message: emailHtml,
    };
    if (client && uid) {
      const userNotificationSettings: UserNotificationSettings | false =
        await getClientNotificationSettings(uid);
      if (userNotificationSettings && userNotificationSettings?.sendEmail) {
        sendNotification({
          type: "email",
          payload: {
            ...emailConfig,
            bcc: "alex.rodriguez@movetcare.com",
            client: client.uid,
          },
        });
      }
    } else if (DEBUG)
      console.log(
        "FAILED TO SEND TWENTY FOUR HOUR BOOKING RECOVERY NOTIFICATION",
        booking
      );
  }
};

const sendSeventyTwoHourBookingRecoveryNotification = async (
  booking: Booking
) => {
  if (DEBUG)
    console.log(
      "SENDING SEVENTY TWO HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
  const { isActive, client, id } = booking;
  const { uid, email } = client || {};
  if (isActive && id && email) {
    // const authLink = await sendSignInByEmailLink({
    //   email,
    //   sendEmail: false,
    //   sessionId: id,
    // });
    // if (DEBUG)
    //   console.log(
    //     "sendOneHourBookingRecoveryNotification => authLink",
    //     authLink
    //   );
    let smsMessage = "";
    if (client?.firstName) smsMessage += `Hey ${client?.firstName}!\n\n`;
    else smsMessage += "Hey there!\n\n";
    smsMessage += `It looks like you haven't finished your appointment booking request with MoVET from three days ago.\n\nTap the link below to resume your session:\n\n${
      // authLink
      //   ? authLink
      //   :
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/?email=${email}`
    }\n\nAt MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!\nWe look forward to seeing you soon!\nThe MoVET Team\n\nCancel Booking: ${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/schedule-an-appointment/cancel?id=${id}`
    }`;

    sendNotification({
      type: "sms",
      payload: {
        client: uid,
        subject: "Finish Booking Your Appointment!",
        message: smsMessage,
      },
    });
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND SEVENTY TWO HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
};
