import {admin, DEBUG, throwError} from "../../config/config";
import {addMinutesToDateObject} from "../../utils/addMinutesToDateObject";

export const createBookingAbandonmentNotifications = async (id: string) =>
  await admin
    .firestore()
    .collection("tasks_queue")
    .doc(`booking_abandonment_notification_1_hour_${id}`)
    .set(
      {
        options: {
          id,
        },
        worker: "booking_abandonment_notification_1_hour",
        status: "scheduled",
        performAt: addMinutesToDateObject(new Date(), 60),
        createdOn: new Date(),
      },
      {merge: true}
    )
    .then(
      async () =>
        DEBUG &&
        console.log(
          "1 HOUR BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
          `booking_abandonment_notification_1_hour_${id}`
        )
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`booking_abandonment_notification_24_hour_${id}`)
          .set(
            {
              options: {
                id,
              },
              worker: "booking_abandonment_notification_24_hour",
              status: "scheduled",
              performAt: addMinutesToDateObject(new Date(), 1440),
              createdOn: new Date(),
            },
            {merge: true}
          )
          .then(
            async () =>
              DEBUG &&
              console.log(
                "24 HOUR BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
                `booking_abandonment_notification_24_hour_${id}`
              )
          )
          .catch(async (error: any) => await throwError(error))
    )
    .then(
      async () =>
        await admin
          .firestore()
          .collection("tasks_queue")
          .doc(`booking_abandonment_notification_3_day_${id}`)
          .set(
            {
              options: {
                id,
              },
              worker: "booking_abandonment_notification_3_day",
              status: "scheduled",
              performAt: addMinutesToDateObject(new Date(), 4320),
              createdOn: new Date(),
            },
            {merge: true}
          )
          .then(
            async () =>
              DEBUG &&
              console.log(
                "3 DAY BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
                `booking_abandonment_notification_3_day_${id}`
              )
          )
          .catch(async (error: any) => await throwError(error))
    )
    .catch(async (error: any) => await throwError(error));
