import {
  environment,
  emailClient,
  proVetApiUrl,
  throwError,
  admin,
  request,
  smsClient,
} from "../config/config";
import type { Booking } from "../types/booking";
import type { EmailConfiguration } from "../types/email";
import {sendSignInByEmailLink} from "../utils/auth/sendSignInByEmailLink";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../utils/getClientNotificationSettings";
import {logEvent} from "../utils/logging/logEvent";
import { sendNotification } from "./sendNotification";

const DEBUG = true;
export const sendBookingRecoveryNotification = async ({
  id,
  type,
}: {
  id: string;
  type: "1_HOUR" | "24_HOUR" | "72_HOUR";
}) => {
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
        await sendOneHourBookingRecoveryNotification(booking);
        break;
      case "24_HOUR":
        await sendTwentyFourHourBookingRecoveryNotification(booking);
        await sendAdminBookingRecoveryNotification(booking, type);
        break;
      case "72_HOUR":
        await sendSeventyTwoHourBookingRecoveryNotification(booking);
        await sendAdminBookingRecoveryNotification(booking, type);
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
    await sendNotification({
      type: "email",
      payload: {
        tag: "admin-booking-request-recovery",
        origin: "api",
        success: true,
        ...booking,
        to: "info@movetcare.com",
        bcc: "support@movetcare.com",
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
              }</p><p><b>Patient Minor Illness:</b>${
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
        updatedOn: new Date(),
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
    let emailText = "";
    if (client?.displayName) {
      emailHtml += `<p>Hey ${client?.displayName}!</p>`;
      emailText += `Hey ${client?.displayName}!`;
    } else {
      emailHtml += "<p>Hey there!</p>";
      emailText += "Hey there! ";
    }
    emailHtml += `<p>It looks like you haven't finished your appointment booking request with MoVET.</p><p><b>Click on the link bellow to resume your session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }</a></p>`;
    emailText += ` It looks like you have not finished your appointment booking request with MoVET. Click on the link bellow to resume your session: ${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }`;
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      replyTo: "info@movetcare.com",
      bcc: "support@movetcare.com",
      subject: "Incomplete appointment booking request with MoVET",
      text: emailText,
      html: emailHtml,
    };
    if (DEBUG)
      console.log("BOOKING RECOVERY NOTIFICATION EMAIL READY", emailConfig);
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(uid);
    if (
      environment?.type === "production" &&
      userNotificationSettings &&
      userNotificationSettings?.sendEmail
    )
      await emailClient
        .send(emailConfig)
        .then(async () => {
          if (DEBUG)
            console.log(
              "BOOKING RECOVERY NOTIFICATION EMAIL SENT!",
              emailConfig
            );
          await request
            .post("/note/", {
              title: "1 Hour Booking Abandonment Recovery Email Notification",
              type: 1,
              client: proVetApiUrl + `/client/${uid}/`,
              patients: [],
              note: emailText,
            })
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG) console.log("API Response: POST /note/ => ", data);
              await logEvent({
                tag: "1-hour-booking-abandonment-email",
                origin: "api",
                success: true,
                data: {
                  message:
                    "Synced 1 Hour Booking Abandonment Recovery Email Notification w/ ProVet",
                  ...emailConfig,
                },
                sendToSlack: true,
              });
            })
            .catch(async (error: any) => await throwError(error));
          await admin
            .firestore()
            .collection("clients")
            .doc(`${client}`)
            .collection("notifications")
            .add({
              type: "email",
              ...emailConfig,
              createdOn: new Date(),
            })
            .catch(async (error: any) => await throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) console.error(error?.response?.body?.errors);
          await request
            .post("/note/", {
              title:
                "FAILED TO SEND 1 Hour Booking Abandonment Recovery Email Notification",
              type: 1,
              client: proVetApiUrl + `/client/${uid}/`,
              patients: [],
              note: JSON.stringify(error),
            })
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG) console.log("API Response: POST /note/ => ", data);
              await logEvent({
                tag: "1-hour-booking-abandonment-email",
                origin: "api",
                success: false,
                data: {
                  message:
                    "FAILED TO SEND 1 Hour Booking Abandonment Recovery Email Notification",
                  ...emailConfig,
                  error,
                },
                sendToSlack: true,
              });
            })
            .catch(async (error: any) => await throwError(error));
          await throwError(error);
        });
    else
      console.log("SIMULATING BOOKING ABANDONMENT RECOVERY NOTIFICATION EMAIL");
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND ONE HOUR BOOKING RECOVERY NOTIFICATION",
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
    let emailText = "";
    if (client?.displayName) {
      emailHtml += `<p>Hey ${client?.displayName}!</p>`;
      emailText += `Hey ${client?.displayName}! `;
    } else {
      emailHtml += "<p>Hey there!</p>";
      emailText += "Hey there! ";
    }
    emailHtml += `<p>It looks like you didn't finish booking your appointment with MoVET yesterday.</p><p><b>Click on the link bellow to resume your session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }</a></p>`;
    emailText += ` It looks like you didn't finish booking your appointment with MoVET yesterday. Click on the link bellow to resume your session: https://app.movetcare.com/book-an-appointment/?email=${email}`;
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      bcc: "support@movetcare.com",
      replyTo: "info@movetcare.com",
      subject: "Incomplete appointment booking request with MoVET",
      text: emailText,
      html: emailHtml,
    };
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(uid);
    if (
      environment?.type === "production" &&
      userNotificationSettings &&
      userNotificationSettings?.sendEmail
    )
      await emailClient
        .send(emailConfig)
        .then(async () => {
          if (DEBUG)
            console.log(
              "BOOKING RECOVERY NOTIFICATION EMAIL SENT!",
              emailConfig
            );
          await request
            .post("/note/", {
              title: "24 Hour Booking Abandonment Recovery Email Notification",
              type: 1,
              client: proVetApiUrl + `/client/${uid}/`,
              patients: [],
              note: emailText,
            })
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG) console.log("API Response: POST /note/ => ", data);
              await logEvent({
                tag: "24-hour-booking-abandonment-email",
                origin: "api",
                success: true,
                data: {
                  message:
                    "Synced 24 Hour Booking Abandonment Recovery Email Notification w/ ProVet",
                  ...emailConfig,
                },
                sendToSlack: true,
              });
            })
            .catch(async (error: any) => await throwError(error));
          await admin
            .firestore()
            .collection("clients")
            .doc(`${client}`)
            .collection("notifications")
            .add({
              type: "email",
              ...emailConfig,
              createdOn: new Date(),
            })
            .catch(async (error: any) => await throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) console.error(error?.response?.body?.errors);
          await request
            .post("/note/", {
              title:
                "FAILED TO SEND 24 Hour Booking Abandonment Recovery Email Notification",
              type: 1,
              client: proVetApiUrl + `/client/${uid}/`,
              patients: [],
              note: JSON.stringify(error),
            })
            .then(async (response: any) => {
              const { data } = response;
              if (DEBUG) console.log("API Response: POST /note/ => ", data);
              await logEvent({
                tag: "24-hour-booking-abandonment-email",
                origin: "api",
                success: false,
                data: {
                  message:
                    "FAILED TO SEND 24 Hour Booking Abandonment Recovery Email Notification",
                  ...emailConfig,
                  error,
                },
                sendToSlack: true,
              });
            })
            .catch(async (error: any) => await throwError(error));
          await throwError(error);
        });
    else
      console.log("SIMULATING BOOKING ABANDONMENT RECOVERY NOTIFICATION EMAIL");
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
    let smsString = "";
    if (client?.displayName) {
      smsMessage += `Hey ${client?.displayName}!\n\n`;
      smsString += `Hey ${client?.displayName}!`;
    } else {
      smsMessage += "Hey there!\n\n";
      smsString += "Hey There!";
    }
    smsMessage += `It looks like you haven't finished your appointment booking request with MoVET from three days ago.\n\nTap the link bellow to resume your session:\n\n${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }`;
    smsString += `It looks like you have not finished your appointment booking request with MoVET from three days ago. Tap the link bellow to resume your session:${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://app.movetcare.com"
            : "http://localhost:3000") + `/book-an-appointment/?email=${email}/`
    }`;
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(uid);
    if (
      userNotificationSettings &&
      userNotificationSettings?.sendSms &&
      client?.phoneNumber
    ) {
      if (environment?.type === "production") {
        await smsClient.messages
          .create({
            body: smsMessage,
            from: "+17206775047",
            to: client?.phoneNumber,
          })
          .then(async () => {
            if (DEBUG)
              console.log("BOOKING RECOVERY NOTIFICATION SMS SENT!", {
                body: smsMessage,
                from: "+17206775047",
                to: client?.phoneNumber,
              });
            await request
              .post("/note/", {
                title: "72 Hour Booking Abandonment Recovery SMS Notification",
                type: 0,
                client: proVetApiUrl + `/client/${uid}/`,
                patients: [],
                note: smsString,
              })
              .then(async (response: any) => {
                const { data } = response;
                if (DEBUG) console.log("API Response: POST /note/ => ", data);
                await logEvent({
                  tag: "72-hour-booking-abandonment-sms",
                  origin: "api",
                  success: true,
                  data: {
                    message:
                      "Synced 72 Hour Booking Abandonment Recovery SMS Notification w/ ProVet",
                    body: smsMessage,
                    from: "+17206775047",
                    to: client?.phoneNumber,
                  },
                  sendToSlack: true,
                });
              })
              .catch(async (error: any) => await throwError(error));
          })
          .catch(async (error: any) => {
            console.error(error);
            if (DEBUG)
              console.log("SMS FAILED TO SEND!", {
                body: smsMessage,
                from: "+17206775047",
                to: client?.phoneNumber,
              });
            await request
              .post("/note/", {
                title:
                  "FAILED TO SEND 72 HOUR BOOKING ABANDONMENT RECOVERY NOTIFICATION SMS",
                type: 0,
                client: proVetApiUrl + `/client/${uid}/`,
                patients: [],
                note: JSON.stringify(error),
              })
              .then(async (response: any) => {
                const { data } = response;
                if (DEBUG) console.log("API Response: POST /note/ => ", data);
              })
              .catch(async (error: any) => await throwError(error));
            await logEvent({
              tag: "72-hour-booking-abandonment-sms",
              origin: "api",
              success: false,
              data: {
                message: `FAILED TO SEND 72 HOUR BOOKING ABANDONMENT RECOVERY NOTIFICATION SMS ${
                  error.message ? `: ${error.message}` : ""
                }`,
                body: smsMessage,
                from: "+17206775047",
                to: client?.phoneNumber,
              },
              sendToSlack: true,
            });
            await throwError(error);
          });
        await admin
          .firestore()
          .collection("clients")
          .doc(`${client}`)
          .collection("notifications")
          .add({
            type: "sms",
            body: smsMessage,
            from: "+17206775047",
            to: client?.phoneNumber,
            createdOn: new Date(),
          })
          .catch(async (error: any) => await throwError(error));
      } else
        console.log(
          "SIMULATING 72 HOUR BOOKING ABANDONMENT RECOVERY NOTIFICATION SMS"
        );
    } else if (DEBUG)
      console.log(
        "DID NOT SEND 72 HOUR BOOKING ABANDONMENT RECOVERY NOTIFICATION SMS",
        {
          sendSms:
            userNotificationSettings && userNotificationSettings?.sendSms,
          phoneNumber: client?.phoneNumber,
        }
      );
  } else if (DEBUG)
    console.log(
      "FAILED TO SEND SEVENTY TWO HOUR BOOKING RECOVERY NOTIFICATION",
      booking
    );
};
