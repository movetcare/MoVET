import { sendNotification } from "./../sendNotification";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import { admin, environment, throwError } from "../../config/config";
import { getAuthUserById } from "../../utils/auth/getAuthUserById";
import { getDateStringFromDate } from "../../utils/getDateStringFromDate";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { EmailConfiguration } from "../../types/email.d";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
const DEBUG = environment.type === "production";
export const sendAppointmentConfirmationEmail = async (
  clientId: string,
  appointmentId: string
): Promise<void> => {
  if (DEBUG)
    console.log(
      `sendAppointmentConfirmationEmail -> clientId: ${clientId}, appointmentId: ${appointmentId}`
    );

  const { email, displayName, phoneNumber } = await getAuthUserById(clientId, [
    "email",
    "displayName",
    "phoneNumber",
  ]);

  if (DEBUG) {
    console.log("email -> ", email);
    console.log("displayName -> ", displayName);
    console.log("phoneNumber -> ", phoneNumber);
  }

  const appointment = await admin
    .firestore()
    .collection("appointments")
    .doc(appointmentId)
    .get()
    .then((appointment: any) => appointment.data())
    .catch((error: any) => throwError(error));

  if (DEBUG) console.log("appointment -> ", appointment);

  const wasCreatedInProvet = getProVetIdFromUrl(appointment?.reason) !== null;

  let petNames = null;
  if (wasCreatedInProvet)
    petNames = appointment?.patients.map((patient: any) =>
      `<li>${patient?.name}</li>`.replace(",", "")
    );
  else
    petNames = appointment?.patients.map((patient: any) =>
      `<li>${patient?.name}${
        patient?.minorIllness !== undefined &&
        patient?.minorIllness !== "No Symptoms of Illness"
          ? `${
              Array.isArray(patient?.minorIllness)
                ? `  is showing symptoms of ${JSON.parse(
                    patient?.minorIllness
                  ).map((symptoms: any) => {
                    if (symptoms?.id === patient?.id)
                      return `${symptoms?.minorIllness.toLowerCase()} - "${
                        symptoms?.other
                      }"`;
                    else return;
                  })}`
                : " - " + patient?.minorIllness
            }`
          : (patient?.minorIllness &&
              patient?.minorIllness === "No Symptoms of Illness") ||
            patient?.minorIllness === undefined
          ? " needs a general checkup"
          : ` is showing symptoms of ${patient?.minorIllness.toLowerCase()} - "${
              patient?.other
            }"`
      }</li>`.replace(",", "")
    );

  if (DEBUG) console.log("petNames -> ", petNames);

  let reason: any = null;
  if (wasCreatedInProvet) {
    reason = await fetchEntity(
      "reason",
      getProVetIdFromUrl(appointment?.reason)
    );
    if (DEBUG) console.log("reason", reason);
  }
  let clientProvetRecord: any;
  // 'Unknown - Please contact us to let us know where we will be conducting the appointment.';
  if (!appointment?.locationType)
    clientProvetRecord = await fetchEntity("client", parseInt(clientId));
  const emailTextClient = `${
    displayName
      ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
      : ""
  }<p>Thank you for reaching out to MoVET!</p><p>We see you have scheduled a new appointment for:</p><ul>${petNames}</ul>${
    wasCreatedInProvet && reason
      ? `<p><b>Reason:</b> ${reason?.name || reason}</p>`
      : ""
  }<p><b><i>Please confirm we have the right information:</i></b></p>
  ${
    appointment?.locationType === "Home" && appointment?.address
      ? `<p><b>Appointment Location</b>: ${appointment?.address}</p>`
      : appointment?.locationType === "Virtually"
      ? "<p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
      : appointment?.user === 8
      ? `<p><b>Appointment Location</b>: Housecall${
          clientProvetRecord?.street_address
            ? ` - ${clientProvetRecord?.street_address} `
            : " - Address Unknown! <b>Please reply to this email with your address!</b>"
        }${clientProvetRecord?.city ? `${clientProvetRecord?.city}, ` : ""}${
          clientProvetRecord?.state ? `${clientProvetRecord?.state} ` : ""
        }${
          clientProvetRecord?.zip_code ? `${clientProvetRecord?.zip_code}` : ""
        }`
      : appointment?.user === 7
      ? // eslint-disable-next-line quotes
        '<p><b>Appointment Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
      : "<p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
  }${
    appointment?.start
      ? `<p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
          appointment?.start.toDate()
        )}`
      : ""
  }${
    appointment?.instructions
      ? `<p><b>Instructions: </b>${appointment?.instructions}</p>`
      : // eslint-disable-next-line quotes
        '<p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
  }${
    phoneNumber &&
    (appointment?.locationType === "Home" ||
      appointment?.locationType === "Virtually")
      ? `<p><b>Contact Phone Number</b>: ${phoneNumber}</p><p>*Please keep your phone handy the day of the ${
          appointment?.locationType === "Virtually"
            ? "consultation."
            : "appointment. We will text you when we are on our way.</p>"
        }`
      : ""
  }${
    appointment?.locationType === "Home"
      ? "<p><b>Home Visit Trip Fee</b>: $60</p><p><b>*Additional charges will apply for add-on diagnostics, medications, pampering, etc.</b></p><p><i>A $60 cancellation fee will be charged if cancellation occurs within 24 hours of your appointment</i></p>"
      : ""
  }<p><b>Waiver:</b> Please complete this form prior to your appointment: <a href="https://docs.google.com/forms/d/1ZrbaOEzckSNNS1fk2PATocViVFTkVwcyF_fZBlCrTkY/">MoVET's Waiver / Release form</a> (If you have completed a waiver/release for this pet in the past, then a new one is not necessary.)</p><p>Please be sure to reply to this email if you have any questions or need to make changes to your scheduled appointment.
  </p><p>Looking forward to meeting you,</p><p>- <a href="https://www.instagram.com/drlexiabramson/">Dr. A</a>, <a href="https://www.instagram.com/nessie_themovetpup/">Nessie</a>, and the <a href="https://www.facebook.com/MOVETCARE/">MoVET Team</a></p>`;

  const emailText = `<p>New Appointment Scheduled:</p><p><b>Client</b>: <a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">${
    email ? email : ""
  }${phoneNumber ? ` - ${phoneNumber}` : ""}</a></p><ul>${petNames}</ul>${
    wasCreatedInProvet && reason
      ? `<p><b>Reason:</b> ${reason?.name || reason}</p>`
      : ""
  }
