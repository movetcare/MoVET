import { throwError } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
export const sendBookingRequestAdminNotification = async ({
  id,
  bookingRef,
}: {
  id: string;
  bookingRef: any;
}) => {
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
  }: any = await bookingRef
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
  const { email, displayName, phoneNumber } = client;
  const { subject, message } = createAdminMessage({
    messageTemplate: "email",
    vcprRequired,
    reason,
    client,
    illPatients,
    patients,
    id,
    displayName,
    createdAt,
    phoneNumber,
    email,
    requestedDateTime,
    location,
    address,
  });

  createProVetNote({
    type: 10,
    subject,
    message,
    client: client.uid,
    patients: patients.map((patient: { value: string }) => patient.value),
  });

  sendNotification({
    type: "email",
    payload: {
      to: "info@movetcare.com",
      bcc: "support@movetcare.com",
      replyTo: email,
      subject,
      message,
    },
  });

  sendNotification({
    type: "slack",
    payload: {
      channel: "appointment-request",
      message: createAdminMessage({
        messageTemplate: "slack",
        vcprRequired,
        reason,
        client,
        illPatients,
        patients,
        id,
        displayName,
        createdAt,
        phoneNumber,
        email,
        requestedDateTime,
        location,
        address,
      }),
    },
  });
};

const createAdminMessage = ({
  messageTemplate,
  client,
  illPatients,
  reason,
  vcprRequired,
  patients,
  id,
  displayName,
  createdAt,
  phoneNumber,
  email,
  requestedDateTime,
  location,
  address,
}: any): any => {
  if (messageTemplate === "email") {
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
        }</p><p><b>Aggression Status:</b> ${
          patient?.aggressionStatus?.name.includes("no history of aggression")
            ? "NOT Aggressive"
            : "AGGRESSIVE"
        }</p><p><b>VCPR Required:</b> ${
          patient?.vcprRequired ? "Yes" : "No"
        }</p>`
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

    return {
      subject: `${
        displayName ? displayName : email ? email : ""
      } has submitted a new appointment request`,
      message,
    };
  } else {
    return [
      {
        type: "section",
        text: {
          text: ":exclamation: _New Appointment Request_ :exclamation:",
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
                  }) - https://us.provetcloud.com/4285/client/${client?.uid}`
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
              patients.length > 1
                ? JSON.stringify(
                    patients.map((patient: any, index: number) =>
                      index !== patients.length - 1
                        ? `${patient?.name} `
                        : ` and ${patient?.name}`
                    )
                  )
                : patients[0].name +
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
                    ? `${formatDateToMMDDYY(requestedDateTime?.date?.toDate())}`
                    : ""
                }${
                  requestedDateTime?.time ? ` @ ${requestedDateTime?.time}` : ""
                }`
              : "",
          },
        ],
      },
    ];
  }
};
