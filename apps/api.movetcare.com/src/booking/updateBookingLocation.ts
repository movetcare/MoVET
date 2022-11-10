import {admin, throwError} from "../config/config";
import {getBookingConfiguration} from "../utils/getBookingConfiguration";
import {logEvent} from "../utils/logging/logEvent";
const DEBUG = false;
export const updateBookingLocation = async (
  id: string,
  location: string,
  vcprRequired: boolean,
  illPatients: Array<string>
) => {
  let vcprReason = null;
  if (vcprRequired) {
    const {
      clinicMinorIllnessVcprReason,
      housecallMinorIllnessVcprReason,
      clinicStandardVcprReason,
      housecallStandardVcprReason,
    } = await getBookingConfiguration();
    if (DEBUG) {
      console.log("updateBookingLocation => illPatients", illPatients);
      console.log(
        "updateBookingLocation => illPatients.length",
        illPatients?.length
      );
      console.log(
        "updateBookingLocation => clinicMinorIllnessVcprReason",
        clinicMinorIllnessVcprReason
      );
      console.log(
        "updateBookingLocation => housecallMinorIllnessVcprReason",
        housecallMinorIllnessVcprReason
      );
      console.log(
        "updateBookingLocation => clinicStandardVcprReason",
        clinicStandardVcprReason
      );
      console.log(
        "updateBookingLocation => housecallStandardVcprReason",
        housecallStandardVcprReason
      );
    }
    if (illPatients && illPatients?.length > 0) {
      if (location === "Clinic")
        vcprReason = clinicMinorIllnessVcprReason?.value;
      if (location === "Home")
        vcprReason = housecallMinorIllnessVcprReason?.value;
    } else {
      if (location === "Clinic") vcprReason = clinicStandardVcprReason?.value;
      if (location === "Home") vcprReason = housecallStandardVcprReason?.value;
    }
  }
  if (DEBUG) console.log("updateBookingLocation => vcprReason", vcprReason);
  await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .set(
      vcprReason === null
        ? {
            step: "choose-reason",
            updatedOn: new Date(),
          }
        : {
            step: "choose-datetime",
            reason: {
              label: await admin
                .firestore()
                .collection("reasons")
                .doc(`${vcprReason}`)
                .get()
                .then((doc: any) => doc.data()?.name)
                .catch(async (error: any) => await throwError(error)),
              value: vcprReason,
            },
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
            id,
            status: vcprRequired ? "choose-datetime" : "choose-reason",
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
                    text: "Choose Location",
                  },
                  {
                    type: "mrkdwn",
                    text: "*Selected Location*",
                  },
                  {
                    type: "plain_text",
                    text: location,
                  },
                ],
              },
            ],
          },
        })
    )
    .catch(async (error: any) => await throwError(error));
};
