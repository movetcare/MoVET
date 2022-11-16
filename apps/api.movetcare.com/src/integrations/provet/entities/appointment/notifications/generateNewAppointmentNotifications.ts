import { admin, DEBUG } from "../../../../../config/config";
import { sendNotification } from "../../../../../notifications/sendNotification";
import { subtractMinutesFromDate } from "../../../../../utils/subtractMinutesFromDate";

export const generateNewAppointmentNotifications = async (
  appointmentData: any
) => {
  const didNotSend30MinNotificationYet = await admin
    .firestore()
    .collection("tasks_completed")
    .doc(`${appointmentData.id}_30_min_appointment_notification`)
    .get()
    .then((document: any) => !document.exists)
    .catch((error: any) => {
      console.log("error", error);
      return true;
    });

  const didNotSend24HourNotificationYet = await admin
    .firestore()
    .collection("tasks_completed")
    .doc(`${appointmentData.id}_24_hour_appointment_notification`)
    .get()
    .then((document: any) => !document.exists)
    .catch((error: any) => {
      console.log("error", error);
      return true;
    });

  if (DEBUG) {
    console.log(
      "didNotSend30MinNotificationYet",
      didNotSend30MinNotificationYet
    );
    console.log(
      "appointmentData?.send30MinReminder",
      appointmentData?.send30MinReminder
    );
    console.log(
      "didNotSend24HourNotificationYet",
      didNotSend24HourNotificationYet
    );

    console.log(
      "appointmentData?.send24HourReminder",
      appointmentData?.send24HourReminder
    );
  }
  if (appointmentData?.send30MinReminder)
    if (didNotSend30MinNotificationYet)
      await admin
        .firestore()
        .collection("tasks_queue")
        .doc(`${appointmentData.id}_30_min_appointment_notification`)
        .set(
          {
            options: {
              ...appointmentData,
            },
            worker: "30_min_appointment_notification",
            status: "scheduled",
            performAt: subtractMinutesFromDate(appointmentData.start, 30),
            createdOn: new Date(),
          },
          { merge: true }
        )
        .then(async () => {
          if (DEBUG)
            console.log(
              "UPDATED 30 MIN APPOINTMENT NOTIFICATION FOR ",
              appointmentData.id
            );
          sendNotification({
            type: "slack",
            payload: {
              message: `:bell: Update 30 Minute Appointment Notifications for Appointment ${appointmentData.id}`,
            },
          });
        })
        .catch(async (error: any) => {
          if (DEBUG)
            console.log(
              `COULD NOT CREATE 30 MIN APPOINTMENT NOTIFICATION FOR ${appointmentData.id}`,
              error?.message
            );
          sendNotification({
            type: "slack",
            payload: {
              message: `:bell: ERROR Updating 30 Minute Appointment Notification for Appointment ${appointmentData.id} - "${error.message}"`,
            },
          });
        });
    else {
      if (DEBUG)
        console.log(
          `DID NOT CREATE 30 MIN APPOINTMENT NOTIFICATION FOR ${appointmentData.id}`,
          appointmentData
        );
      sendNotification({
        type: "slack",
        payload: {
          message: `:bell: SKIPPED Updating 30 Minute Appointment Notification for Appointment ${
            appointmentData.id
          }\nReason: ${
            didNotSend30MinNotificationYet
              ? appointmentData?.send30MinReminder
                ? ""
                : "Reminder disabled"
              : "Already sent reminder"
          }`,
        },
      });
    }
  if (appointmentData?.send24HourReminder)
    if (didNotSend24HourNotificationYet)
      await admin
        .firestore()
        .collection("tasks_queue")
        .doc(`${appointmentData.id}_24_hour_appointment_notification`)
        .set(
          {
            options: {
              ...appointmentData,
            },
            worker: "24_hour_appointment_notification",
            status: "scheduled",
            performAt: subtractMinutesFromDate(appointmentData.start, 1440),
            createdOn: new Date(),
          },
          { merge: true }
        )
        .then(async () => {
          if (DEBUG)
            console.log(
              "UPDATED 24 HOUR APPOINTMENT NOTIFICATION FOR ",
              appointmentData.id
            );
          sendNotification({
            type: "slack",
            payload: {
              message: `:bell: Updated 24 Hour Appointment Notification for Appointment ${appointmentData.id}`,
            },
          });
        })
        .catch(async (error: any) => {
          if (DEBUG)
            console.log(
              `COULD NOT CREATE 24 HOUR APPOINTMENT NOTIFICATION FOR ${appointmentData.id}`,
              error?.message
            );
          sendNotification({
            type: "slack",
            payload: {
              message: `:bell: ERROR Updating 24 Hour Appointment Notification for Appointment ${appointmentData.id} - "${error.message}"`,
            },
          });
        });
    else {
      if (DEBUG)
        console.log(
          `DID NOT CREATE 24 HOUR APPOINTMENT NOTIFICATION FOR ${appointmentData.id}`,
          appointmentData
        );
      sendNotification({
        type: "slack",
        payload: {
          message: `:bell: SKIPPED Updating 24 Hour Appointment Notification for Appointment ${
            appointmentData.id
          }\nReason:  ${
            didNotSend24HourNotificationYet
              ? appointmentData?.send24HourReminder
                ? ""
                : "Reminder disabled"
              : "Already sent reminder"
          }`,
        },
      });
    }
};
