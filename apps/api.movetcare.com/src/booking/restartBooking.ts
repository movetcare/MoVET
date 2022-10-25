import {DEBUG, admin, throwError} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";

export const restartBooking = async (id: string) => {
  if (DEBUG)
    console.log("ARCHIVING BOOKING DATA", {
      id,
    });
  return await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        isActive: false,
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY ARCHIVED BOOKING", {
          id,
        });
      return await logEvent({
        tag: "appointment-booking",
        origin: "api",
        success: true,
        sendToSlack: true,
        data: {
          id,
          status: "restart",
          updatedOn: new Date(),
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
    .catch(async (error: any) => await throwError(error));
};
