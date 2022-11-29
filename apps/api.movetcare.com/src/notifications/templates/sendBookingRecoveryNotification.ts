import { environment, admin, DEBUG } from "../../config/config";
import type { Booking } from "../../types/booking";
import type { EmailConfiguration } from "../../types/email.d";
import { sendSignInByEmailLink } from "../../utils/auth/sendSignInByEmailLink";
import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../utils/getClientNotificationSettings";
import { sendNotification } from "../sendNotification";

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
    switch (type) {
      case "1_HOUR":
        sendOneHourBookingRecoveryNotification(booking);
        sendAdminBookingRecoveryNotification(booking, type);
        break;
      case "24_HOUR":
        sendTwentyFourHourBookingRecoveryNotification(booking);
        sendAdminBookingRecoveryNotification(booking, type);
        break;
      case "72_HOUR":
        sendSeventyTwoHourBookingRecoveryNotification(booking);
        sendAdminBookingRecoveryNotification(booking, type);
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
  const {
    client,
    id,
    createdAt,
    patients,
    reason,
    requestedDateTime,
    location,
    address,
    step,
  }: any = booking;
  const { email, displayName, phoneNumber } = client;

  if (id && email)
    sendNotification({
      type: "email",
      payload: {
        client: client.uid,
        to: "info@movetcare.com",
        replyTo: email,
        subject: `${
          displayName ? displayName : email ? email : ""
        } abandoned their appointment booking request ${
          type === "24_HOUR"
            ? "yesterday"
            : type === "72_HOUR"
            ? "three days ago"
            : "one hour ago"
        } at step "${step}"`,
        message: `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
          ?.toDate()
          ?.toString()}</p>${
          displayName ? `<p><b>Client Name:</b> ${displayName}</p>` : ""
        }<p><b>Client Email:</b> ${email}</p>${
          phoneNumber ? `<p><b>Client Phone:</b> ${phoneNumber}</p>` : ""
        }${
          patients &&
          patients.map(
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
              }</p><p><b>Aggression Status:</b> "${
                patient?.aggressionStatus?.name
              }"</p><p><b>VCPR Required:</b> ${
                patient?.vcprRequired ? "Yes" : "No"
              }</p>`
          )
        }${reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""}${
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
            ? `<p><b>Location:</b> ${location} ${
                address ? `- ${address?.full} (${address?.info})` : ""
              }</p>`
            : ""
        }`,
      },
    });
};

const sendOneHourBookingRecoveryNotification = async (booking: Booking) => {
  if (DEBUG)
    console.log("SENDING ONE HOUR BOOKING RECOVERY NOTIFICATION", booking);
  const { isActive, client, id } = booking;
  const { email, uid } = client;
  if (isActive && id && email) {
    const authLink = await sendSignInByEmailLink({
      email,
      sendEmail: false,
      sessionId: id,
    });
    if (DEBUG)
      console.log(
        "sendOneHourBookingRecoveryNotification => authLink",
        authLink
      );
    let emailHtml = "";
    if (client?.displayName) emailHtml += `<p>Hey ${client?.displayName}!</p>`;
    else emailHtml += "<p>Hey there!</p>";

    emailHtml += `<p>It looks like you were in the process of submitting an appointment booking request with MoVET.</p><p><b>Click the button bellow to resume your session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }' style="border-radius: 40px; border: 2px solid rgb(255, 255, 255); display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 16px; font-weight: bold; font-style: normal; padding: 18px; text-decoration: none; min-width: 30px; background-color: #E76159; color: rgb(255, 255, 255); --darkreader-inline-border-top:#D1CCBD; --darkreader-inline-border-right:#D1CCBD; --darkreader-inline-border-bottom:#D1CCBD; --darkreader-inline-border-left:#D1CCBD; --darkreader-inline-bgcolor:#E76159; --darkreader-inline-color:#e8e6e3;">Complete Booking</a></p><p>At MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!</p><p>We look forward to seeing you soon!</p><p>The MoVET Team</p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Finish Booking Your Appointment!",
      message: emailHtml,
    };
    if (DEBUG)
      console.log("BOOKING RECOVERY NOTIFICATION EMAIL READY", emailConfig);
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(uid);
    if (userNotificationSettings && userNotificationSettings?.sendEmail) {
      sendNotification({
        type: "email",
        payload: { ...emailConfig, client: client.uid },
      });
    }
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND ONE HOUR BOOKING RECOVERY NOTIFICATION EMAIL",
      booking
    );
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
  const { email, uid } = client;
  if (isActive && id && email) {
    const authLink = await sendSignInByEmailLink({
      email,
      sendEmail: false,
      sessionId: id,
    });
    if (DEBUG)
      console.log(
        "sendTwentyFourHourBookingRecoveryNotification => authLink",
        authLink
      );
    let emailHtml = "";
    if (client?.displayName) emailHtml += `<p>Hey ${client?.displayName}!</p>`;
    else emailHtml += "<p>Hey there!</p>";

    emailHtml += `<p>It looks like you didn't finish booking your appointment with MoVET yesterday.</p><p><b>Click on the link bellow to resume your session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }' style="border-radius: 40px; border: 2px solid rgb(255, 255, 255); display: inline-block; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 16px; font-weight: bold; font-style: normal; padding: 18px; text-decoration: none; min-width: 30px; background-color: #E76159; color: rgb(255, 255, 255); --darkreader-inline-border-top:#D1CCBD; --darkreader-inline-border-right:#D1CCBD; --darkreader-inline-border-bottom:#D1CCBD; --darkreader-inline-border-left:#D1CCBD; --darkreader-inline-bgcolor:#E76159; --darkreader-inline-color:#e8e6e3;">Complete Booking</a></p><p><a href="${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/request-an-appointment/cancel?id=${id}/`
    }">Cancel Booking</a></p><p>At MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!</p><p>We look forward to seeing you soon!</p><p>The MoVET Team</p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Finish Booking Your Appointment!",
      message: emailHtml,
    };
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(uid);
    if (userNotificationSettings && userNotificationSettings?.sendEmail) {
      sendNotification({
        type: "email",
        payload: { ...emailConfig, client: client.uid },
      });
    }
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND TWENTY FOUR HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
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
  const { uid, email } = client;
  if (isActive && id && email) {
    const authLink = await sendSignInByEmailLink({
      email,
      sendEmail: false,
      sessionId: id,
    });
    if (DEBUG)
      console.log(
        "sendOneHourBookingRecoveryNotification => authLink",
        authLink
      );
    let smsMessage = "";
    if (client?.displayName) smsMessage += `Hey ${client?.displayName}!\n\n`;
    else smsMessage += "Hey there!\n\n";
    smsMessage += `It looks like you haven't finished your appointment booking request with MoVET from three days ago.\n\nTap the link bellow to resume your session:\n\n${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }\n\nOr, Cancel Appointment Request: ${
      (environment.type === "production"
        ? "https://app.movetcare.com"
        : environment.type === "staging"
        ? "https://stage.app.movetcare.com"
        : "http://localhost:3000") + `/request-an-appointment/cancel?id=${id}/`
    }\n\nAt MoVET @ Belleview Station, we're changing the way that pet care services are handled. Our experienced veterinarian offers primary pet care and minor illness treatment through telehealth, in-clinic, and house appointments. Our goal is to make your vet appointments an easier, stress-free experience for you and your pet! So if your pet needs an annual wellness checkup, vaccines, or dental care, we're there!\nWe look forward to seeing you soon!\nThe MoVET Team`;

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
