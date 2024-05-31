import { DEBUG, admin, throwError } from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import type { ClinicBooking } from "../../../types/booking";

export const cancelClinicBooking = (
  id: string,
  { clinic, step }: ClinicBooking,
) => {
  if (DEBUG)
    console.log("ARCHIVING CLINIC BOOKING DATA", {
      id,
    });
  admin
    .firestore()
    .collection("clinic_bookings")
    .doc(id)
    .set(
      {
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .then(async () => {
      if (DEBUG)
        console.log("SUCCESSFULLY ARCHIVED CLINIC BOOKING", {
          id,
        });
      sendNotification({
        type: "slack",
        payload: {
          message: [
            {
              type: "section",
              text: {
                text: `:book: _"${clinic?.name}" Clinic Booking_ *RESTARTED*`,
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
                  text: step,
                },
              ],
            },
          ],
        },
      });
    })
    .catch((error: any) => throwError(error));
};
