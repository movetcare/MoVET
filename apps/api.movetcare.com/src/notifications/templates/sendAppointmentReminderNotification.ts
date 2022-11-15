/* eslint-disable quotes */
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { getAuthUserById } from "../../utils/auth/getAuthUserById";
import {
  admin,
  emailClient,
  environment,
  throwError,
  functions,
  // DEBUG,
} from "../../config/config";
const sms = require("twilio")(
  functions.config()?.twilio.account_sid,
  functions.config()?.twilio.auth_token
);
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../utils/getClientNotificationSettings";
import { getDateStringFromDate } from "../../utils/getDateStringFromDate";
import { getCustomerId } from "../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import type { EmailConfiguration } from "../../types/email";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
import { sendNotification } from "../sendNotification";
const DEBUG = false;
interface AppointmentDetails {
  active: boolean;
  id: number;
  client: number;
  send30MinReminder: boolean;
  send24HourReminder: boolean;
  user: 7 | 8 | 9; // 7 = Clinic, 8 = Mobile, 9 = Virtual
  start: any;
  instructions: string;
  telemedicineUrl?: string;
  patients: Array<{
    gender: string;
    id: number;
    minorIllness: string;
    name: string;
    species: string;
  }>;
  reason: string;
}

interface UserDetails {
  email: string;
  phoneNumber: string;
  displayName: string;
}

