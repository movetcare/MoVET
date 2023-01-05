import { admin, throwError, DEBUG } from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateBookingReason = async (
  id: string,
  reason: { label: string; value: string }
) => {
  const proficientStaff = await admin
    .firestore()
    .collection("reasons")
    .doc(`${reason.value}`)
    .get()
    .then((doc: any) => {
      if (DEBUG)
        console.log(
          "updateBookingReason => proficientStaff",
          doc.data()?.proficientStaff
        );
      return doc.data()?.proficientStaff || false;
    })
    .catch((error: any) => throwError(error));
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
          .catch((error: any) => throwError(error))
    )
  );
  admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      staff.length > 0
        ? {
            step: "staff-selection",
            staff,
            updatedOn: new Date(),
          }
        : {
            step: "datetime-selection",
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
    .catch((error: any) => throwError(error));
};
