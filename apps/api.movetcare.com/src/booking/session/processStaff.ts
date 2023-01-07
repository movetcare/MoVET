import { sendNotification } from "../../notifications/sendNotification";
import { admin, throwError } from "../../config/config";
import type { Staff } from "../../types/staff";
import { isObject } from "../../utils/isObject";
import { handleFailedBooking } from "./handleFailedBooking";

export const processStaff = async (id: string, selectedStaff: Staff | string) =>
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        selectedStaff,
        step: "staff-selection",
        updatedOn: new Date(),
      },
      { merge: true }
    )
    .then(async () => {
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
                    isObject(selectedStaff) &&
                    typeof selectedStaff !== "string" &&
                    selectedStaff?.firstName
                      ? `${
                          selectedStaff?.title ? `${selectedStaff?.title} ` : ""
                        }${
                          selectedStaff?.firstName
                            ? `${selectedStaff?.firstName}`
                            : ""
                        }${
                          selectedStaff?.lastName
                            ? ` ${selectedStaff?.lastName}`
                            : ""
                        }`
                      : "NONE"
                  }`,
                },
              ],
            },
          ],
        },
      });
      const session = await admin
        .firestore()
        .collection("bookings")
        .doc(id)
        .get()
        .then((doc: any) => doc.data())
        .catch(async (error: any) => {
          throwError(error);
          return await handleFailedBooking(error, "GET BOOKING DATA FAILED");
        });
      return {
        ...session,
        id,
        client: {
          uid: session?.client?.uid,
          requiresInfo: session?.client?.requiresInfo,
        },
      };
    })
    .catch((error: any) => throwError(error));