export const sendAppointmentReminderNotification = async (
  appointmentDetails: AppointmentDetails
) => {
  const {
    active,
    send24HourReminder,
    send30MinReminder,
    client,
    start,
    patients,
  } = appointmentDetails;
  if (DEBUG) {
    console.log("appointmentDetails", appointmentDetails);
    console.log("start", start?.toDate());
    console.log("start.toDate() > new Date()", start?.toDate() > new Date());
    console.log("active", active);
  }
  if (active && start?.toDate() > new Date()) {
    const userDetails: UserDetails = await getAuthUserById(`${client}`, [
      "email",
      "phoneNumber",
      "displayName",
    ]);
    const customerId = await getCustomerId(`${client}`);
    let doesHaveValidPaymentOnFile: false | Array<any> = false;
    if (customerId)
      doesHaveValidPaymentOnFile = await verifyValidPaymentSource(
        `${client}`,
        customerId
      );
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(`${client}`);
    const clientProvetRecord = await fetchEntity("client", client);
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`
          )
        : patients[0].name;
    if (DEBUG) {
      console.log("clientProvetRecord", clientProvetRecord);
      console.log("petNames -> ", petNames);
      console.log("send24HourReminder", send24HourReminder);
      console.log("send30MinReminder", send30MinReminder);
    }
    if (send24HourReminder)
      await send24HourAppointmentNotification(
        appointmentDetails,
        userDetails,
        userNotificationSettings,
        doesHaveValidPaymentOnFile,
        clientProvetRecord,
        petNames
      );
    if (send30MinReminder)
      await send30MinAppointmentNotification(
        appointmentDetails,
        userDetails,
        userNotificationSettings,
        doesHaveValidPaymentOnFile,
        clientProvetRecord,
        petNames
      );
  } else {
    if (DEBUG)
      console.log(
        `${
          appointmentDetails?.active
            ? "Appointment Archived"
            : appointmentDetails?.start.toDate() < new Date()
            ? "Appointment Passed"
            : "UNKNOWN APPOINTMENT ISSUE"
        } - DID NOT send appointment reminder...`,
        appointmentDetails
      );
    sendNotification({
      type: "slack",
      payload: {
        message: `:x: ${
          appointmentDetails?.active
            ? "Appointment Archived"
            : appointmentDetails?.start.toDate() < new Date()
            ? "Appointment Passed"
            : "UNKNOWN APPOINTMENT ISSUE"
        } - DID NOT send appointment reminder...`,
      },
    });
  }
};

const send24HourAppointmentNotification = async (
  appointmentDetails: AppointmentDetails,
  userDetails: UserDetails,
  userNotificationSettings: UserNotificationSettings | false,
  doesHaveValidPaymentOnFile: false | Array<any>,
  clientProvetRecord: any,
  petNames: string | Array<string>
) => {
  const { id, client, user, start, instructions, patients, reason } =
    appointmentDetails;
  const reasonName = reason ? await getReasonName(reason) : null;
  if (DEBUG)
    console.log("APPOINTMENT DETAILS", {
      id,
      client,
      user,
      start,
      instructions,
      patients,
      reason,
      reasonName,
      doesHaveValidPaymentOnFile,
    });

  const { email, phoneNumber, displayName } = userDetails;
  if (DEBUG) console.log("USER DATA", { email, phoneNumber, displayName });
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendEmail &&
    email
  ) {
    const emailText = `${
      displayName ? `<p>Hi ${displayName},</p>` : "<p>Hey there!</p>"
    }<p>This email contains important information about your upcoming appointment with MoVET.</p>${
      user
        ? `<p><b>Location: </b>${
            user === 8
              ? `Housecall - ${
                  clientProvetRecord?.street_address || "STREET UNKNOWN"
                } ${clientProvetRecord?.city || "CITY UNKNOWN"}, ${
                  clientProvetRecord?.state || "STATE UNKNOWN"
                } ${clientProvetRecord?.zip_code || "ZIPCODE UNKNOWN"}`
              : user === 7
              ? 'MoVET Clinic @ Belleview Station (<a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a>)'
              : user === 9
              ? "Virtual - We'll email you a link when it's time for your consultation"
              : 'UNKNOWN - Please reply to this email ASAP with the appointment location - "Housecall", "MoVET Clinic @ Belleview Station", "Virtual Consultation"'
          }</p>`
        : ""
    }<p><b>Time: </b>${getDateStringFromDate(start?.toDate())}</p><p><b>Pet${
      patients.length > 1 ? "s" : ""
    }: </b>${petNames}</p>${
      reasonName !== null ? `<p><b>Reason: </b>${reasonName}</p>` : ""
    }${
      instructions
        ? `<p><b>Instructions: </b>${instructions}</p>`
        : '<p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
    }<p></p><p><b>*** KEEP READING ***</b></p><p></p>${
      doesHaveValidPaymentOnFile !== false &&
      doesHaveValidPaymentOnFile.length > 0
        ? ""
        : user === 8
        ? `<p><b>Payment on File:</b><b> Our records indicate that you do not have a form of payment on file. We must have a form of payment on file prior to your appointment: <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B"
          )}`}" target="_blank">Add a Form of Payment</a></b></p>`
        : `<p><b>Our records indicate that you do not have a form of payment on file -> <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B"
          )}`}" target="_blank">Add a Form of Payment</a></b></p>`
    }<p><b> Handling Tips for your Pet${
      patients.length > 1 ? "s" : ""
    }:</b> Pets can get nervous and anxious about visiting the 
