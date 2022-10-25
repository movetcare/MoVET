import {admin, DEBUG} from "../../../../../config/config";

export const deleteAppointmentNotifications = async (appointmentId: number) => {
  await admin
    .firestore()
    .collection("tasks_queue")
    .doc(`${appointmentId}_30_min_appointment_notification`)
    .delete()
    .then(
      () =>
        DEBUG &&
        console.log(
          "DELETED 30 MIN APPOINTMENT NOTIFICATION FOR ",
          appointmentId
        )
    )
    .catch(
      (error: any) =>
        DEBUG &&
        console.log(
          `COULD NOT DELETE 30 MIN APPOINTMENT NOTIFICATION FOR ${appointmentId}`,
          error?.message
        )
    );
  await admin
    .firestore()
    .collection("tasks_queue")
    .doc(`${appointmentId}_24_hour_appointment_notification`)
    .delete()
    .then(
      () =>
        DEBUG &&
        console.log(
          "DELETED 24 HOUR APPOINTMENT NOTIFICATION FOR ",
          appointmentId
        )
    )
    .catch(
      (error: any) =>
        DEBUG &&
        console.log(
          `COULD NOT DELETE 24 HOUR APPOINTMENT NOTIFICATION FOR ${appointmentId}`,
          error?.message
        )
    );
};
