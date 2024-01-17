import { fetchEntity } from "./entities/fetchEntity";
import { processClientWebhook } from "./entities/client/processClientWebhook";
import { processPatientWebhook } from "./entities/patient/processPatientWebhook";
import { processAppointmentWebhook } from "./entities/appointment/processAppointmentWebhook";
import { processInvoiceWebhook } from "./entities/invoice/processInvoiceWebhook";
import { Request, Response } from "express";
import { proVetAppUrl, throwError } from "../../config/config";
import { processInvoicePaymentWebhook } from "./entities/invoice/processInvoicePaymentWebhook";
import { processUserWebhook } from "./entities/user/processUserWebhook";
import { processConsultationWebhook } from "./entities/consultation/processConsultationWebhook";
import { sendNotification } from "../../notifications/sendNotification";
import { getProVetIdFromUrl } from "../../utils/getProVetIdFromUrl";
import { configureProVetAuth } from "./configureProVetAuth";

const DEBUG = true;
export const processProVetWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (DEBUG)
    console.log(
      "processProVetWebhook INCOMING REQUEST PAYLOAD => ",
      request.body,
    );
  const message = `${
    request.body?.client_id
      ? `:bust_in_silhouette: Client Update - ${
          proVetAppUrl + "/client/" + request.body?.client_id
        }`
      : request.body?.consultation_id
        ? `:speech_balloon: Consultation Update - ${
            proVetAppUrl + "/consultation/" + request.body?.consultation_id
          }`
        : request.body?.invoice_id
          ? `:credit_card: Invoice Update - ${
              proVetAppUrl + "/billing/invoice/" + request.body?.invoice_id
            }`
          : request.body?.appointment_id
            ? `:hospital: Appointment Update - ${
                proVetAppUrl + "/appointment/" + request.body?.appointment_id
              }`
            : request.body?.patient_id
              ? `:paw_prints: Patient Update - ${
                  proVetAppUrl + "/patient/" + request.body?.patient_id
                }`
              : request.body?.laboratory_referral_id
                ? `:test_tube: Laboratory Referral Update - ${request.body?.laboratory_referral_id}`
                : request.body?.consultationitem_id
                  ? `:pill: Consultation Item Update - ${request.body?.consultationitem_id}`
                  : request.body?.reminder_id
                    ? `:alarm_clock: Reminder Update - ${request.body?.reminder_id} - ${proVetAppUrl}/reminder/list/`
                    : request.body?.email_log_id
                      ? `:email: Email Update - ${request.body?.email_log_id} ${proVetAppUrl}/organization/administration/log/email_log/`
                      : request.body?.user_id
                        ? `:health_worker: User Update - ${request.body?.user_id} - ${proVetAppUrl}/organization/administration/users/`
                        : request.body?.invoicerow_id
                          ? `:money_with_wings: Invoice Row Update - ${request.body?.invoicerow_id}`
                          : request.body?.invoicepayment_id
                            ? `:moneybag: Invoice Payment Update - ${request.body?.invoicepayment_id}`
                            : request.body?.organizationitem_id
                              ? `:medical_symbol: Organization Item Update - ${request.body?.organizationitem_id} - ${proVetAppUrl}/organization/administration/items/`
                              : `:pencil: Update - ${
                                  request.body?.message ||
                                  `\`\`\`${JSON.stringify(request.body)}\`\`\``
                                }`
  }`;
  sendNotification({
    type: "slack",
    payload: {
      message,
    },
  });
  const {
    client_id,
    patient_id,
    appointment_id,
    invoice_id,
    invoicepayment_id,
    user_id,
    consultation_id,
    algorithm,
    authorization_grant_type,
    client_type,
    provet_id,
    client_secret,
    token_url,
  } = request.body;
  if (
    provet_id === 4285 &&
    algorithm === "RS256" &&
    authorization_grant_type === "client_credentials" &&
    client_type === "confidential" &&
    client_id &&
    client_secret &&
    token_url
  ) {
    return await configureProVetAuth(request, response);
  } else if (
    typeof user_id !== "undefined" ||
    typeof client_id !== "undefined" ||
    typeof patient_id !== "undefined" ||
    typeof appointment_id !== "undefined" ||
    typeof invoice_id !== "undefined" ||
    typeof invoicepayment_id !== "undefined" ||
    typeof consultation_id !== "undefined"
  ) {
    try {
      if (user_id) return await processUserWebhook(request, response);
      else if (client_id) return await processClientWebhook(request, response);
      else if (patient_id)
        return await processPatientWebhook(request, response);
      else if (appointment_id)
        return await processAppointmentWebhook(request, response);
      else if (invoice_id)
        return await processInvoiceWebhook(request, response);
      else if (invoicepayment_id)
        return await processInvoicePaymentWebhook(request, response);
      else if (consultation_id)
        return await processConsultationWebhook(request, response);
    } catch (error: any) {
      throwError({ message: JSON.stringify(error), sendToSlack: true });
      return response.status(200).send({ received: true });
    }
  } else {
    if (request.body.email_log_id)
      fetchEntity("email", request.body.email_log_id)
        .then((response: any) =>
          sendNotification({
            type: "slack",
            payload: {
              message: `:e-mail: Email w/ subject "${response?.subject}" sent to ${response?.email_address} - ${
                proVetAppUrl + "/client/" + getProVetIdFromUrl(response?.client)
              }/tabs/?tab=communication`,
            },
          }),
        )
        .catch((error: any) =>
          console.log("processProVetWebhook ERROR: ", error),
        );
    else if (request.body.reminder_id)
      fetchEntity("reminder", request.body.reminder_id)
        .then((response: any) => {
          let message = null;
          if (response?.send_method === 1) {
            if (response?.status === 4)
              message = `:interrobang: Reminder email w/ subject "${response?.email_subject}" FAILED to send to ${response?.email_address}`;
            else if (response?.status === 3)
              message = `:alarm_clock: Reminder email w/ subject "${response?.email_subject}" sent to ${response?.email_address}`;
            else if (response?.status === 2)
              message = `:alarm_clock: Reminder email w/ subject "${response?.email_subject}" is being sent to ${response?.email_address}`;
            else if (response?.status === 1)
              message = `:alarm_clock: Reminder email w/ subject "${response?.email_subject}" for ${response?.email_address} has been added to the queue`;
            else if (response?.status === 0)
              message = `:alarm_clock: Reminder email w/ subject "${response?.email_subject}" for ${response?.email_address} has been created`;
            message += ` - ${
              proVetAppUrl + "/client/" + getProVetIdFromUrl(response?.client)
            }/tabs/?tab=reminders`;
          } else `:interrobang: UNSUPPORTED REMINDER UPDATED ${response?.url}`;
          sendNotification({
            type: "slack",
            payload: {
              message,
            },
          });
        })
        .catch((error: any) =>
          console.log("processProVetWebhook ERROR: ", error),
        );
    return response.status(200).send({ received: true });
  }
  return response.status(200).send({ received: true });
};
