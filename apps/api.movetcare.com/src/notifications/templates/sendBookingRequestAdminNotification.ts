import { throwError } from "../../config/config";
// import { formatDateToMMDDYY } from "../../utils/formatDateToMMDDYYY";
import { formatPhoneNumber } from "../../utils/formatPhoneNumber";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
import { getYYMMDDFromString } from "../../utils/getYYMMDDFromString";
import { sendNotification } from "../sendNotification";
const DEBUG = true;
export const sendBookingRequestAdminNotification = async ({
  id,
  bookingRef,
}: {
  id: string;
  bookingRef: any;
}) => {
  const { client }: any = await bookingRef
    .get()
    .then((doc: any) => doc.data())
    .catch((error: any) => throwError(error));
  const { email, displayName, phone, isExistingClient } = client;
  //if (!email?.toLowerCase()?.includes("+test")) {
  if (isExistingClient) {
    const {
      createdAt,
      patients,
      reason,
      selectedPatients,
      requestedDateTime,
      location,
      address,
      selectedStaff,
    }: any = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch((error: any) => throwError(error));
    let allPatients = "";
    selectedPatients.forEach((selectedPatient: any) => {
      patients.map((patient: any) => {
        if (selectedPatient === patient?.id) {
          if (DEBUG) console.log("selected patient", patient);
          allPatients += `<p><b>------------- PATIENT -------------</b></p><p><b>Name:</b> ${
            patient?.name
          }</p><p><b>Species:</b> ${patient?.species}</p><p><b>Gender:</b> ${
            patient?.gender
          }</p>${
            patient?.illnessDetails
              ? `<p><b>Minor Illness:</b> ${
                  patient?.illnessDetails
                    ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
                        patient?.illnessDetails?.notes
                      }`
                    : " None"
                }</p>`
              : ""
          }${
            patient.aggressionStatus
              ? `<p><b>Aggression Status:</b> "${
                  patient?.aggressionStatus
                    ? "IS AGGRESSIVE!"
                    : "Is not aggressive" ||
                      // eslint-disable-next-line quotes
                      'UNKNOWN - Update "Is Aggressive" custom field on patient\'s profile in ProVet!'
                } "</p>`
              : ""
          }${
            patient.vcprRequired
              ? `<p><b>VCPR Required:</b> ${
                  patient?.vcprRequired ? "Yes" : "No"
                }</p>`
              : ""
          }<p></p><p></p>`;
        }
      });
    });

    let petInfoText: string | null = null;
    selectedPatients.forEach((selectedPatient: any) => {
      patients.map((patient: any) => {
        if (selectedPatient === patient?.id) {
          if (DEBUG) console.log("selected patient", patient);
          petInfoText += `\n\nName: ${patient?.name}\nSpecies: ${
            patient?.species
          }\nGender: ${patient?.gender}\n${
            patient?.illnessDetails
              ? `Minor Illness: ${
                  patient?.illnessDetails
                    ? `${JSON.stringify(patient?.illnessDetails?.symptoms)} - ${
                        patient?.illnessDetails?.notes
                      }`
                    : " None"
                }`
              : ""
          }\n${
            patient.aggressionStatus
              ? `Aggression Status: "${
                  patient?.aggressionStatus
                    ? "IS AGGRESSIVE!"
                    : "Is not aggressive" ||
                      // eslint-disable-next-line quotes
                      'UNKNOWN - Update "Is Aggressive" custom field on patient\'s profile in ProVet!'
                } "`
              : ""
          }\n${
            patient.vcprRequired
              ? `VCPR Required: ${patient?.vcprRequired ? "Yes" : "No"}`
              : ""
          }`;
        }
      });
    });
    const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
      ?.toDate()
      ?.toString()}</p>${
      displayName
        ? `<p><b>Client Name:</b> ${getClientFirstNameFromDisplayName(
            displayName
          )}</p>`
        : ""
    }<p><b>Client Email:</b> ${email}</p>${
      phone
        ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }${
      Array.isArray(patients) && Array.isArray(selectedPatients)
        ? allPatients
        : ""
    }<p><b>---------------------------------</b></p>
  ${
    reason
      ? `<p><b>Reason:</b> ${reason.label}</p>`
      : "<p><b>Reason:</b> Establish Care Exam</p>"
  }${
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
    }`;
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        replyTo: email,
        subject: `MoVET | Appointment Request for ${selectedPatients.map(
          (selectedPatient: any) =>
            patients.map((patient: any) => {
              if (selectedPatient === patient?.id) {
                return patient?.name;
              }
            })
        )}`,
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
                text: `${client?.firstName} ${client?.lastName} - ${client?.email} (${client?.uid})`,
              },
              {
                type: "mrkdwn",
                text: "*Patients*",
              },
              {
                type: "plain_text",
                text: petInfoText,
              },
              {
                type: "mrkdwn",
                text: "*Reason*",
              },
              {
                type: "plain_text",
                text: `${
                  reason && reason?.label
                    ? `${reason?.label}`
                    : "Establish Care"
                }`,
              },
              {
                type: "mrkdwn",
                text: "*Location*",
              },
              {
                type: "plain_text",
                text: `${location} ${
                  address ? `- ${address?.full} (${address?.info})` : ""
                }`,
              },
              {
                type: "mrkdwn",
                text: "*Requested Time & Date*",
              },
              {
                type: "plain_text",
                text: `${requestedDateTime.time} on ${getYYMMDDFromString(
                  requestedDateTime.date
                )}`,
              },
            ],
          },
        ],
      },
    });
  } else {
    if (DEBUG) console.log("Sending ADMIN Appointment Request for New Client");
    const {
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      id,
      firstName,
      lastName,
      email,
      phone,
      createdAt,
    }: any = await bookingRef
      .get()
      .then((doc: any) => doc.data())
      .catch((error: any) => throwError(error));
    const message = `<p><b>Session ID:</b> ${id}</p><p><b>Started At:</b> ${createdAt
      ?.toDate()
      ?.toString()}</p>${
      firstName ? `<p><b>Client Name:</b> ${firstName} ${lastName}</p>` : ""
    }<p><b>Client Email:</b> ${email}</p>${
      phone
        ? `<p><b>Client Phone:</b> <a href="tel://${phone}">${formatPhoneNumber(
            phone?.replaceAll("+1", "")
          )}</a></p>`
        : ""
    }
    ${numberOfPets ? `<p><b>Number of Pets:</b> ${numberOfPets}</p>` : ""}
    ${
      numberOfPetsWithMinorIllness
        ? `<p><b>Pets w/ Minor Illness:</b> ${numberOfPetsWithMinorIllness}</p>`
        : ""
    }
    ${notes && notes !== "" ? `<p><b>Pet Notes:</b> ${notes}</p>` : ""}
    ${locationType ? `<p><b>Requested Location:</b> ${locationType}</p>` : ""}
  ${
    selectedDate
      ? `<p><b>Requested Date:</b> ${new Date(
          selectedDate
        ).toLocaleDateString()}</p>`
      : ""
  }${selectedTime ? `<p><b>Requested Time:</b> ${selectedTime}</p>` : ""}${
      selectedTime === "Specific Time Preference" && specificTime !== ""
        ? `<p><b>Specific Time Requested:</b> ${specificTime}</p>`
        : ""
    }`;
    sendNotification({
      type: "email",
      payload: {
        to: "info@movetcare.com",
        replyTo: email,
        subject: `MoVET | Appointment Request for ${
          firstName && lastName ? firstName + " " + lastName : email
        }`,
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
                text: `${new Date(
                  selectedDate
                ).toLocaleDateString()} - ${selectedTime} ${
                  specificTime ? `(${specificTime})` : ""
                }`,
              },
            ],
          },
        ],
      },
    });
    //    }
  }
};
