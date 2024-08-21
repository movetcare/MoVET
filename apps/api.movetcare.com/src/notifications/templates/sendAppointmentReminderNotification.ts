/* eslint-disable quotes */
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { getAuthUserById } from "../../utils/auth/getAuthUserById";
import { admin, throwError } from "../../config/config";
const DEBUG = false;
import {
  getClientNotificationSettings,
  UserNotificationSettings,
} from "../../utils/getClientNotificationSettings";
import { getDateStringFromDate } from "../../utils/getDateStringFromDate";
import { getCustomerId } from "../../utils/getCustomerId";
import { verifyValidPaymentSource } from "../../utils/verifyValidPaymentSource";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import type { EmailConfiguration } from "../../types/email.d";
import { sendNotification } from "../sendNotification";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
import { truncateString } from "../../utils/truncateString";
// import { subtractMinutesFromDate } from "../../utils/subtractMinutesFromDate";

interface AppointmentDetails {
  active: boolean;
  id: number;
  client: number;
  send30MinReminder: boolean;
  send24HourReminder: boolean;
  start: any;
  instructions: string;
  notes: string;
  telemedicineUrl?: string;
  patients: Array<{
    gender: string;
    id: number;
    minorIllness: string;
    name: string;
    species: string;
  }>;
  reason: string;
  resources: Array<number>;
}

interface UserDetails {
  email: string;
  phoneNumber: string;
  displayName: string;
}

