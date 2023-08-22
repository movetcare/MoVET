import { sendNotification } from "./../sendNotification";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import { admin, throwError } from "../../config/config";
import { getAuthUserById } from "../../utils/auth/getAuthUserById";
import { getDateStringFromDate } from "../../utils/getDateStringFromDate";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { EmailConfiguration } from "../../types/email.d";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
const DEBUG = true;
export const sendAppointmentConfirmationEmail = async (
  clientId: string,
  appointmentId: string,
): Promise<void> => {
  if (DEBUG)
    console.log(
      `sendAppointmentConfirmationEmail -> clientId: ${clientId}, appointmentId: ${appointmentId}`,
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

  const isNewFlow = appointment?.user ? false : true;

  let petNames = null;
  if (isNewFlow) {
    const patientRecords: any = [];
    await Promise.all(
      appointment?.patients.map(
        async (patientId: string) =>
          await admin
            .firestore()
            .collection("patients")
            .doc(`${patientId}`)
            .get()
            .then((patient: any) => patientRecords.push(patient.data()))
            .catch((error: any) => throwError(error)),
      ),
    );
    petNames = patientRecords?.map((patient: any) =>
      `<li>${patient?.name}</li>`.replace(",", ""),
    );
  } else
    petNames = appointment?.patients.map((patient: any) =>
      `<li>${patient?.name}${
        patient?.minorIllness !== undefined &&
        patient?.minorIllness !== "No Symptoms of Illness"
          ? `${
              Array.isArray(patient?.minorIllness)
                ? `  is showing symptoms of ${JSON.parse(
                    patient?.minorIllness,
                  ).map((symptoms: any) => {
                    if (symptoms?.id === patient?.id)
                      return `${symptoms?.minorIllness.toLowerCase()} - "${symptoms?.other}"`;
                    else return;
                  })}`
                : " - " + patient?.minorIllness
            }`
          : (patient?.minorIllness &&
              patient?.minorIllness === "No Symptoms of Illness") ||
            patient?.minorIllness === undefined
          ? " needs a general checkup"
          : ` is showing symptoms of ${patient?.minorIllness.toLowerCase()} - "${patient?.other}"`
      }</li>`.replace(",", ""),
    );

  if (DEBUG) console.log("petNames -> ", petNames);
  let reason: any = null;
  if (isNewFlow) {
    reason = await fetchEntity(
      "reason",
      getProVetIdFromUrl(appointment?.reason),
    );
    if (DEBUG) console.log("reason", reason);
  }
  let clientProvetRecord: any;
  if (!appointment?.locationType)
    clientProvetRecord = await fetchEntity("client", parseInt(clientId));

  let emailTextClient,
    emailText = "";
  const vcprRequired = await admin
    .firestore()
    .collection("patients")
    .doc(`${appointment?.patients[0]?.id}`)
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("VCPR REQUIRED PATIENT DOC -> ", doc?.data());
      return doc?.data()?.vcprRequired;
    })
    .catch((error: any) => throwError(error));
  if (isNewFlow) {
    if (DEBUG) console.log("SENDING NEW FLOW EMAIL TEMPLATE");
    const appointmentAddress = appointment?.notes
      ?.split("-")[1]
      ?.split("|")[0]
      ?.trim();
    if (DEBUG) {
      console.log("appointmentAddress", appointmentAddress);
      console.log("vcprRequired", vcprRequired);
    }
    emailTextClient = `${
      displayName
        ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
        : ""
    }<p>Thank you for reaching out to MoVET!</p><p>We see you have scheduled a new appointment for:</p><ul>${petNames}</ul>${
      reason ? `<p><b>Reason:</b> ${reason?.name || reason}</p>` : ""
    }<p></p><p><b><i>Please confirm we have the right information:</i></b></p>
  ${
    appointment?.locationType === "Home" && appointmentAddress
      ? `<p></p><p><b>Appointment Location</b>: ${appointmentAddress}</p>`
      : appointment?.locationType === "Virtually"
      ? "<p></p><p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
      : appointment?.locationType === "Clinic"
      ? // eslint-disable-next-line quotes
        '<p></p><p><b>Appointment Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
      : "<p></p><p><b>Appointment Location</b>: Walk In Appointment</p>"
  }${
    appointment?.start
      ? `<p></p><p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
          appointment?.start.toDate(),
        )}`
      : ""
  }${
    appointment?.instructions !== undefined &&
    `<p></p><p><b>Instructions: </b>${appointment?.instructions}</p>`
  }
  ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        '<p></p><p><b>Medical Records:</b> Please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
      : ""
  }${
    phoneNumber &&
    (appointment?.locationType === "Home" ||
      appointment?.locationType === "Virtually")
      ? `<p></p><p><b>Contact Phone Number</b>: ${phoneNumber}</p><p>*Please keep your phone handy the day of the ${
          appointment?.locationType === "Virtually"
            ? "consultation."
            : "appointment. We will text you when we are on our way.</p>"
        }`
      : ""
  }${
    appointment?.locationType === "Home"
      ? "<p></p><p><b>Home Visit Trip Fee</b>: $60</p><p><b>*Additional charges will apply for add-on diagnostics, medications, pampering, etc.</b></p><p><i>A $60 cancellation fee will be charged if cancellation occurs within 24 hours of your appointment</i></p>"
      : "" // TODO: Convert waiver text to be conditional based on VCPR status - If VCPR is not established, then include waiver text.
  } ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        `<p></p><p><b>Waiver:</b> Please complete this form prior to your appointment: <a href="https://docs.google.com/forms/d/1ZrbaOEzckSNNS1fk2PATocViVFTkVwcyF_fZBlCrTkY/">MoVET's Waiver / Release form</a> (If you have completed a waiver/release for this pet in the past, then a new one is not necessary.)</p><p></p><p>Please be sure to reply to this email if you have any questions or need to make changes to your scheduled appointment.`
      : ""
  }
  </p><p></p><p>Looking forward to meeting you,</p><p>- <a href="https://www.instagram.com/drlexiabramson/">Dr. A</a>, <a href="https://www.instagram.com/nessie_themovetpup/">Nessie</a>, and the <a href="https://www.facebook.com/MOVETCARE/">MoVET Team</a></p>`;

    emailText = `<p>New Appointment Scheduled:</p><p><b>Client</b>: <a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">${
      email ? email : ""
    }${phoneNumber ? ` - ${phoneNumber}` : ""}</a></p><ul>${petNames}</ul>${
      reason ? `<p><b>Reason:</b> ${reason?.name || reason}</p>` : ""
    }<p></p><p><b><i>Appointment Details:</i></b></p>
  ${
    appointment?.locationType === "Home" && appointmentAddress
      ? `<p></p><p><b>Appointment Location</b>: ${appointmentAddress}</p>`
      : appointment?.locationType === "Virtually"
      ? "<p></p><p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
      : appointment?.locationType === "Clinic"
      ? // eslint-disable-next-line quotes
        '<p></p><p><b>Appointment Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
      : "<p></p><p><b>Appointment Location</b>: Walk In Appointment</p>"
  }${
    appointment?.start
      ? `<p></p><p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
          appointment?.start.toDate(),
        )}`
      : ""
  }${
    appointment?.instructions &&
    `<p></p><p><b>Instructions: </b>${appointment?.instructions}</p>`
  }
  ${
    vcprRequired
      ? // eslint-disable-next-line quotes
        "<p></p><p><b>Medical Records:</b> Waiting on Client to email medical records from previous provider.</p>"
      : ""
  }${
    vcprRequired
      ? "<p></p><p><b>Waiver:</b> Required"
      : "<p></p><p><b>Waiver:</b> Not Required"
  }<p></p><p></p><p><b><a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">EDIT APPOINTMENT</a></b></p>`;
  } else {
    emailTextClient = `${
      displayName
        ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
        : ""
    }<p>Thank you for reaching out to MoVET!</p><p>We see you have scheduled a new appointment for:</p><ul>${petNames}</ul>${
      isNewFlow && reason
        ? `<p><b>Reason:</b> ${reason?.name || reason}</p>`
        : ""
    }<p></p><p><b><i>Please confirm we have the right information:</i></b></p>
  ${
    appointment?.locationType === "Home" && appointment?.address
      ? `<p></p><p><b>Appointment Location</b>: ${appointment?.address}</p>`
      : appointment?.locationType === "Virtually"
      ? "<p></p><p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
      : appointment?.user === 8
      ? `<p></p><p><b>Appointment Location</b>: Housecall${
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
        '<p></p><p><b>Appointment Location</b>: MoVET Clinic @ <a href="https://goo.gl/maps/GxPDfsCfdXhbmZVe9" target="_blank">4912 S Newport St Denver, CO 80237</a></p>'
      : appointment?.user === 9
      ? "<p></p><p><b>Appointment Location</b>: Virtual - We will send you a link to the virtual meeting room on the day of your appointment.</p>"
      : "<p></p><p><b>Appointment Location</b>: Walk In Appointment</p>"
  }${
    appointment?.start
      ? `<p></p><p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
          appointment?.start.toDate(),
        )}`
      : ""
  }${
    appointment?.instructions
      ? `<p></p><p><b>Instructions: </b>${appointment?.instructions}</p>`
      : // eslint-disable-next-line quotes
        '<p></p><p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
  }${
    phoneNumber &&
    (appointment?.locationType === "Home" ||
      appointment?.locationType === "Virtually")
      ? `<p></p><p><b>Contact Phone Number</b>: ${phoneNumber}</p><p>*Please keep your phone handy the day of the ${
          appointment?.locationType === "Virtually"
            ? "consultation."
            : "appointment. We will text you when we are on our way.</p>"
        }`
      : ""
  }${
    appointment?.locationType === "Home"
      ? "<p></p><p><b>Home Visit Trip Fee</b>: $60</p><p><b>*Additional charges will apply for add-on diagnostics, medications, pampering, etc.</b></p><p><i>A $60 cancellation fee will be charged if cancellation occurs within 24 hours of your appointment</i></p>"
      : "" // TODO: Convert waiver text to be conditional based on VCPR status - If VCPR is not established, then include waiver text.
  }${
    vcprRequired
      ? `<p></p><p><b>Waiver:</b> Please complete this form prior to your appointment: <a href="https://docs.google.com/forms/d/1ZrbaOEzckSNNS1fk2PATocViVFTkVwcyF_fZBlCrTkY/">MoVET's Waiver / Release form</a> (If you have completed a waiver/release for this pet in the past, then a new one is not necessary.)</p><p></p><p>Please be sure to reply to this email if you have any questions or need to make changes to your scheduled appointment.
  </p>`
      : ""
  }<p></p><p>Looking forward to meeting you,</p><p>- <a href="https://www.instagram.com/drlexiabramson/">Dr. A</a>, <a href="https://www.instagram.com/nessie_themovetpup/">Nessie</a>, and the <a href="https://www.facebook.com/MOVETCARE/">MoVET Team</a></p>`;

    emailText = `<p>New Appointment Scheduled:</p><p><b>Client</b>: <a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">${
      email ? email : ""
    }${phoneNumber ? ` - ${phoneNumber}` : ""}</a></p><ul>${petNames}</ul>${
      isNewFlow && reason
        ? `<p></p><p><b>Reason:</b> ${reason?.name || reason}</p>`
        : ""
    }
