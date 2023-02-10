import { Request, Response } from "express";
import { throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
// import {configureReminders} from '../reminder/configureReminders';
import { saveAppointment } from "./saveAppointment";

export const processAppointmentWebhook = async (
  request: Request,
  response: Response
): Promise<Response> => {
  if (
    !(typeof request.body.appointment_id === "string") ||
    request.body.appointment_id.length === 0
  )
    throwError({ message: "INVALID_PAYLOAD" });
  try {
    const proVetAppointmentData = await fetchEntity(
      "appointment",
      request.body?.appointment_id
    );
    await saveAppointment(proVetAppointmentData);
    //await configureReminders('appointments');
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
