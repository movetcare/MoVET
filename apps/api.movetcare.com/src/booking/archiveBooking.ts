import { throwError, admin } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { logEvent } from "../utils/logging/logEvent";

const DEBUG = true;

export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  const bookingRef = admin.firestore().collection("bookings").doc(id);
  await bookingRef
    .set(
      {
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(
      async () =>
        await logEvent({
          tag: "appointment-booking",
          origin: "api",
          success: true,
          sendToSlack: true,
          data: {
            id,
            step: "archived",
            updatedOn: new Date(),
            message: [
              {
                type: "section",
                text: {
                  text: ":book: _Appointment Booking_ *UPDATE*",
                  type: "mrkdwn",
                },
                fields: [
                  {
                    type: "mrkdwn",
                    text: "*Session ID*",
                  },
                  {
                    type: "plain_text",
                    text: id,
                  },
                  {
                    type: "mrkdwn",
                    text: "*Step*",
                  },
                  {
                    type: "plain_text",
                    text: "ARCHIVED",
                  },
                ],
              },
            ],
          },
        })
    )
    .catch(async (error: any) => await throwError(error));
  const {
    client,
    createdAt,
    patients,
    reason,
    requestedDateTime,
    vcprRequired,
    location,
    address,
    illPatients,
    step,
  }: any = await bookingRef
    .get()
    .then((doc: any) => doc.data())
    .catch(async (error: any) => await throwError(error));
  const { email, displayName, phoneNumber } = client;
  const patientNames =
    patients.length > 1
      ? patients.map((patient: any, index: number) =>
          index !== patients.length - 1
            ? `${patient?.name} `
            : ` and ${patient?.name}`
        )
      : patients[0].name;
  await sendNotification({
    type: "email",
    payload: {
      tag: "admin-booking-request-recovery",
      origin: "api",
      success: true,
      client,
      createdAt,
      patients,
      reason,
      requestedDateTime,
      vcprRequired,
      location,
      address,
      illPatients,
      step,
      to: "info@movetcare.com",
      bcc: "support@movetcare.com",
      replyTo: email,
      subject: `${
        displayName ? displayName : email ? email : ""
      } has submitted a new appointment booking request`,
      message: `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
        ?.toDate()
        ?.toString()}</p>${
        displayName ? `<p><b>Client Name:</b> ${displayName}</p>` : ""
      }<p><b>Client Email:</b> ${email}</p>${
        phoneNumber ? `<p><b>Client Phone:</b> ${phoneNumber}</p>` : ""
      }${patientNames ? `<p><b>Patient Name(s):</b>${patientNames}</p>` : ""}${
        illPatients
          ? `<p><b>Patient(s) w/ Minor Illness:</b> ${illPatients?.length}</p>`
          : ""
      }${vcprRequired ? `<p><b>VCPR Required:</b> ${vcprRequired}</p>` : ""}${
        reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""
      }${
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
  await sendNotification({
    type: "slack",
    payload: {
      tag: "appointment-booking-request",
      origin: "api",
      success: true,
      channel: "appointment-request",
      data: {
        id,
        client,
        createdAt,
        patients,
        reason,
        requestedDateTime,
        vcprRequired,
        location,
        address,
        illPatients,
        step,
        updatedOn: new Date(),
        message: [
          {
            type: "section",
            text: {
              text: ":exclamation: _New Appointment Booking Request_ :exclamation:",
              type: "mrkdwn",
            },
            fields: [
              {
                type: "mrkdwn",
                text: "*Client:*",
              },
              {
                type: "plain_text",
                text: `${
                  client
                    ? `${client?.displayName ? client?.displayName : ""} (${
                        client?.email ? client?.email : ""
                      } - ${
                        client?.phoneNumber ? client?.phoneNumber : ""
                      }) - https://us.provetcloud.com/4285/client/${
                        client?.uid
                      }`
                    : "NOT PROVIDED"
                }`,
              },
              {
                type: "mrkdwn",
                text: "*Patients:*",
              },
              {
                type: "plain_text",
                text:
                  patientNames +
                  ` ${illPatients ? `${illPatients?.length} are ill` : ""} ${
                    reason ? `Reason - ${reason?.label}` : ""
                  } ${
                    vcprRequired
                      ? `VCPR ${vcprRequired ? "IS" : "IS NOT"} REQUIRED`
                      : ""
                  } `,
              },
              {
                type: "mrkdwn",
                text: "*Location:*",
              },
              {
                type: "plain_text",
                text:
                  location +
                  ` ${address ? address.full : ""} ${
                    address?.info ? address?.info : ""
                  }`,
              },
              {
                type: "mrkdwn",
                text: "*Requested Date / Time:*",
              },
              {
                type: "plain_text",
                text: requestedDateTime
                  ? `${
                      requestedDateTime?.date
                        ? `DATE: ${requestedDateTime?.date}`
                        : ""
                    }${
                      requestedDateTime?.time
                        ? `DATE: ${requestedDateTime?.time}`
                        : ""
                    }`
                  : "",
              },
            ],
          },
        ],
      },
      sendToSlack: true,
    },
  });
};
