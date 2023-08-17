
import { firestore } from "../firebase";
export const getAppointmentFromBooking = async (id: string) => await firestore.collection("bookings").doc(`${id}`).get().then((doc: any) => doc.data()).catch((error) => {
    console.error(error);
    return false;
});