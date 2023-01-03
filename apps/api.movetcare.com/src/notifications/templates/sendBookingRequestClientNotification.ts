import { throwError } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
// import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";
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
    selectedPatients,
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
    selectedPatients,
  });

  const allPatientIds: any = [];
  selectedPatients.forEach((selectedPatient: any) => {
    patients.map((patient: any) => {
      if (selectedPatient === patient?.id)
        allPatientIds.push(patient?.id || patient?.value);
    });
  });

  createProVetNote({
    type: 10,
    subject,
    message,
    client: uid,
    patients: Array.isArray(selectedPatients) ? allPatientIds : [],
  });

  sendNotification({
    type: "email",
    payload: {
      to: email,
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
        selectedPatients,
      }),
    },
  });
};

const createClientMessage = ({
  messageTemplate,
  client,
  reason,
  patients,
  displayName,
  phoneNumber,
  email,
  requestedDateTime,
  location,
  address,
  selectedStaff,
  selectedPatients,
}: any): any => {
  if (messageTemplate === "email") {
    let allPatients = "";
    selectedPatients.forEach((selectedPatient: any) => {
      patients.map((patient: any) => {
        if (selectedPatient === patient?.id)
          allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${
            patient?.name
          }</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${
            patient?.gender
          }</p><p><b>Minor Illness:</b> ${
            patient?.hasMinorIllness
              ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
                  patient?.illnessDetails?.notes
                }`
              : " NONE"
          }</p><p><b>-----------------------------------</b></p>`;
      });
    });
    const message = `<p>Hi ${getClientFirstNameFromDisplayName(
      client?.displayName
    )},</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request bellow and let us know (by replying to this email) if anything needs to be changed.</p><p></p>${
      displayName ? `<p><b>Name:</b> ${displayName}</p>` : ""
    }<p><b>Email:</b> ${email}</p>${
      phoneNumber
        ? `<p><b>Phone:</b> <a href="tel://${phoneNumber}">${formatPhoneNumber(
            phoneNumber?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }${allPatients}
    ${reason ? `<p><b>Reason:</b> ${reason.label}</p>` : ""}
    ${
      requestedDateTime?.date
        ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
            requestedDateTime.date
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
    }<p></p><p>We look forward to seeing you soon!</p><p>- The MoVET Team</p>`;

    return {
      subject: "We have received your appointment request!",
      message,
    };
  } else {
    const patientNames: any = [];
    selectedPatients.forEach((selectedPatient: any) => {
      patients.map((patient: any) => {
        if (selectedPatient === patient?.id) patientNames.push(patient?.name);
      });
    });
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
            text: JSON.stringify(patientNames),
          },
          {
            type: "mrkdwn",
            text: "*Selected Staff:*",
          },
          {
            type: "plain_text",
            text: selectedStaff
              ? `${selectedStaff?.title} ${selectedStaff?.firstName} ${selectedStaff?.lastName}`
              : "None Selected",
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
                  requestedDateTime?.date ? `${requestedDateTime?.date}` : ""
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
