import { DEBUG, admin, throwError } from "../../config/config";
import { EmailConfiguration } from "../../types/email.d";
import { getAuthUserById } from "../../utils/auth/getAuthUserById";
import { getClientFirstNameFromDisplayName } from "../../utils/getClientFirstNameFromDisplayName";
import { getDateStringFromDate } from "../../utils/getDateStringFromDate";
import { sendNotification } from "../sendNotification";

export const sendCancellationEmail = async (
  clientId: string,
  appointmentId: string
): Promise<void> => {
  if (DEBUG)
    console.log(
      `sendCancellationEmail -> clientId: ${clientId}, appointmentId: ${appointmentId}`
    );

  const { email, displayName } = await getAuthUserById(clientId, [
    "email",
    "displayName",
  ]);

  if (DEBUG) {
    console.log("email -> ", email);
    console.log("displayName -> ", displayName);
  }
  if (!email?.toLowerCase()?.includes("+test")) {
    const appointment = await admin
      .firestore()
      .collection("appointments")
      .doc(appointmentId)
      .get()
      .then((appointment: any) => appointment.data())
      .catch((error: any) => throwError(error));

    if (DEBUG) console.log("appointment -> ", appointment);

    const petNames = appointment?.patients.map((patient: any, index: number) =>
      index !== appointment?.patients.length - 1
        ? `${patient?.name}, `
        : ` and ${patient?.name}`
    );

    if (DEBUG) console.log("petNames -> ", petNames);

    const emailText = `${
      displayName
        ? `<p>Hi ${getClientFirstNameFromDisplayName(displayName)},</p>`
        : ""
    }<p>We are reaching out to let you know that we have received your request to cancel your appointment for ${
      petNames ? petNames : ""
    } on ${getDateStringFromDate(
      appointment?.start.toDate()
    )}</p><p>Please reach out if you have any questions!</p><p>- The MoVET Team</p>`;

    if (DEBUG) console.log("emailText -> ", emailText);

    const emailConfig: EmailConfiguration = {
      to: email,
      subject: "Your MoVET appointment has been cancelled",
      message: emailText,
    };
    sendNotification({
      type: "email",
      payload: {
        client: clientId,
        ...emailConfig,
      },
    });
  }
};
