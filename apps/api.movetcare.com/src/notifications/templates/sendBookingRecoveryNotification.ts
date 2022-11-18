import { environment, admin, DEBUG } from "../../config/config";
import type { Booking } from "../../types/booking";
import type { EmailConfiguration } from "../../types/email.d";
import { sendSignInByEmailLink } from "../../utils/auth/sendSignInByEmailLink";
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
  type: "24_HOUR" | "72_HOUR"
) => {
  const {
    client,
    id,
    createdAt,
    patients,
    reason,
    requestedDateTime,
    vcprRequired,
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
        subject:
          type === "24_HOUR"
            ? `${
                displayName ? displayName : email ? email : ""
              } abandoned their appointment booking request yesterday at step "${step}"`
            : `${
                displayName ? displayName : email ? email : ""
              } abandoned their appointment booking request three days ago at step "${step}"`,
        message: `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
          ?.toDate()
          ?.toString()}</p>${
          displayName ? `<p><b>Client Name:</b> ${displayName}</p>` : ""
        }<p><b>Client Email:</b> ${email}</p>${
          phoneNumber ? `<p><b>Client Phone:</b> ${phoneNumber}</p>` : ""
        }${vcprRequired ? `<p><b>VCPR Required:</b> ${vcprRequired}</p>` : ""}${
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
                  ? `${JSON.stringify(patient?.illnessDetail?.symptoms)} - ${
                      patient?.illnessDetail?.notes
                    }`
                  : " NONE"
              }</p><p><b>Aggression Status:</b> ${
                patient?.aggressionStatus?.name.includes(
                  "no history of aggression"
                )
                  ? "NOT Aggressive"
                  : "AGGRESSIVE"
              }</p><p><b>VCPR Required:</b> ${
                patient?.vcprRequired ? "Yes" : "No"
              }</p>`
          )
        }${reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""}${
          requestedDateTime?.date
            ? `<p><b>Requested Date:</b> ${requestedDateTime.date.seconds}</p>`
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

    emailHtml += `<p>It looks like you haven't finished your appointment booking request with MoVET.</p><p><b>Click on the link bellow to resume your session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }</a></p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Incomplete appointment booking request with MoVET",
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
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : environment.type === "staging"
            ? "https://stage.app.movetcare.com"
            : "http://localhost:3000") +
          `/request-an-appointment/?email=${email}/`
    }</a></p>`;
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Incomplete appointment booking request with MoVET",
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
    }`;

    sendNotification({
      type: "sms",
      payload: {
        client: uid,
        subject: "Incomplete appointment booking request with MoVET",
        message: smsMessage,
      },
    });
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND SEVENTY TWO HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
};
