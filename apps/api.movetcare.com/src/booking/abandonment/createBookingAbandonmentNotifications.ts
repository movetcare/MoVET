import {admin, DEBUG, throwError} from "../../config/config";
import {addMinutesToDateObject} from "../../utils/addMinutesToDateObject";

export const createBookingAbandonmentNotifications = (id: string) =>
  admin
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
      { merge: true }
    )
    .then(
      () =>
        DEBUG &&
        console.log(
          "1 HOUR BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
          `booking_abandonment_notification_1_hour_${id}`
        )
    )
    .then(() =>
      admin
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
          { merge: true }
        )
        .then(
          () =>
            DEBUG &&
            console.log(
              "24 HOUR BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
              `booking_abandonment_notification_24_hour_${id}`
            )
        )
        .catch((error: any) => throwError(error))
    )
    .then(() =>
      admin
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
          { merge: true }
        )
        .then(
          () =>
            DEBUG &&
            console.log(
              "3 DAY BOOKING ABANDONMENT NOTIFICATION TASK ADDED TO QUEUE => ",
              `booking_abandonment_notification_3_day_${id}`
            )
        )
        .catch((error: any) => throwError(error))
    )
    .catch((error: any) => throwError(error));