${
  appointment?.locationType === "Home" && appointment?.address
    ? `<p><b>Appointment Location</b>: ${appointment?.address}</p>`
    : appointment?.locationType === "Virtually"
    ? "<p><b>Appointment Location</b>: Virtual</p>"
    : appointment?.user === 8
    ? `<p><b>Appointment Location</b>: Housecall${
        clientProvetRecord?.street_address
          ? ` - ${clientProvetRecord?.street_address} `
          : " - Address Unknown! <b>Please reply to this email with your address!</b>"
      }${clientProvetRecord?.city ? `${clientProvetRecord?.city}, ` : ""}${
        clientProvetRecord?.state ? `${clientProvetRecord?.state} ` : ""
      }${clientProvetRecord?.zip_code ? `${clientProvetRecord?.zip_code}` : ""}`
    : appointment?.user === 7
    ? // eslint-disable-next-line quotes
      "<p><b>Appointment Location</b>: MoVET Clinic @ Belleview Station</a></p>"
    : appointment?.user === 9
    ? "<p><b>Appointment Location</b>: Virtual Appointment</p>"
    : "<p><b>Appointment Location</b>: Walk In Appointment</p>"
}${
    appointment?.start
      ? `<p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
          appointment?.start?.toDate()
        )}`
      : ""
  }<p></p><p><b><a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">EDIT APPOINTMENT</a></b></p>`;
  // ${
  //   appointment?.instructions
  //     ? `<p><b>Instructions: </b>${appointment?.instructions}</p>`
  //     : // eslint-disable-next-line quotes
  //       '<p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
  // }${
  //   phoneNumber &&
  //   (appointment?.locationType === "Home" ||
  //     appointment?.locationType === "Virtually")
  //     ? `<p><b>Contact Phone Number</b>: ${phoneNumber}</p>'
  //       }`
  //     : ""
  // }`;

  if (DEBUG) {
    console.log("emailTextClient -> ", emailTextClient);
    console.log("emailText -> ", emailText);
    console.log("htmlText -> ", emailText.replace(/(<([^>]+)>)/gi, ""));
  }

  const emailConfigClient: EmailConfiguration = {
    to: email,
    subject: `Your Upcoming Appointment with MoVET - ${
      appointment?.start
        ? getDateStringFromDate(appointment?.start?.toDate())
        : ""
    }`,
    message: emailTextClient,
  };
  sendNotification({
    type: "email",
    payload: {
      ...emailConfigClient,
      client: clientId,
    },
  });
  const emailConfigAdmin: EmailConfiguration = {
    to: "info@movetcare.com",
    subject: `ADMIN ALERT - CLIENT APPOINTMENT - ${
      appointment?.start
        ? getDateStringFromDate(appointment?.start?.toDate())
        : ""
    }`,
    message: emailText,
  };
  sendNotification({
    type: "email",
    payload: {
      ...emailConfigAdmin,
      client: clientId,
    },
  });
};
