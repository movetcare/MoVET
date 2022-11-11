import { throwError, admin, proVetApiUrl, request } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";
import { formatDateToMMDDYY } from "../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { logEvent } from "../utils/logging/logEvent";

const DEBUG = false;

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
  const subject = `${
    displayName ? displayName : email ? email : ""
  } has submitted a new appointment booking request`;
  const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
    ?.toDate()
    ?.toString()}</p>${
    displayName ? `<p><b>Client Name:</b> ${displayName}</p>` : ""
  }<p><b>Client Email:</b> ${email}</p>${
    phoneNumber
      ? `<p><b>Client Phone:</b> <a href="tel://${phoneNumber}">${formatPhoneNumber(
          phoneNumber?.replaceAll("+1", "")
        )}</a></p>`
      : ""
  }${patients.map(
    (patient: any) =>
      `<p><b>Patient Name:</b> ${patient?.name}</p><p><b>Patient Species:</b> ${
        patient?.species
      }</p><p><b>Patient Gender:</b> ${
        patient?.gender
      }</p><p><b>Patient Minor Illness:</b> ${
        patient?.hasMinorIllness
          ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
              patient?.illnessDetails?.notes
            }`
          : " NONE"
      }</p><p><b>Aggression Status:</b> ${
        patient?.aggressionStatus?.name.includes("no history of aggression")
          ? "NOT Aggressive"
          : "AGGRESSIVE"
      }</p><p><b>VCPR Required:</b> ${patient?.vcprRequired ? "Yes" : "No"}</p>`
  )}${
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
  }`;
  await request
    .post("/note/", {
      title: subject,
      type: 10,
      client: proVetApiUrl + `/client/${client.uid}/`,
      patients: patients.map(
        (patient: any) => proVetApiUrl + `/patient/${patient.value}/`
      ),
      note: message,
    })
    .then(async (response: any) => {
      const { data } = response;
      if (DEBUG) console.log("API Response: POST /note/ => ", data);
    })
    .catch(async (error: any) => await throwError(error));
  await sendNotification({
    type: "email",
    payload: {
      tag: "admin-booking-request-alert",
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
      subject,
      message,
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
                        ? `${formatDateToMMDDYY(
                            requestedDateTime?.date?.toDate()
                          )}`
                        : ""
                    }${
                      requestedDateTime?.time
                        ? ` @ ${requestedDateTime?.time}`
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
