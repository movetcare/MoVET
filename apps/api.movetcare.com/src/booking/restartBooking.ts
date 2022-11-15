import {DEBUG, admin, throwError} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const restartBooking = (id: string) => {
  if (DEBUG)
    console.log("ARCHIVING BOOKING DATA", {
      id,
    });
  return admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY ARCHIVED BOOKING", {
          id,
        });
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: ":book: _Appointment Booking_ *UPDATE*",
                type: "mrkdwn",
              },
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Session ID*",
                },
                {
                  type: "plain_text",
                  text: id,
                },
                {
                  type: "mrkdwn",
                  text: "*Step*",
                },
                {
                  type: "plain_text",
                  text: "RESTART",
                },
              ],
            },
          ],
        },
      });
    })
    .catch((error: any) => throwError(error));
};
