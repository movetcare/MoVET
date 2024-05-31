import { admin, DEBUG, throwError } from "../../../config/config";
import { addMinutesToDateObject } from "../../../utils/addMinutesToDateObject";

export const createClinicBookingAbandonmentNotifications = (id: string) =>
  admin
    .firestore()
    .collection("tasks_queue")
    .doc(`clinic_booking_abandonment_notification_1_hour_${id}`)
    .set(
      {
        options: {
          id,
        },
        worker: "clinic_booking_abandonment_notification_1_hour",
        status: "scheduled",
        performAt: addMinutesToDateObject(new Date(), 60),
        createdOn: new Date(),
      },
      { merge: true },
    )
    .then(
      () =>
        DEBUG &&
        console.log(
          "1 HOUR CLINIC BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
          `clinic_booking_abandonment_notification_1_hour_${id}`,
        ),
    )
    .catch((error: any) => throwError(error));