export const sendAppointmentReminderNotification = async (
  appointmentDetails: AppointmentDetails,
): Promise<void> => {
  const { send24HourReminder, send30MinReminder, client, start, patients, id } =
    appointmentDetails;
  const appointmentDataInProVet = await fetchEntity("appointment", id);
  const active = appointmentDataInProVet?.active === 1;
  if (DEBUG) {
    console.log(
      "sendAppointmentReminderNotification => appointmentDetails",
      appointmentDetails,
    );
    console.log(
      "sendAppointmentReminderNotification => start",
      start?.toDate(),
    );
    console.log(
      "sendAppointmentReminderNotification => start.toDate() > new Date()",
      start?.toDate() > new Date(),
    );
    console.log("sendAppointmentReminderNotification => active", active);
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
        customerId,
      );
    const userNotificationSettings: UserNotificationSettings | false =
      await getClientNotificationSettings(`${client}`);
    const clientProvetRecord = await fetchEntity("client", client);
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`,
          )
        : patients[0].name;
    if (DEBUG) {
      console.log(
        "sendAppointmentReminderNotification => clientProvetRecord",
        clientProvetRecord,
      );
      console.log(
        "sendAppointmentReminderNotification => petNames -> ",
        petNames,
      );
      console.log(
        "sendAppointmentReminderNotification => send24HourReminder",
        send24HourReminder,
      );
      console.log(
        "sendAppointmentReminderNotification => send30MinReminder",
        send30MinReminder,
      );
    }
    if (send24HourReminder)
      await send24HourAppointmentNotification(
        appointmentDetails,
        userDetails,
        userNotificationSettings,
        doesHaveValidPaymentOnFile,
        petNames,
      );
    if (send30MinReminder) {
      if (
        appointmentDetails?.resources?.includes(3) ||
        appointmentDetails?.resources?.includes(9)
      )
        admin
          .firestore()
          .collection("appointments")
          .doc(`${id}`)
          .set({ status: "IN-ROUTE", updatedOn: new Date() }, { merge: true });
      // admin
      //   .firestore()
      //   .collection("tasks_queue")
      //   .doc(`${id}_update_appointment_to_in_progress`)
      //   .set(
      //     {
      //       options: {
      //         id,
      //       },
      //       worker: "update_appointment_to_in_progress",
      //       status: "scheduled",
      //       performAt: subtractMinutesFromDate(
      //         appointmentDetails?.start?.toDate(),
      //         1,
      //       ),
      //       createdOn: new Date(),
      //     },
      //     { merge: true },
      //   );
      await send30MinAppointmentNotification(
        appointmentDetails,
        userDetails,
        userNotificationSettings,
        doesHaveValidPaymentOnFile,
        petNames,
      );
    }
  }
};

const send24HourAppointmentNotification = async (
  appointmentDetails: AppointmentDetails,
  userDetails: UserDetails,
  userNotificationSettings: UserNotificationSettings | false,
  doesHaveValidPaymentOnFile: false | Array<any>,
  petNames: string | Array<string>,
) => {
  const {
    id,
    client,
    start,
    notes,
    instructions,
    patients,
    reason,
    resources,
  } = appointmentDetails;
  const reasonName = reason ? await getReasonName(reason) : null;
  if (DEBUG)
    console.log("sendAppointmentReminderNotification => APPOINTMENT DETAILS", {
      id,
      client,
      start,
      instructions,
      patients,
      reason,
      reasonName,
      resources,
      doesHaveValidPaymentOnFile,
    });
  const appointmentType =
    resources?.includes(6) || // Exam Room 1
    resources?.includes(7) || // Exam Room 2
    resources?.includes(8) || // Exam Room 3
    resources?.includes(14) || // Exam Room 1
    resources?.includes(15) || // Exam Room 2
    resources?.includes(16) // Exam Room 3
      ? "CLINIC"
      : resources?.includes(3) || resources?.includes(9) // Truck 1 // Truck 2
        ? "HOUSECALL"
        : resources?.includes(11) || resources?.includes(18) // Virtual Room 1 // Virtual Room 2
          ? "TELEHEALTH"
          : null;
  const { email, phoneNumber, displayName } = userDetails;
  if (DEBUG)
    console.log("sendAppointmentReminderNotification => USER DATA", {
      email,
      phoneNumber,
      displayName,
    });
  if (email) {
    let emailText = "";
    const vcprRequired = await admin
      .firestore()
      .collection("patients")
      .doc(`${patients[0]?.id}`)
      .get()
      .then((doc: any) => {
        if (DEBUG)
          console.log(
            "sendAppointmentReminderNotification => VCPR REQUIRED PATIENT DOC -> ",
            doc?.data(),
          );
        return doc?.data()?.vcprRequired;
      })
      .catch((error: any) => throwError(error));
    const appointmentAddress = notes?.includes("Appointment Address")
      ? notes?.split("-")[1]?.split("|")[0]?.trim()
      : await admin
          .firestore()
          .collection("clients")
          .doc(`${client}`)
          .get()
          .then(
            (doc: any) =>
              doc.data()?.street +
              " " +
              doc.data()?.city +
              ", " +
              doc.data()?.state +
              " " +
              doc.data()?.zipCode,
          )
          .catch((error: any) => throwError(error));
    if (DEBUG) {
      console.log(
        "sendAppointmentReminderNotification => appointmentAddress",
        appointmentAddress,
      );
      console.log(
        "sendAppointmentReminderNotification => vcprRequired",
        vcprRequired,
      );
    }
    emailText = `${
      displayName
        ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
        : "<p>Hey there!</p>"
    }<p>This email contains important information about your upcoming appointment with MoVET.</p>
      ${
        appointmentType === "HOUSECALL" && appointmentAddress
          ? `<p></p><p><b>Location</b>: ${appointmentAddress}</p>`
          : appointmentType === "TELEHEALTH"
            ? "<p></p><p><b>Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
            : appointmentType === "CLINIC"
              ? // eslint-disable-next-line quotes
                '<p></p><p><b>Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
              : "<p></p><p><b>Appointment Location</b>: Walk In Appointment</p>"
      }${
        start
          ? `<p></p><p><b>Date & Time</b>: ${getDateStringFromDate(
              start.toDate(),
            )}`
          : ""
      }${
        instructions !== undefined
          ? `<p></p><p><b>Instructions: </b>${instructions}</p>`
          : ""
      }
  ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        '<p></p><p><b>Medical Records:</b> Please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
      : ""
  }${
    phoneNumber &&
    (appointmentType === "HOUSECALL" || appointmentType === "TELEHEALTH")
      ? `<p></p><p><b>Contact Phone Number</b>: ${phoneNumber}</p><p>*Please keep your phone handy the day of the ${
          appointmentType === "TELEHEALTH"
            ? "consultation."
            : "appointment. We will text you when we are on our way.</p>"
        }`
      : ""
  }${
    appointmentType === "HOUSECALL"
      ? "<p></p><p><b>Home Visit Trip Fee</b>: $60</p><p><b>*Additional charges will apply for add-on diagnostics, medications, pampering, etc.</b></p><p><i>A $60 cancellation fee will be charged if cancellation occurs within 24 hours of your appointment</i></p>"
      : ""
  }${
    doesHaveValidPaymentOnFile !== false &&
    doesHaveValidPaymentOnFile.length > 0
      ? ""
      : `<p><b>Payment on File:</b><b> Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. We must have a digital form of payment on file prior to your appointment: <a href="${`https://app.movetcare.com/update-payment-method?email=${(
          email as string
        )?.replaceAll(
          "+",
          "%2B",
        )}`}" target="_blank">Add a Form of Payment</a></b></p>`
  }${
    vcprRequired
      ? // eslint-disable-next-line quotes
        `<p></p><p><b>Waiver:</b> Please complete this form prior to your appointment: <a href="https://docs.google.com/forms/d/1ZrbaOEzckSNNS1fk2PATocViVFTkVwcyF_fZBlCrTkY/">MoVET's Waiver / Release form</a> </p>`
      : ""
  }${
    doesHaveValidPaymentOnFile !== false &&
    doesHaveValidPaymentOnFile.length > 0
      ? ""
      : appointmentType === "HOUSECALL"
        ? `<p><b>Payment on File:</b><b> Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. We must have a digital form of payment on file prior to your appointment: <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B",
          )}`}" target="_blank">Add a Form of Payment</a></b></p>`
        : `<p><b>Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. Please <a href="${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll(
            "+",
            "%2B",
          )}`}" target="_blank">add a digital form of payment</a></b>.</p>`
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
make your pet's visit more comfortable. We thank you in advance for keeping our staff safe!</i></p><p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or chat with us via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => emailText -> ",
        emailText,
      );
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: `${petNames}'s Appointment Reminder: ${getDateStringFromDate(
        start?.toDate(),
        "dateOnly",
      )} @ ${getDateStringFromDate(start?.toDate(), "timeOnly")}`,
      message: emailText,
    };
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => SENDING EMAIL APPOINTMENT NOTIFICATION",
      );
    sendNotification({
      type: "email",
      payload: {
        ...emailConfig,
        client: `${client}`,
        patients: patients.map((patient: any) => `${patient?.id}`),
      },
    });
  } else if (DEBUG)
    console.log(
      "sendAppointmentReminderNotification => DID NOT SEND 24 HOUR APPOINTMENT NOTIFICATION EMAIL",
      {
        sendEmail:
          userNotificationSettings && userNotificationSettings?.sendEmail,
        email,
      },
    );
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendSms &&
    phoneNumber
  ) {
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => SENDING SMS APPOINTMENT NOTIFICATION",
      );
    const appointmentAddress = notes?.includes("Appointment Address")
      ? notes?.split("-")[1]?.split("|")[0]?.trim()
      : await admin
          .firestore()
          .collection("clients")
          .doc(`${client}`)
          .get()
          .then(
            (doc: any) =>
              doc.data()?.street +
              " " +
              doc.data()?.city +
              ", " +
              doc.data()?.state +
              " " +
              doc.data()?.zipCode,
          )
          .catch((error: any) => throwError(error));
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => SMS appointmentAddress",
        appointmentAddress,
      );
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`,
          )
        : patients[0].name;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => petNames -> ",
        petNames,
      );
    const reasonName = reason ? await getReasonName(reason) : null;
    const appointmentType =
      resources?.includes(6) || // Exam Room 1
      resources?.includes(7) || // Exam Room 2
      resources?.includes(8) || // Exam Room 3
      resources?.includes(14) || // Exam Room 1
      resources?.includes(15) || // Exam Room 2
      resources?.includes(16) // Exam Room 3
        ? "CLINIC"
        : resources?.includes(3) || resources?.includes(9) // Truck 1 // Truck 2
          ? "HOUSECALL"
          : resources?.includes(11) || resources?.includes(18) // Virtual Room 1 // Virtual Room 2
            ? "TELEHEALTH"
            : null;
    let smsText = "";
    //if (isNewFlow)
    smsText = `${
      displayName
        ? `Hi ${getClientFirstNameFromDisplayName(displayName)}. `
        : "Hey there! "
    }\n\nThis is MoVET reaching out to remind you of your upcoming appointment.\n\nAPPOINTMENT DETAILS:\n${
      appointmentType === "HOUSECALL" && appointmentAddress
        ? `Location: ${appointmentAddress}`
        : appointmentType === "TELEHEALTH"
          ? "Location: Virtual - We will send you a link to the virtual meeting room on the day of your appointment."
          : appointmentType === "CLINIC"
            ? // eslint-disable-next-line quotes
              "Location: MoVET Clinic @ 4912 S Newport St Denver, CO 80237 - https://goo.gl/maps/GxPDfsCfdXhbmZVe9"
            : "Location: Walk In Appointment"
    }\nTime: ${getDateStringFromDate(start?.toDate())}\nPet${
      patients.length > 1 ? "s" : ""
    }: ${petNames}\n${
      reasonName !== null ? `\nReason: ${reasonName}\n` : ""
    }${instructions ? `Instructions: ${instructions}\n` : ""}${
      doesHaveValidPaymentOnFile !== false &&
      doesHaveValidPaymentOnFile.length > 0
        ? ""
        : `\nOur records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. We must have a digital form of payment on file prior to your appointment. Please use the link below to add a new form of payment to your account:\n\n${`https://app.movetcare.com/update-payment-method?email=${(
            email as string
          )?.replaceAll("+", "%2B")}`}\n`
    }\nPlease be sure to read our appointment prep guide prior to your appointment - https://movetcare.com/appointment-prep \n\nEmail info@movetcare.com, text (720) 507-7387, or chat with us via our mobile app if you have any questions or need assistance!\n\nWe look forward to seeing you soon,\n- The MoVET Team\n\nhttps://movetcare.com/get-the-app`;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => smsText -> ",
        smsText,
      );
    sendNotification({
      type: "sms",
      payload: {
        message: smsText,
        subject: "24 Hour Appointment Reminder Notification",
        client: `${client}`,
        patients: patients.map((patient: any) => `${patient?.id}`),
      },
    });
  } else if (DEBUG)
    console.log(
      "sendAppointmentReminderNotification => DID NOT SEND 24 HOUR APPOINTMENT NOTIFICATION SMS",
      {
        sendSms: userNotificationSettings && userNotificationSettings?.sendSms,
        phoneNumber,
      },
    );
  if (DEBUG)
    console.log(
      "sendAppointmentReminderNotification => sendAppointmentReminderNotification PUSH => USER DATA",
      {
        email,
        phoneNumber,
        displayName,
        client,
        userNotificationSettings,
      },
    );
  if (userNotificationSettings && userNotificationSettings?.sendPush && client)
    sendNotification({
      type: "push",
      payload: {
        user: { uid: client },
        category: "client-appointment",
        title: `${petNames}'s Appointment Reminder: ${getDateStringFromDate(
          start?.toDate(),
          "dateOnly",
        )} @ ${getDateStringFromDate(start?.toDate(), "timeOnly")}`,
        message: truncateString(
          "Please reach out if you have any questions or need assistance!",
        ),
        path: `/home/`,
      },
    });
};