veterinarian. We want to prevent any nervous behaviors that can later create fearful or even 
aggressive behaviors. Once this happens, veterinary visits can become very unpleasant for both
owner and pet that we often resign to just not taking them to the vet's office at all anymore.</p><p>Please let us know in advance of any favorite treat, scratching spot, or any behavioral 
issues you may have encountered with your pet previously. Are they food motivated, territorial, 
or aggressive towards humans or other pets? Anything that would make your pet more 
comfortable with us for their visit would be great! We can offer anti-anxiety medications ahead of
appointments for some patients that might need a little help relaxing around us.</p><p><i>Please reply to this email <b>before your appointment</b> should 
you feel your pet(s) needs more options, such as anxiolytics and / or supplements to continue to 
make your pet's visit more comfortable. We thank you in advance for keeping our staff safe!</i></p><p><b>COVID-19 Waiver:</b> By attending this appointment, you are confirming that, to the best of 
your knowledge, you nor anyone in your household has not had any symptoms of COVID-19 
(such as fever, chills, cough, shortness of breath or difficulty breathing, fatigue, muscle or body 
aches, headache, new loss of taste or smell, sore throat, congestion or runny nose, nausea or 
vomiting) nor have you or any member of your household tested positive to the COVID-19 virus 
in the last 14 days. <i>Please cancel and reschedule your appointment (<a href="https://movetcare.com/get-the-app" target="_blank">using our mobile app</a>) for 
another day/time if any of the above is true.</i> No cancellation charge will apply in this case.</p><p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or "Ask a Question" via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
    if (DEBUG) console.log("emailText -> ", emailText);
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      bcc: "info@movetcare.com",
      replyTo: "info@movetcare.com",
      subject: `${petNames}'s Appointment Reminder: ${getDateStringFromDate(
        start?.toDate(),
        "dateOnly"
      )} @ ${getDateStringFromDate(start?.toDate(), "timeOnly")}`,
      text: emailText.replace(/(<([^>]+)>)/gi, ""),
      html: emailText,
    };
    if (DEBUG) console.log("SENDING EMAIL APPOINTMENT NOTIFICATION");
    if (environment?.type === "production")
      await emailClient
        .send(emailConfig)
        .then(async () => {
          if (DEBUG) console.log("EMAIL SENT!", emailConfig);
          createProVetNote({
            type: 1,
            subject: `24 Hour Appointment Reminder Notification`,
            message: emailConfig.html,
            client: `${client}`,
            patients: [],
          });
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
            .catch((error: any) => throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) console.error(error?.response?.body?.errors);
          throwError(error);
        });
    else console.log("SIMULATING APPOINTMENT NOTIFICATION CONFIRMATION EMAIL");
  } else if (DEBUG)
    console.log("DID NOT SEND 24 HOUR APPOINTMENT NOTIFICATION EMAIL", {
      sendEmail:
        userNotificationSettings && userNotificationSettings?.sendEmail,
      email,
    });
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendSms &&
    phoneNumber
  ) {
    if (DEBUG) console.log("SENDING SMS APPOINTMENT NOTIFICATION");
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`
          )
        : patients[0].name;
    if (DEBUG) console.log("petNames -> ", petNames);
    const reasonName = reason ? await getReasonName(reason) : null;
    const smsText = `${
      displayName ? `Hi ${displayName}. ` : "Hey there! "
    }\n\nThis is MoVET reaching out to remind you of your upcoming appointment.\n\nAPPOINTMENT DETAILS:\n${
      user
        ? `Location: ${
            user === 8
              ? `Housecall - ${
                  clientProvetRecord?.street_address || "STREET UNKNOWN"
                } ${clientProvetRecord?.city || "CITY UNKNOWN"}, ${
                  clientProvetRecord?.state || "STATE UNKNOWN"
                } ${clientProvetRecord?.zip_code || "ZIPCODE UNKNOWN"}`
              : user === 7
              ? "MoVET Clinic @ 4912 S Newport St Denver, CO 80237 - https://goo.gl/maps/GxPDfsCfdXhbmZVe9"
              : user === 9
              ? "Virtual - We'll email you a link when it's time for your consultation"
              : "UNKNOWN"
          }`
        : ""
    }\nTime: ${getDateStringFromDate(start?.toDate())}\nPet${
      patients.length > 1 ? "s" : ""
    }: ${petNames}\n${reasonName !== null ? `\nReason: ${reasonName}\n` : ""}${
      instructions ? `Instructions: ${instructions}\n` : ""
    }${
      doesHaveValidPaymentOnFile !== false &&
      doesHaveValidPaymentOnFile.length > 0
        ? ""
        : user === 8
        ? `\nOur records indicate that you do not have a form of payment on file. We must have a form of payment on file prior to your appointment. Please use the link below to add a new form of payment to your account:\n\n${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll("+", "%2B")}`}\n`
        : `\nOur records indicate that you do not have a form of payment on file -> ADD A PAYMENT SOURCE: ${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll("+", "%2B")}`}\n`
    }\nPlease be sure to read our appointment prep guide prior to your appointment - https://movetcare.com/appointment-prep \n\nEmail info@movetcare.com, text (720) 507-7387, or "Ask a Question" via our mobile app if you have any questions or need assistance!\n\nWe look forward to seeing you soon,\n- The MoVET Team\n\nhttps://movetcare.com/get-the-app`;
    if (DEBUG) console.log("smsText -> ", smsText);
    if (environment?.type === "production") {
      await sms.messages
        .create({
          body: smsText,
          from: "+17206775047",
          to: phoneNumber,
        })
        .then(async () => {
          if (DEBUG)
            console.log("SMS SENT!", {
              body: smsText,
              from: "+17206775047",
              to: phoneNumber,
            });
          createProVetNote({
            type: 0,
            subject: `24 Hour Appointment Reminder Notification (SMS)`,
            message: smsText,
            client: `${client}`,
            patients: [],
          });
        })
        .catch(async (error: any) => {
          console.error(error);
          if (DEBUG)
            console.error("SMS FAILED TO SEND!", {
              body: smsText,
              from: "+17206775047",
              to: phoneNumber,
            });
          createProVetNote({
            type: 0,
            subject: `FAILED TO SEND 24 Hour Appointment Reminder Notification (SMS)`,
            message: smsText + "\n\n" + error.message,
            client: `${client}`,
            patients: [],
          });
        });
      await admin
        .firestore()
        .collection("clients")
        .doc(`${client}`)
        .collection("notifications")
        .add({
          type: "sms",
          body: smsText,
          from: "+17206775047",
          to: phoneNumber,
          createdOn: new Date(),
        })
        .catch((error: any) => throwError(error));
    } else console.log("SIMULATING APPOINTMENT NOTIFICATION CONFIRMATION SMS");
  } else if (DEBUG)
    console.log("DID NOT SEND 24 HOUR APPOINTMENT NOTIFICATION SMS", {
      sendSms: userNotificationSettings && userNotificationSettings?.sendSms,
      phoneNumber,
    });
};

