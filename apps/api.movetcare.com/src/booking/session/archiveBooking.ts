import { sendBookingRequestAdminNotification } from "../../notifications/templates/sendBookingRequestAdminNotification";
import { throwError, admin, DEBUG } from "../../config/config";
import { sendBookingRequestClientNotification } from "../../notifications/templates/sendBookingRequestClientNotification";

export const archiveBooking = async (id: string) => {
  if (DEBUG) console.log("archiveBooking", id);
  const {
    locationType,
    notes,
    numberOfPets,
    numberOfPetsWithMinorIllness,
    selectedDate,
    selectedTime,
    specificTime,
    firstName,
    lastName,
    email,
    phone,
    createdAt,
  }: any = await admin
    .firestore()
    .collection("bookings")
    .doc(id)
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("archiveBooking doc.data(): ", doc.data());
      return doc.data();
    })
    .catch((error: any) => throwError(error));
  if (email) {
    await sendBookingRequestAdminNotification({
      id,
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      firstName,
      lastName,
      email,
      phone,
      createdAt,
    });
    await sendBookingRequestClientNotification({
      id,
      locationType,
      notes,
      numberOfPets,
      numberOfPetsWithMinorIllness,
      selectedDate,
      selectedTime,
      specificTime,
      firstName,
      lastName,
      email,
      phone,
      createdAt,
    });
  }
  await admin
    .firestore()
    .collection("bookings")
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
