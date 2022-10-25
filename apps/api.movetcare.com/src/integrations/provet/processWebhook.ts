import {fetchEntity} from "./entities/fetchEntity";
import {logEvent} from "./../../utils/logging/logEvent";
import {processClientWebhook} from "./entities/client/processClientWebhook";
import {processPatientWebhook} from "./entities/patient/processPatientWebhook";
import {processAppointmentWebhook} from "./entities/appointment/processAppointmentWebhook";
import {processInvoiceWebhook} from "./entities/invoice/processInvoiceWebhook";
import {Request, Response} from "express";
import {DEBUG, throwError} from "../../config/config";
import {processInvoicePaymentWebhook} from "./entities/invoice/processInvoicePaymentWebhook";
import {processUserWebhook} from "./entities/user/processUserWebhook";
import {processConsultationWebhook} from "./entities/consultation/processConsultationWebhook";

export const processProVetWebhook = async (
  request: Request,
  response: Response
): Promise<Response> => {
  if (DEBUG) console.log("INCOMING REQUEST PAYLOAD => ", request.body);
  await logEvent({
    tag: "provet-webhook",
    origin: "api",
    success: true,
    data: request.body,
    sendToSlack: true,
  });
  const {
    client_id,
    patient_id,
    appointment_id,
    invoice_id,
    invoicepayment_id,
    user_id,
    consultation_id,
  } = request.body;
  if (
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
      await throwError({message: JSON.stringify(error), sendToSlack: true});
      return response.status(200).send({received: true});
    }
  } else {
    if (request.body.email_log_id)
      await fetchEntity("email", request.body.email_log_id)
        .then(
          async (response: any) =>
            await logEvent({
              tag: "provet-email-sent",
              origin: "api",
              success: true,
              sendToSlack: true,
              data: response,
            })
        )
        .catch((error: any) => console.log("ERROR: ", error));
    else if (request.body.reminder_id)
      await fetchEntity("reminder", request.body.reminder_id)
        .then(
          async (response: any) =>
            await logEvent({
              tag: "provet-reminder",
              origin: "api",
              success: true,
              sendToSlack: true,
              data: response,
            })
        )
        .catch((error: any) => console.log("ERROR: ", error));
    return response.status(200).send({received: true});
  }
  return response.status(200).send({received: true});
};
