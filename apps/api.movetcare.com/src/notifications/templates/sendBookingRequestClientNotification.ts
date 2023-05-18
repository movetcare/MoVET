import { throwError } from "../../config/config";
import { createProVetNote } from "../../integrations/provet/entities/note/createProVetNote";
// import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";
import { sendNotification } from "../sendNotification";
const DEBUG = true;
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
  const { email, displayName, phone, uid, isExistingClient } = client;
  //if (!email?.toLowerCase()?.includes("+test")) {
  if (isExistingClient) {
    const createClientMessage = ({
      messageTemplate,
      client,
      reason,
      patients,
      displayName,
      phone,
      email,
      requestedDateTime,
      location,
      address,
      selectedStaff,
      selectedPatients,
      id,
    }: any): any => {
      if (messageTemplate === "email") {
        let allPatients = "";
        selectedPatients.forEach((selectedPatient: any) => {
          patients.map((patient: any) => {
            if (selectedPatient === patient?.id)
              allPatients += `<p><b>-------------- PET ----------------</b></p><p><b>Name:</b> ${
                patient?.name
              }</p><p><b>Species:</b> ${
                patient?.species
              }</p><p><b>Gender:</b> ${patient?.gender}</p>${
                patient?.illnessDetails
                  ? `<p><b>Minor Illness:</b> ${
                      patient?.illnessDetails
                        ? `${JSON.stringify(
                            patient?.illnessDetails?.symptoms
                          )} - ${patient?.illnessDetails?.notes}`
                        : " None"
                    }</p>`
                  : ""
              }<p></p><p></p>`;
          });
        });

        const message = `<p>Hi ${
          client?.firstName
        },</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request below and let us know (by replying to this email) if anything needs to be changed.</p><p><b>---------- CONTACT INFO -----------</b></p>${
          displayName ? `<p><b>Name:</b> ${displayName}</p>` : ""
        }<p><b>Email:</b> ${email}</p>${
          phone
            ? `<p><b>Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
                phone?.replaceAll("+1", "")
              )}</a></p>`
            : ""
        }${allPatients}
    <p><b>--------- DETAILS ----------</b></p>
    ${
      reason
        ? `<p><b>Reason:</b> ${reason.label}</p>`
        : "<p><b>Reason:</b> Establish Care Exam</p>"
    }
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
            if (selectedPatient === patient?.id)
              patientNames.push(patient?.name);
          });
        });
        return [
          {
            type: "section",
            text: {
              text: `:exclamation: _New Appointment Request_ - ${id}:exclamation:`,
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
                text: "*Reason*",
              },
              {
                type: "plain_text",
                text: reason?.label ? reason?.label : "Establish Care Exam",
              },
              {
                type: "mrkdwn",
                text: "*Location:*",
              },
              {
                type: "plain_text",
                text:
                  location +
                  ` ${address ? `- ${address.full}` : ""} ${
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
                        ? `${getYYMMDDFromString(requestedDateTime?.date)}`
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
        ];
      }
    };
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
      phone,
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
          phone,
          email,
          requestedDateTime,
          location,
          address,
          selectedStaff,
          selectedPatients,
        }),
      },
    });
  } else {
    if (DEBUG) console.log("Sending CLIENT Appointment Request for New Client");
    const {
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      email,
      firstName,
      lastName,
      phone,
      id,
    }: any = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch((error: any) => throwError(error));
    const message = `<p>Hi ${firstName},</p><p>Thank you for submitting an appointment request with MoVET!</p><p>Please allow 1 business day for a response. All appointment requests are responded to in the order they are received.</p><p>You will hear from us. We promise. We are working hard to give everyone the same service we are known for and can't wait to give you the love and attention you deserve!</p><p>Please be sure to review your appointment request below and let us know (by replying to this email) if anything needs to be changed.</p><p><b>---------- CONTACT INFO -----------</b></p>${
      firstName && lastName
        ? `<p><b>Name:</b> ${firstName} ${lastName}</p>`
        : ""
    }<p><b>Client Email:</b> ${email}</p>${
      phone
        ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }
       <p><b>---------- PET INFO -----------</b></p>
    ${numberOfPets ? `<p><b>Number of Pets:</b> ${numberOfPets}</p>` : ""}
    ${
      numberOfPetsWithMinorIllness
        ? `<p><b>Pets w/ Minor Illness:</b> ${numberOfPetsWithMinorIllness}</p>`
        : ""
    }
    ${notes && notes !== "" ? `<p><b>Pet Notes:</b> ${notes}</p>` : ""}
    <p><b>---------- REQUESTED LOCATION & TIME -----------</b></p>
    ${locationType ? `<p><b>Requested Location:</b> ${locationType}</p>` : ""}
  ${
    selectedDate
      ? `<p><b>Requested Date:</b> ${getYYMMDDFromString(
          new Date(selectedDate)?.toString()
        )}</p>`
      : ""
  }${selectedTime ? `<p><b>Requested Time:</b> ${selectedTime}</p>` : ""}${
      selectedTime === "Specific Time Preference" && specificTime !== ""
        ? `<p><b>Specific Time Requested:</b> ${specificTime}</p>`
        : ""
    }`;
    sendNotification({
      type: "email",
      payload: {
        client: client?.uid,
        to: email,
        replyTo: "info@movetcare.com",
        subject: "We have received your appointment request!",
        message,
      },
    });
    sendNotification({
      type: "slack",
      payload: {
        message: [
          {
            type: "section",
            text: {
              text: `:exclamation: New Appointment Request - ${id} :exclamation:\n\n${id}`,
              type: "mrkdwn",
            },
            fields: [
              {
                type: "mrkdwn",
                text: "*Client*",
              },
              {
                type: "plain_text",
                text:
                  firstName + " " + lastName + " - " + email + " - " + phone,
              },
              {
                type: "mrkdwn",
                text: "*Patients*",
              },
              {
                type: "plain_text",
                text:
                  numberOfPets +
                  ` pets (${numberOfPetsWithMinorIllness} w/ minor illness)`,
              },
              {
                type: "mrkdwn",
                text: "*Pet Notes*",
              },
              {
                type: "plain_text",
                text: notes.length > 0 ? notes : "None",
              },
              {
                type: "mrkdwn",
                text: "*Location*",
              },
              {
                type: "plain_text",
                text: locationType,
              },
              {
                type: "mrkdwn",
                text: "*Requested Time & Date*",
              },
              {
                type: "plain_text",
                text: `${getYYMMDDFromString(
                  new Date(selectedDate)?.toString()
                )} - ${selectedTime} ${
                  specificTime ? `(${specificTime})` : ""
                }`,
              },
            ],
          },
        ],
      },
    });
  }
  //  }
};