const send30MinAppointmentNotification = async (
  appointmentDetails: AppointmentDetails,
  userDetails: UserDetails,
  userNotificationSettings: UserNotificationSettings | false,
  doesHaveValidPaymentOnFile: false | Array<any>,
  petNames: string | Array<string>,
) => {
  const {
    id,
    client,
    start,
    instructions,
    patients,
    reason,
    telemedicineUrl,
    notes,
    resources,
  } = appointmentDetails;
  const reasonName = reason ? await getReasonName(reason) : null;
  if (DEBUG)
    console.log("sendAppointmentReminderNotification => APPOINTMENT DETAILS", {
      id,
      client,
      start,
      instructions,
      patients,
      reason,
      reasonName,
      resources,
      doesHaveValidPaymentOnFile,
      telemedicineUrl,
    });

  const { email, phoneNumber, displayName } = userDetails;
  if (DEBUG)
    console.log("sendAppointmentReminderNotification => USER DATA", {
      email,
      phoneNumber,
      displayName,
    });
  if (email) {
    const appointmentAddress = notes?.includes("Appointment Address")
      ? notes?.split("-")[1]?.split("|")[0]?.trim()
      : await admin
          .firestore()
          .collection("clients")
          .doc(`${client}`)
          .get()
          .then(
            (doc: any) =>
              doc.data()?.street +
              " " +
              doc.data()?.city +
              ", " +
              doc.data()?.state +
              " " +
              doc.data()?.zipCode,
          )
          .catch((error: any) => throwError(error));
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => appointmentAddress",
        appointmentAddress,
      );
    const vcprRequired = await admin
      .firestore()
      .collection("patients")
      .doc(`${patients[0]?.id}`)
      .get()
      .then((doc: any) => {
        if (DEBUG)
          console.log(
            "sendAppointmentReminderNotification => VCPR REQUIRED PATIENT DOC -> ",
            doc?.data(),
          );
        return doc?.data()?.vcprRequired;
      })
      .catch((error: any) => throwError(error));
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => petNames -> ",
        petNames,
      );
    const appointmentType =
      resources?.includes(6) || // Exam Room 1
      resources?.includes(7) || // Exam Room 2
      resources?.includes(8) || // Exam Room 3
      resources?.includes(14) || // Exam Room 1
      resources?.includes(15) || // Exam Room 2
      resources?.includes(16) // Exam Room 3
        ? "CLINIC"
        : resources?.includes(3) || resources?.includes(9) // Truck 1 // Truck 2
          ? "HOUSECALL"
          : resources?.includes(11) || resources?.includes(18) // Virtual Room 1 // Virtual Room 2
            ? "TELEHEALTH"
            : null;
    let emailText = "";
    emailText = `${
      displayName
        ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
        : "<p>Hey there!</p>"
    }${
      appointmentType === "HOUSECALL" && appointmentAddress
        ? `<p>A MoVET Expert is on their way to ${
            appointmentAddress || "UNKNOWN"
          } for your ${getDateStringFromDate(
            start?.toDate(),
            "timeOnly",
          )} appointment today.</p>`
        : appointmentType === "CLINIC"
          ? "<p>We are reaching out to remind you of your upcoming appointment with MoVET today.</p>"
          : appointmentType === "TELEHEALTH"
            ? "<p>Dr. MoVET has invited you to join a secure video call:</p>"
            : "<p>We are reaching out to remind you of your upcoming appointment with MoVET today.</p>"
    }<p><b>Time: </b>${getDateStringFromDate(start?.toDate())}</p>
    ${
      appointmentType !== "TELEHEALTH" && appointmentType !== "HOUSECALL"
        ? `<p><b>Location: </b> MoVET Clinic @ Belleview Station (<a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a>)</p>`
        : ""
    }${
      instructions !== undefined
        ? `<p></p><p><b>Instructions: </b>${instructions}</p>`
        : ""
    }
  ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        '<p></p><p><b>Medical Records:</b> Please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
      : ""
  }
    ${
      appointmentType === "TELEHEALTH"
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
        : appointmentType !== "TELEHEALTH"
          ? `<p><b>Payment on File:</b><b> Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. We must have a digital form of payment on file prior to your appointment: <a href="${`https://app.movetcare.com/update-payment-method?email=${(
              email as string
            )?.replaceAll(
              "+",
              "%2B",
            )}`}" target="_blank">Add a Form of Payment</a></b></p>`
          : `<p><b>Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. Please <a href="${`https://app.movetcare.com/update-payment-method?email=${(
              email as string
            )?.replaceAll(
              "+",
              "%2B",
            )}`}" target="_blank">add a digital form of payment</a></b>.</p>`
    }<p>Please reply to this email, <a href="tel://7205077387">text us</a> us, or chat with us via our <a href="https://movetcare.com/get-the-app">mobile app</a> if you have any questions or need assistance!</p><p>We look forward to seeing you soon,</p><p>- The MoVET Team</p>`;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => emailText -> ",
        emailText,
      );
    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "It's almost time for your appointment w/ MoVET!",
      message: emailText,
    };
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => SENDING EMAIL APPOINTMENT NOTIFICATION",
      );
    sendNotification({
      type: "email",
      payload: { ...emailConfig, client: `${client}` },
    });
  } else if (DEBUG)
    console.log(
      "sendAppointmentReminderNotification => DID NOT SEND 30 MIN APPOINTMENT NOTIFICATION EMAIL",
      {
        sendEmail:
          userNotificationSettings && userNotificationSettings?.sendEmail,
        email,
      },
    );
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendSms &&
    phoneNumber
  ) {
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => SENDING SMS APPOINTMENT NOTIFICATION",
      );
    const petNames =
      patients.length > 1
        ? patients.map((patient: any, index: number) =>
            index !== patients.length - 1
              ? `${patient?.name} `
              : ` and ${patient?.name}`,
          )
        : patients[0].name;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => petNames -> ",
        petNames,
      );
    const appointmentAddress = notes?.includes("Appointment Address")
      ? notes?.split("-")[1]?.split("|")[0]?.trim()
      : await admin
          .firestore()
          .collection("clients")
          .doc(`${client}`)
          .get()
          .then(
            (doc: any) =>
              doc.data()?.street +
              " " +
              doc.data()?.city +
              ", " +
              doc.data()?.state +
              " " +
              doc.data()?.zipCode,
          )
          .catch((error: any) => throwError(error));
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => appointmentAddress",
        appointmentAddress,
      );
    const vcprRequired = await admin
      .firestore()
      .collection("patients")
      .doc(`${patients[0]?.id}`)
      .get()
      .then((doc: any) => {
        if (DEBUG)
          console.log(
            "sendAppointmentReminderNotification => VCPR REQUIRED PATIENT DOC -> ",
            doc?.data(),
          );
        return doc?.data()?.vcprRequired;
      })
      .catch((error: any) => throwError(error));
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => petNames -> ",
        petNames,
      );
    const appointmentType =
      resources?.includes(6) || // Exam Room 1
      resources?.includes(7) || // Exam Room 2
      resources?.includes(8) || // Exam Room 3
      resources?.includes(14) || // Exam Room 1
      resources?.includes(15) || // Exam Room 2
      resources?.includes(16) // Exam Room 3
        ? "CLINIC"
        : resources?.includes(3) || resources?.includes(9) // Truck 1 // Truck 2
          ? "HOUSECALL"
          : resources?.includes(11) || resources?.includes(18) // Virtual Room 1 // Virtual Room 2
            ? "TELEHEALTH"
            : null;
    let smsText = "";
    //if (isNewFlow)
    smsText = `${
      displayName
        ? `Hi ${getClientFirstNameFromDisplayName(displayName)},\n\n`
        : "Hey there!\n\n"
    }${
      appointmentType === "HOUSECALL" && appointmentAddress
        ? `A MoVET Expert is on their way to ${
            appointmentAddress || "UNKNOWN"
          } for your ${getDateStringFromDate(
            start?.toDate(),
            "timeOnly",
          )} appointment today.\n`
        : appointmentType === "CLINIC"
          ? "We are reaching out to remind you of your upcoming appointment with MoVET today.\n\nAPPOINTMENT DETAILS:\n"
          : appointmentType === "TELEHEALTH"
            ? "Dr. MoVET has invited you to join a secure video call:\n\n"
            : ""
    }Time: ${getDateStringFromDate(start?.toDate())}\n${
      appointmentType === "CLINIC"
        ? `Location: MoVET Clinic @ Belleview Station (4912 S Newport St Denver, CO 80237 - https://goo.gl/maps/GxPDfsCfdXhbmZVe9)\n`
        : ""
    }${instructions !== undefined ? `Instructions: ${instructions}` : ""}
  ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        "Medical Records: Please email (or have your previous vet email) their vaccine and medical records to info@movetcare.com prior to your appointment."
      : ""
  }${
    appointmentType === "TELEHEALTH"
      ? `\nPlease tap the "START CONSULTATION" button in our mobile app to start your Virtual Consultation session for ${petNames}. You can also use the link below to start your Virtual Consultation session via web browser:\n\n${telemedicineUrl}\n\nPlease email info@movetcare.com if you have any pictures or videos that you'd like to share with us prior to our consultation.\n\n Make sure you are using a device with good internet connection and access to camera/audio. Our telehealth platform allows you to test your device prior to starting the consultation. We highly suggest you run those diagnostic tests prior to connecting with us.\n\nThe cost of this service is  between $32.00 - $50 per consultation.\n\n`
      : ""
  }${
    doesHaveValidPaymentOnFile !== false &&
    doesHaveValidPaymentOnFile.length > 0
      ? ""
      : `Payment on File: Our records indicate that you do not have a form of payment on file. MoVET does not accept cash payments. We must have a digital form of payment on file prior to your appointment:\n\n Add a Payment Method\nhttps://app.movetcare.com/update-payment-method?email=${(
          email as string
        )?.replaceAll("+", "%2B")}\n\n`
  }\nPlease email info@movetcare.com, text (720) 507-7387 us, or chat with us via our mobile app if you have any questions or need assistance!\n\nWe look forward to seeing you soon,\n- The MoVET Team\n\nhttps://movetcare.com/get-the-app`;
    if (DEBUG)
      console.log(
        "sendAppointmentReminderNotification => smsText -> ",
        smsText,
      );
    sendNotification({
      type: "sms",
      payload: {
        client: `${client}`,
        subject: "30 Min Appointment Reminder Notification",
        message: smsText,
      },
    });
  } else if (DEBUG)
    console.log(
      "sendAppointmentReminderNotification => DID NOT 30 MIN HOUR APPOINTMENT NOTIFICATION SMS",
      {
        sendSms: userNotificationSettings && userNotificationSettings?.sendSms,
        phoneNumber,
      },
    );
  if (
    userNotificationSettings &&
    userNotificationSettings?.sendPush &&
    client
  ) {
    if (resources?.includes(3) || resources?.includes(9))
      sendNotification({
        type: "push",
        payload: {
          user: { uid: client },
          category: "client-appointment",
          title: "A MoVET Expert is on their way to your location!",
          message: truncateString(
            "Please reach out if you have any questions or need assistance!",
          ),
          path: `/home/`,
        },
      });
    else
      sendNotification({
        type: "push",
        payload: {
          user: { uid: client },
          category: "client-appointment",
          title: "It's almost time for your appointment w/ MoVET!",
          message: truncateString(
            "Please reach out if you have any questions or need assistance!",
          ),
          path: `/home/`,
        },
      });
  }
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
        console.log(
          "sendAppointmentReminderNotification => querySnapshot?.docs?.length",
          querySnapshot?.docs?.length,
        );
      let reason = null;
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) => {
          reason = doc.data()?.name;
          if (DEBUG)
            console.log(
              "sendAppointmentReminderNotification => REASON NAME: ",
              reason,
            );
        });
      return reason;
    })
    .catch((error: any) => throwError(error));
