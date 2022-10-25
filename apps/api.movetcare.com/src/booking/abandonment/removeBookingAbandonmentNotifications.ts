import {admin} from "../../config/config";
const DEBUG = false;
export const removeBookingAbandonmentNotifications = async (id: string) =>
  await admin
    .firestore()
    .collection("tasks_queue")
    .doc(`booking_abandonment_notification_1_hour_${id}`)
    .delete()
    .then(
      async () =>
        DEBUG &&
        console.log(
          "1 HOUR BOOKING ABANDONMENT NOTIFICATION TASK REMOVED FROM QUEUE => ",
          `booking_abandonment_notification_1_hour_${id}`
        )
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`booking_abandonment_notification_24_hour_${id}`)
          .delete()
          .then(
            async () =>
              DEBUG &&
              console.log(
                "24 HOUR BOOKING ABANDONMENT NOTIFICATION TASK REMOVED FROM QUEUE => ",
                `booking_abandonment_notification_24_hour_${id}`
              )
          )
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`booking_abandonment_notification_3_day_${id}`)
          .delete()
          .then(
            async () =>
              DEBUG &&
              console.log(
                "3 DAY BOOKING ABANDONMENT NOTIFICATION TASK REMOVED FROM QUEUE => ",
                `booking_abandonment_notification_3_day_${id}`
              )
          )
    );
