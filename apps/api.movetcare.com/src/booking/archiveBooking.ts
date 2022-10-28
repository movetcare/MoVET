import { throwError, admin } from "../config/config";
import { logEvent } from "../utils/logging/logEvent";

const DEBUG = true;

export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  await admin
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
    .then(
      async () =>
        await logEvent({
          tag: "appointment-booking",
          origin: "api",
          success: true,
          sendToSlack: true,
          data: {
            id,
            step: "archived",
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
                    text: "ARCHIVED",
                  },
                ],
              },
            ],
          },
        })
    )
    .catch(async (error: any) => await throwError(error));
};
