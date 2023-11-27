import { Request, Response } from "express";
import { throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
// import {configureReminders} from '../reminder/configureReminders';
import { saveAppointment } from "./saveAppointment";
// import { sendNotification } from "../../../../notifications/sendNotification";
// import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";

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
    // const previousAppointmentData =
    //   (await admin
    //     .firestore()
    //     .collection("appointments")
    //     .doc(`${request.body?.appointment_id}`)
    //     .get()
    //     .then((doc: any) => {
    //       if (doc.exists) return doc.data();
    //       else return "NEW APPOINTMENT - No Previous Data";
    //     })) || {};
    //.catch((error: any) => throwError(error));

    if (proVetAppointmentData) await saveAppointment(proVetAppointmentData);

    // if (
    //   previousAppointmentData &&
    //   previousAppointmentData.active === 1 &&
    //   proVetAppointmentData &&
    //   proVetAppointmentData.active === 0
    // ) {
    //   const userName = await admin
    //     .firestore()
    //     .collection("users")
    //     .where(
    //       "id",
    //       "==",
    //       getProVetIdFromUrl(proVetAppointmentData?.modified_user),
    //     )
    //     .get()
    //     .then((doc: any) => doc.data()?.firstName + " " + doc.data()?.lastName)
    //     .catch((error: any) => throwError(error));

    //   sendNotification({
    //     type: "email",
    //     payload: {
    //       to: "info@movetcare.com",
    //       subject: "PROVET APPOINTMENT CANCELED!",
    //       message:
    //         `<p>Appointment #${proVetAppointmentData} has been canceled by '${userName}' + </p>` +
    //         "<p></p><p>Updated Appointment Data: " +
    //         JSON.stringify(proVetAppointmentData) +
    //         "</p>" +
    //         `<p></p><a href="https://us.provetcloud.com/4285/client/${getProVetIdFromUrl(
    //           proVetAppointmentData?.client,
    //         )}">VIEW APPOINTMENT</a>`,
    //     },
    //   });
    // }
    //await configureReminders('appointments');
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
