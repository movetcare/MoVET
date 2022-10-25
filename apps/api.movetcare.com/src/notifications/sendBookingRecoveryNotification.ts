import {
  environment,
  emailClient,
  proVetApiUrl,
  throwError,
  admin,
  request,
  smsClient,
} from "../config/config";
import {sendSignInByEmailLink} from "../utils/auth/sendSignInByEmailLink";
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../utils/getClientNotificationSettings";
import {logEvent} from "../utils/logging/logEvent";

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
        return {id, ...doc.data()} as Booking;
      });
    switch (type) {
      case "1_HOUR":
        await sendOneHourBookingRecoveryNotification(booking);
        break;
      case "24_HOUR":
        await sendTwentyFourHourBookingRecoveryNotification(booking);
        break;
      case "72_HOUR":
        await sendSeventyTwoHourBookingRecoveryNotification(booking);
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
      "FAILED TO SEND BOOKING ABANDONMENT RECOVERY NOTIFICATION - MISSING \"ID\" AND/OR \"TYPE\"",
      {id, type}
    );
};

const sendOneHourBookingRecoveryNotification = async (booking: Booking) => {
  if (DEBUG)
    console.log("SENDING ONE HOUR BOOKING RECOVERY NOTIFICATION", booking);
  const {isActive, client, id} = booking;
  const {email, uid} = client;
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
    emailHtml += `<p>It looks like you haven't finished your appointment booking with MoVET.</p><p><b>Click on the link bellow to resume your appointment booking session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
    }</a></p>`;
    emailText += ` It looks like you have not finished your appointment booking with MoVET. Click on the link bellow to resume your appointment booking session: https://movetcare.com/booking/?email=${email}/`;
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      bcc: "info@movetcare.com",
      replyTo: "info@movetcare.com",
      subject: "Incomplete appointment booking with MoVET (1 HOUR)",
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
              const {data} = response;
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
              const {data} = response;
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
  const {isActive, client, id} = booking;
  const {email, uid} = client;
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
    emailHtml += `<p>It looks like you didn't finish booking your appointment with MoVET yesterday.</p><p><b>Click on the link bellow to resume your appointment booking session:</b></p><p><a href='${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
    }'>${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
    }</a></p>`;
    emailText += ` It looks like you didn't finish booking your appointment with MoVET yesterday. Click on the link bellow to resume your appointment booking session: https://movetcare.com/booking/?email=${email}`;
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      bcc: "info@movetcare.com",
      replyTo: "info@movetcare.com",
      subject: "Incomplete appointment booking with MoVET (24 HOUR)",
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
              const {data} = response;
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
              const {data} = response;
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
  const {isActive, client, id} = booking;
  const {uid, email} = client;
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
    smsMessage += `It looks like you haven't finished your appointment booking with MoVET from three days ago.\n\nTap the link bellow to resume your appointment booking session:\n\n${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
    }`;
    smsString += `It looks like you have not finished your appointment booking with MoVET from three days ago. Tap the link bellow to resume your appointment booking session:${
      authLink
        ? authLink
        : (environment.type === "production"
            ? "https://movetcare.com"
            : "http://localhost:3000") + `/booking/?email=${email}/`
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
                const {data} = response;
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
                const {data} = response;
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
