import { Request, Response } from "express";
import { admin, throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
import { saveAppointment } from "./saveAppointment";
import { sendNotification } from "../../../../notifications/sendNotification";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";

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
    const previousAppointmentData =
      (await admin
        .firestore()
        .collection("appointments")
        .doc(`${request.body?.appointment_id}`)
        .get()
        .then(async (doc: any) => {
          if (doc.exists) return doc.data();
          else {
            const clientId = getProVetIdFromUrl(proVetAppointmentData?.client);
            if (clientId) {
              await admin
                .firestore()
                .collection("bookings")
                .where("client.uid", "==", `${clientId}`)
                .where("isActive", "==", true)
                .get()
                .then(async (snapshot: any) => {
                  if (snapshot.size > 0) {
                    snapshot.forEach(async (doc: any) => {
                      await admin
                        .firestore()
                        .collection("bookings")
                        .doc(doc.id)
                        .update({ isActive: false })
                        .catch((error: any) => throwError(error));
                    });
                  }
                })
                .catch((error: any) => throwError(error));
              await admin
                .firestore()
                .collection("clinic_bookings")
                .where("client.uid", "==", `${clientId}`)
                .where("isActive", "==", true)
                .get()
                .then(async (snapshot: any) => {
                  if (snapshot.size > 0) {
                    snapshot.forEach(async (doc: any) => {
                      await admin
                        .firestore()
                        .collection("clinic_bookings")
                        .doc(doc.id)
                        .update({ isActive: false })
                        .catch((error: any) => throwError(error));
                    });
                  }
                })
                .catch((error: any) => throwError(error));
            }
            return "NEW APPOINTMENT - No Previous Data";
          }
        })) || {};

    if (proVetAppointmentData) await saveAppointment(proVetAppointmentData);

    if (
      previousAppointmentData &&
      previousAppointmentData.active === 1 &&
      proVetAppointmentData &&
      proVetAppointmentData.active === 0
    ) {
      sendNotification({
        type: "email",
        payload: {
          to: "info@movetcare.com",
          subject: "PROVET APPOINTMENT CANCELED!",
          message:
            `<p>Appointment #${proVetAppointmentData?.id} has been canceled!' + </p>` +
            `<p></p><a href="https://us.provetcloud.com/4285/client/${getProVetIdFromUrl(
              proVetAppointmentData?.client,
            )}">VIEW APPOINTMENT</a>`,
        },
      });
    }
    return response.status(200).send({ received: true });
  } catch (error: any) {
    console.error(error);
    return response.status(500).send({ received: false });
  }
};
