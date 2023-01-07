import { admin, throwError, DEBUG } from "../../config/config";
import { sendNotification } from "../../notifications/sendNotification";
import type { Booking } from "../../types/booking";
import { handleFailedBooking } from "./handleFailedBooking";

export const processReason = async (
  id: Booking["id"],
  reason: Booking["reason"]
) => {
  if (reason) {
    if (DEBUG) console.log("reason", reason);
    const proficientStaff = await admin
      .firestore()
      .collection("reasons")
      .doc(`${reason.value}`)
      .get()
      .then((doc: any) => {
        if (DEBUG) console.log("processReason => proficientStaff", doc.data());
        return doc.data()?.proficientStaff || false;
      })
      .catch(async (error: any) => {
        throwError(error);
        return await handleFailedBooking(error, "GET REASONS FAILED");
      });
    if (proficientStaff) {
      const staff = await Promise.all(
        proficientStaff.map(
          async (staffId: number) =>
            await admin
              .firestore()
              .collection("users")
              .doc(`${staffId}`)
              .get()
              .then((doc: any) => {
                return {
                  isActive: doc.data()?.isActive,
                  firstName: doc.data().firstName,
                  lastName: doc.data().lastName,
                  id: `${doc.data().id}`,
                  isStaff: doc.data().isStaff,
                  picture: doc.data().picture,
                  qualifications: doc.data().qualifications,
                  areasOfExpertise: doc.data().areasOfExpertise,
                  title: doc.data().title,
                };
              })
              .catch(async (error: any) => {
                throwError(error);
                return await handleFailedBooking(error, "GET STAFF FAILED");
              })
        )
      );
      if (DEBUG) console.log("staff", staff);
      if (staff)
        await admin
          .firestore()
          .collection("bookings")
          .doc(id)
          .set(
            Array.isArray(staff) && staff.length > 0
              ? {
                  step: "staff-selection",
                  staff,
                  reason,
                  updatedOn: new Date(),
                }
              : {
                  step: "datetime-selection",
                  reason,
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
                        text: "Choose Reason",
                      },
                      {
                        type: "mrkdwn",
                        text: "*Selected Reason*",
                      },
                      {
                        type: "plain_text",
                        text: reason?.label,
                      },
                    ],
                  },
                ],
              },
            })
          )
          .catch(async (error: any) => {
            throwError(error);
            return await handleFailedBooking(error, "UPDATE BOOKING FAILED");
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
    } else
      return await handleFailedBooking({ id, reason }, "FAILED TO GET STAFF");
  } else
    return await handleFailedBooking({ id, reason }, "FAILED TO GET REASON");
};
