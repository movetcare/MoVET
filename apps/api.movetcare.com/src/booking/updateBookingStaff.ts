import { sendNotification } from "./../notifications/sendNotification";
import { admin, throwError } from "../config/config";
import type { Staff } from "../types/staff";
import { isObject } from "../utils/isObject";

export const updateBookingStaff = (id: string, staff: Staff | string) =>
  admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        step: "choose-datetime",
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(() =>
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
                  text: "Choose Staff",
                },
                {
                  type: "mrkdwn",
                  text: "*Selected Staff*",
                },
                {
                  type: "plain_text",
                  text: `${
                    isObject(staff) &&
                    typeof staff !== "string" &&
                    staff?.firstName
                      ? `${staff?.title ? `${staff?.title} ` : ""}${
                          staff?.firstName ? `${staff?.firstName}` : ""
                        }${staff?.lastName ? ` ${staff?.lastName}` : ""}`
                      : "NONE"
                  }`,
                },
              ],
            },
          ],
        },
      })
    )
    .catch((error: any) => throwError(error));
