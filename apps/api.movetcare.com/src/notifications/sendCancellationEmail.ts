import {
  DEBUG,
  admin,
  environment,
  emailClient,
  throwError,
} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";
import {getAuthUserById} from "../utils/auth/getAuthUserById";
import {getDateStringFromDate} from "../utils/getDateStringFromDate";

export const sendCancellationEmail = async (
  clientId: string,
  appointmentId: string
): Promise<void> => {
  if (DEBUG)
    console.log(
      `sendCancellationEmail -> clientId: ${clientId}, appointmentId: ${appointmentId}`
    );

  const {email, displayName} = await getAuthUserById(clientId, [
    "email",
    "displayName",
  ]);

  if (DEBUG) {
    console.log("email -> ", email);
    console.log("displayName -> ", displayName);
  }

  const appointment = await admin
    .firestore()
    .collection("appointments")
    .doc(appointmentId)
    .get()
    .then((appointment: any) => appointment.data())
    .catch(async (error: any) => await throwError(error));

  if (DEBUG) console.log("appointment -> ", appointment);

  const petNames = appointment?.patients.map((patient: any, index: number) =>
    index !== appointment?.patients.length - 1
      ? `${patient?.name}, `
      : ` and ${patient?.name}`
  );

  if (DEBUG) console.log("petNames -> ", petNames);

  const emailText = `${
    displayName ? `<p>Hi ${displayName},</p>` : ""
  }<p>We are reaching out to let you know that we have received your request to cancel your appointment for ${
    petNames ? petNames : ""
  } on ${getDateStringFromDate(
    appointment?.start.toDate()
  )}</p><p>Please reach out if you have any questions!</p><p>- The MoVET Team</p>`;

  if (DEBUG) console.log("emailText -> ", emailText);

  const emailConfig: any = {
    to: email,
    from: "info@movetcare.com",
    bcc: "info@movetcare.com",
    replyTo: "info@movetcare.com",
    subject: "Your MoVET appointment has been cancelled",
    text: emailText.replace(/(<([^>]+)>)/gi, ""),
    html: emailText,
  };
  if (environment?.type === "production")
    await emailClient
      .send(emailConfig)
      .then(async () => {
        if (DEBUG) console.log("EMAIL SENT!", emailConfig);
        if (clientId)
          await admin
            .firestore()
            .collection("clients")
            .doc(`${clientId}`)
            .collection("notifications")
            .add({
              type: "email",
              ...emailConfig,
              createdOn: new Date(),
            })
            .catch(async (error: any) => await throwError(error));
        await logEvent({
          tag: "cancel-appointment",
          origin: "api",
          success: true,
          data: emailConfig,
          sendToSlack: true,
        }).catch(async (error: any) => await throwError(error));
      })
      .catch(async (error: any) => {
        if (DEBUG) console.error(error?.response?.body?.errors);
        await throwError(error);
      });
  else {
    if (clientId)
      await admin
        .firestore()
        .collection("clients")
        .doc(`${clientId}`)
        .collection("notifications")
        .add({
          type: "email",
          ...emailConfig,
          createdOn: new Date(),
        })
        .catch(async (error: any) => await throwError(error));
    await logEvent({
      tag: "notification",
      origin: "api",
      success: true,
      data: emailConfig,
    });
  }
};
