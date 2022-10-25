import {admin, throwError} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";
const DEBUG = true;
export const updateBookingReason = async (
  id: string,
  reason: {label: string; value: string},
  reasonGroup: {label: string; value: string}
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
    .catch(async (error: any) => await throwError(error));
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
          .catch(async (error: any) => await throwError(error))
    )
  );
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      {
        step: "choose-staff",
        staff,
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
            status: "choose-reason",
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
                    text: "Choose Reason",
                  },
                  {
                    type: "mrkdwn",
                    text: "*Selected Reason Group*",
                  },
                  {
                    type: "plain_text",
                    text: reasonGroup?.label,
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
    .catch(async (error: any) => await throwError(error));
};