const send30MinAppointmentNotification = async (
  appointmentDetails: AppointmentDetails,
  userDetails: UserDetails,
  userNotificationSettings: UserNotificationSettings | false,
  doesHaveValidPaymentOnFile: false | Array<any>,
  clientProvetRecord: any,
  petNames: string | Array<string>
) => {
  const {
    id,
    client,
    user,
    start,
    instructions,
    patients,
    reason,
    telemedicineUrl,
  } = appointmentDetails;
  const reasonName = reason ? await getReasonName(reason) : null;
  if (DEBUG)
    console.log("APPOINTMENT DETAILS", {
      id,
      client,
      user,
      start,
      instructions,
      patients,
      reason,
      reasonName,
      doesHaveValidPaymentOnFile,
      telemedicineUrl,
    });

  const { email, phoneNumber, displayName } = userDetails;
  if (DEBUG) console.log("USER DATA", { email, phoneNumber, displayName });
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendEmail &&
    email
  ) {
    const emailText = `${
      displayName ? `<p>Hi ${displayName},</p>` : "<p>Hey there!</p>"
    }${
      user === 8
        ? `<p>A MoVET Expert is on their way to ${
            clientProvetRecord?.street_address || "UNKNOWN"
          } for your ${getDateStringFromDate(
            start?.toDate(),
            "timeOnly"
          )} appointment today.</p>`
        : user === 7
        ? "<p>We are reaching out to remind you of your upcoming appointment with MoVET today.</p>"
        : user === 9
        ? "<p>Dr. MoVET has invited you to join a secure video call:</p>"
        : ""
    }${
      user === 7 || user === 9
        ? `<p><b>Time: </b>${getDateStringFromDate(start?.toDate())}</p>`
        : ""
    }
    ${
      user === 7
        ? `<p><b>Location: </b> MoVET Clinic @ Belleview Station (<a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a>)</p>`
        : ""
    }${
      instructions
        ? `<p><b>Instructions: </b>${instructions}</p>`
        : '<p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
    }
    ${
      user === 9
        ? `<p>Please tap the "START CONSULTATION" button in our <a href="https://movetcare.com/get-the-app" target="_blank">mobile app</a> to start your Virtual Consultation session for ${petNames}. <i>You can also use <b><a href="${telemedicineUrl}" target="_blank">this link</a></b> to start your session via web browser.</p>
        <p>Please reply to this message if you have any pictures or videos that you'd like to share with us prior to our consultation.</p>
        <p>Make sure you are using a device with good internet connection and access to camera/audio. Our telehealth platform allows you to test your device prior to starting the consultation. We highly suggest you run those diagnostic tests prior to connecting with us.</p>
        <p><b>The cost of this service is between $32.00 - $50 per consultation.</b></p>`
        : ""
    }
    ${
      doesHaveValidPaymentOnFile !== false &&
      doesHaveValidPaymentOnFile.length > 0
        ? ""
        : user === 8 || user === 9
        ? `<p><b>Payment on File:</b><b> Our records indicate that you do not have a form of payment on file. We must have a form of payment on file prior to your appointment: <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B"
          )}`}" target="_blank">Add a Form of Payment</a></b></p>`
        : `<p><b>Our records indicate that you do not have a form of payment on file -> <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B"
          )}`}" target="_blank">Add a Form of Payment</a></b></p>`
    }<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or "Ask a Question" via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
    if (DEBUG) console.log("emailText -> ", emailText);
    const emailConfig: EmailConfiguration = {
      to: email,
      from: "info@movetcare.com",
      bcc: "info@movetcare.com",
      replyTo: "info@movetcare.com",
      subject: "It's almost time for your appointment w/ MoVET!",
      text: emailText.replace(/(<([^>]+)>)/gi, ""),
      html: emailText,
    };
    if (DEBUG) console.log("SENDING EMAIL APPOINTMENT NOTIFICATION");
    if (environment?.type === "production")
      await emailClient
        .send(emailConfig)
        .then(async () => {
          if (DEBUG) console.log("EMAIL SENT!", emailConfig);
          createProVetNote({
            type: 1,
            subject: `30 Min Appointment Reminder Notification (EMAIL)`,
            message: emailConfig.html,
            client: `${client}`,
            patients: [],
          });
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
            .catch((error: any) => throwError(error));
        })
        .catch(async (error: any) => {
          if (DEBUG) console.error(error?.response?.body?.errors);
          throwError(error);
        });
    else console.log("SIMULATING 30 MIN APPOINTMENT NOTIFICATION EMAIL");
  } else if (DEBUG)
    console.log("DID NOT SEND 30 MIN APPOINTMENT NOTIFICATION EMAIL", {
      sendEmail:
        userNotificationSettings && userNotificationSettings?.sendEmail,
      email,
    });
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendSms &&
    phoneNumber
  ) {
    if (DEBUG) console.log("SENDING SMS APPOINTMENT NOTIFICATION");
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`
          )
        : patients[0].name;
    if (DEBUG) console.log("petNames -> ", petNames);
    const smsText = `${
      displayName ? `Hi ${displayName},\n\n` : "Hey there!\n\n"
    }${
      user === 8
        ? `A MoVET Expert is on their way to ${
            clientProvetRecord?.street_address || "UNKNOWN"
          } for your ${getDateStringFromDate(
            start?.toDate(),
            "timeOnly"
          )} appointment today.\n`
        : user === 7
        ? "We are reaching out to remind you of your upcoming appointment with MoVET today.\n\nAPPOINTMENT DETAILS:\n"
        : user === 9
        ? "Dr. MoVET has invited you to join a secure video call:\n\n"
        : ""
    }${
      user === 7 || user === 9
        ? `Time: ${getDateStringFromDate(start?.toDate())}\n`
        : ""
    }${
      user === 7
        ? `Location: MoVET Clinic @ Belleview Station (912 S Newport St Denver, CO 80237 - https://goo.gl/maps/GxPDfsCfdXhbmZVe9)\n`
        : ""
    }${
      instructions
        ? `Instructions: ${instructions}\n`
        : `Medical Records: If this appointment is for a new pet, please email (or have your previous vet email) their vaccine 
and medical records to info@movetcare.com prior to your appointment.\n`
    }${
      user === 9
        ? `\nPlease tap the "START CONSULTATION" button in our mobile app to start your Virtual Consultation session for ${petNames}. You can also use the link below to start your Virtual Consultation session via web browser:\n\n${telemedicineUrl}\n\nPlease email info@movetcare.com if you have any pictures or videos that you'd like to share with us prior to our consultation.\n\n Make sure you are using a device with good internet connection and access to camera/audio. Our telehealth platform allows you to test your device prior to starting the consultation. We highly suggest you run those diagnostic tests prior to connecting with us.\n\nThe cost of this service is  between $32.00 - $50 per consultation.\n\n`
        : ""
    }${
      doesHaveValidPaymentOnFile !== false &&
      doesHaveValidPaymentOnFile.length > 0
        ? ""
        : user === 8 || user === 9
        ? `Payment on File: Our records indicate that you do not have a form of payment on file. We must have a form of payment on file prior to your appointment:\n\n Add a Payment Method\nhttps://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll("+", "%2B")}\n\n`
        : `Our records indicate that you do not have a form of payment on file -> Add a Payment Method\nhttps://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll("+", "%2B")}\n\n`
    }\nPlease email info@movetcare.com, text (720) 507-7387 us, or "Ask a Question" via our mobile app if you have any questions or need assistance!\n\nWe look forward to seeing you soon,\n- The MoVET Team\n\nhttps://movetcare.com/get-the-app`;
    if (DEBUG) console.log("smsText -> ", smsText);
    if (environment?.type === "production") {
      await sms.messages
        .create({
          body: smsText,
          from: "+17206775047",
          to: phoneNumber,
        })
        .then(async () => {
          if (DEBUG)
            console.log("SMS SENT!", {
              body: smsText,
              from: "+17206775047",
              to: phoneNumber,
            });
          createProVetNote({
            type: 0,
            subject: `30 Min Appointment Reminder Notification (SMS)`,
            message: smsText,
            client: `${client}`,
            patients: [],
          });
        })
        .catch(async (error: any) => {
          console.error(error);
          if (DEBUG)
            console.log("SMS FAILED TO SEND!", {
              body: smsText,
              from: "+17206775047",
              to: phoneNumber,
            });
          createProVetNote({
            type: 0,
            subject: `FAILED TO 30 MIN Hour Appointment Reminder Notification (SMS)`,
            message: smsText + "\n\n" + error.message,
            client: `${client}`,
            patients: [],
          });
        });
      await admin
        .firestore()
        .collection("clients")
        .doc(`${client}`)
        .collection("notifications")
        .add({
          type: "sms",
          body: smsText,
          from: "+17206775047",
          to: phoneNumber,
          createdOn: new Date(),
        })
        .catch((error: any) => throwError(error));
    } else console.log("SIMULATING 30 MIN APPOINTMENT NOTIFICATION SMS");
  } else if (DEBUG)
    console.log("DID NOT 30 MIN HOUR APPOINTMENT NOTIFICATION SMS", {
      sendSms: userNotificationSettings && userNotificationSettings?.sendSms,
      phoneNumber,
    });
};

const getReasonName = async (reason: string) =>
  await admin
    .firestore()
    .collection("reasons")
    .where("id", "==", getProVetIdFromUrl(reason))
    .limit(1)
    .get()
    .then(async (querySnapshot: any) => {
      if (DEBUG)
        console.log("querySnapshot?.docs?.length", querySnapshot?.docs?.length);
      let reason = null;
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) => {
          reason = doc.data()?.name;
          if (DEBUG) console.log("REASON NAME: ", reason);
        });
      return reason;
    })
    .catch((error: any) => throwError(error));
