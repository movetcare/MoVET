import { admin, DEBUG } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";

export const removeClinicBookingAbandonmentNotifications = (id: string) =>
  admin
    .firestore()
    .collection("tasks_queue")
    .doc(`clinic_booking_abandonment_notification_1_hour_${id}`)
    .delete()
    .then(
      () =>
        DEBUG &&
        console.log(
          "1 HOUR CLINIC BOOKING ABANDONMENT NOTIFICATION TASK REMOVED FROM QUEUE => ",
          `clinic_booking_abandonment_notification_1_hour_${id}`,
        ),
    )
    .then(() =>
      sendNotification({
        type: "slack",
        payload: {
          message: `:no_entry_sign: ${id} - Clinic Appointment Booking Abandonment Notifications Cancelled`,
        },
      }),
    );
