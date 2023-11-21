import { Request, Response } from "express";
import { admin, throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
// import {configureReminders} from '../reminder/configureReminders';
import { saveAppointment } from "./saveAppointment";
import { sendNotification } from "../../../../notifications/sendNotification";

const DEBUG = true;
export const processAppointmentWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (
    !(typeof request.body.appointment_id === "string") ||
    request.body.appointment_id.length === 0
  )
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    const proVetAppointmentData = await fetchEntity(
      "appointment",
      request.body?.appointment_id,
    );

    if (DEBUG)
      console.log(
        "processAppointmentWebhook request.body?.appointment_id",
        request.body?.appointment_id,
      );

    const previousAppointmentData =
      (await admin
        .firestore()
        .collection("appointments")
        .doc(`${request.body?.appointment_id}`)
        .get()
        .then((doc: any) => {
          if (doc.exists) return doc.data();
          else return "NEW APPOINTMENT - No Previous Data";
        })) || {};
    //.then((error: any) => throwError(error));

    if (DEBUG)
      console.log(
        "processAppointmentWebhook previousAppointmentData",
        previousAppointmentData,
      );

    await saveAppointment(proVetAppointmentData);

    if (DEBUG)
      console.log("processAppointmentWebhook sendNotification", {
        to: ["alex.rodriguez@movetcare.com", "info@movetcare.com"],
        subject: "PROVET APPOINTMENT WEBHOOK UPDATE RECEIVED",
        message:
          "Webhook Payload: " +
          JSON.stringify(request.body) +
          "\n\nPrevious Appointment Data: " +
          JSON.stringify(previousAppointmentData) +
          "\n\nUpdated Appointment Data: " +
          JSON.stringify(proVetAppointmentData),
      });

    sendNotification({
      type: "email",
      payload: {
        to: ["alex.rodriguez@movetcare.com", "info@movetcare.com"],
        subject: "PROVET APPOINTMENT WEBHOOK UPDATE RECEIVED",
        message: "Webhook Payload: " + JSON.stringify(request.body),
        // +
        // "\n\nPrevious Appointment Data: " +
        // JSON.stringify(previousAppointmentData) +
        // "\n\nUpdated Appointment Data: " +
        // JSON.stringify(proVetAppointmentData),
      },
    });
    //await configureReminders('appointments');
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