${
  appointment?.locationType === "Home" && appointment?.address
    ? `<p></p><p><b>Appointment Location</b>: ${appointment?.address}</p>`
    : appointment?.locationType === "Virtually"
    ? "<p></p><p><b>Appointment Location</b>: Virtual</p>"
    : appointment?.user === 8
    ? `<p></p><p><b>Appointment Location</b>: Housecall${
        clientProvetRecord?.street_address
          ? ` - ${clientProvetRecord?.street_address} `
          : " - Address Unknown! <b>Please reply to this email with your address!</b>"
      }${clientProvetRecord?.city ? `${clientProvetRecord?.city}, ` : ""}${
        clientProvetRecord?.state ? `${clientProvetRecord?.state} ` : ""
      }${clientProvetRecord?.zip_code ? `${clientProvetRecord?.zip_code}` : ""}`
    : appointment?.user === 7
    ? // eslint-disable-next-line quotes
      "<p></p><p><b>Appointment Location</b>: MoVET Clinic @ Belleview Station</a></p>"
    : appointment?.user === 9
    ? "<p></p><p><b>Appointment Location</b>: Virtual Appointment</p>"
    : "<p></p><p><b>Appointment Location</b>: Walk In Appointment</p>"
}${
      appointment?.start
        ? `<p></p><p><b>Appointment Date & Time</b>: ${getDateStringFromDate(
            appointment?.start?.toDate(),
          )}`
        : ""
    }<p></p><p></p><p><b><a href="https://us.provetcloud.com/4285/client/${clientId}/tabs/" target="_blank">EDIT APPOINTMENT</a></b></p>
    ${
      appointment?.instructions
        ? `<p><b>Instructions: </b>${appointment?.instructions}</p>`
        : // eslint-disable-next-line quotes
          '<p><b>Medical Records:</b> If this appointment is for a new pet, please email (or have your previous vet email) their vaccine and medical records to <a href="mailto://info@movetcare.com" target="_blank">info@movetcare.com</a> <b>prior</b> to your appointment.</p>'
    }${
      phoneNumber &&
      (appointment?.locationType === "Home" ||
        appointment?.locationType === "Virtually")
        ? `<p><b>Contact Phone Number</b>: ${phoneNumber}</p>'
          }`
        : ""
    }`;
  }
  if (DEBUG) {
    console.log("emailTextClient -> ", emailTextClient);
    console.log("emailText -> ", emailText);
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
    subject: `NEW CLIENT APPOINTMENT SCHEDULED - ${
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
