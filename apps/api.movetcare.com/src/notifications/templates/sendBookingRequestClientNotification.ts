import { throwError } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { sendNotification } from "../sendNotification";
export const sendBookingRequestClientNotification = async ({
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
    selectedStaff,
  }: any = await bookingRef
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
  const { email, displayName, phoneNumber, uid } = client;
  const { subject, message } = createClientMessage({
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
    selectedStaff,
  });

  createProVetNote({
    type: 10,
    subject,
    message,
    client: uid,
    patients: patients.map((patient: { value: string }) => patient.value),
  });

  sendNotification({
    type: "email",
    payload: {
      subject,
      message,
    },
  });

  sendNotification({
    type: "slack",
    payload: {
      channel: "appointment-request",
      message: createClientMessage({
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
        selectedStaff,
      }),
    },
  });
};

const createClientMessage = ({
  messageTemplate,
  client,
  illPatients,
  reason,
  vcprRequired,
  patients,
  displayName,
  phoneNumber,
  email,
  requestedDateTime,
  location,
  address,
  selectedStaff,
}: any): any => {
  if (messageTemplate === "email") {
    const message = `<p>Hi ${
      client?.displayName
    },</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request bellow and let us know (by replying to this email) if anything needs to be changed.</p>${
      displayName ? `<p><b>Name:</b> ${displayName}</p>` : ""
    }<p><b>Email:</b> ${email}</p>${
      phoneNumber
        ? `<p><b>Phone:</b> <a href="tel://${phoneNumber}">${formatPhoneNumber(
            phoneNumber?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }${patients.map(
      (patient: any) =>
        `<p><b>Pet Name:</b> ${patient?.name}</p><p><b>Pet Species:</b> ${
          patient?.species
        }</p><p><b>Pet Gender:</b> ${patient?.gender}</p>${
          patient?.hasMinorIllness && patient?.illnessDetails
            ? `<p><b>Pet Minor Illness:</b> ${JSON.stringify(
                patient?.illnessDetails?.symptoms
              )} - ${patient?.illnessDetails?.notes}</p>`
            : ""
        }${
          patient.aggressionStatus
            ? `<p><b>Aggression Status:</b> "${patient?.aggressionStatus?.name}"</p>`
            : ""
        }`
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
        ? `<p><b>Requested Location:</b> ${location} ${
            address ? `- ${address?.full} (${address?.info})` : ""
          }</p>`
        : ""
    }${
      selectedStaff
        ? `<p><b>Requested Expert:</b> ${selectedStaff?.title} ${selectedStaff?.firstName} ${selectedStaff?.lastName}</p>`
        : ""
    }<p>We look forward to seeing you soon!</p><p>- The MoVET Team</p>`;

    return {
      subject: "We have received your appointment request!",
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
                ? `${client?.displayName ? client?.displayName : ""} ${
                    client?.email ? client?.email : ""
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
            text: "*Selected Staff:*",
          },
          {
            type: "plain_text",
            text: `${selectedStaff?.title} ${selectedStaff?.firstName} ${selectedStaff?.lastName}`,
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
                address?.info ? ` - ${address?.info}` : ""
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
