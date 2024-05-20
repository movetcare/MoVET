import { DEBUG, admin, throwError } from "../../../config/config";
// import { sendClinicBookingRequestAdminNotification } from "../../../notifications/templates/sendClinicBookingRequestAdminNotification";
// import { sendClinicBookingRequestClientNotification } from "../../../notifications/templates/sendClinicBookingRequestClientNotification";
// import type { ClinicBooking } from "../../../types/booking";

export const archiveClinicBooking = async (id: string) => {
  if (DEBUG) console.log("archiveClientBooking", id);
  // const clinicData = (await admin
  //   .firestore()
  //   .collection("clinic_bookings")
  //   .doc(id)
  //   .get()
  //   .then((doc: any) => {
  //     if (DEBUG) console.log("archiveClientBooking doc.data(): ", doc.data());
  //     return doc.data();
  //   })
  //   .catch((error: any) => throwError(error))) as ClinicBooking;
  // if (clinicData?.client?.email) {
  //   await sendClinicBookingRequestAdminNotification(clinicData);
  //   await sendClinicBookingRequestClientNotification(clinicData);
  // }
  await admin
    .firestore()
    .collection("clinic_bookings")
    .doc(id)
    .set(
      {
        step: "complete",
        isActive: false,
        updatedOn: new Date(),
      },
      { merge: true },
    )
    .catch((error: any) => throwError(error));
};
