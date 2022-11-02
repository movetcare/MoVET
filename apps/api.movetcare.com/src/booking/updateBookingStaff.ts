import {admin, throwError} from "../config/config";
import type { Staff } from "../types/staff";
import {isObject} from "../utils/isObject";
import {logEvent} from "../utils/logging/logEvent";

export const updateBookingStaff = async (id: string, staff: Staff | string) =>
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        step: "choose-datetime",
        updatedOn: new Date(),
      },
      {merge: true}
    )
    .then(
      async () =>
        await logEvent({
          tag: "appointment-booking",
          origin: "api",
          success: true,
          sendToSlack: true,
          data: {
            status: "choose-staff",
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
    .catch(async (error: any) => await throwError(error));
