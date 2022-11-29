import { Booking } from "types";
import { firestore } from "../firebase";
const DEBUG = false;
export const setBooking = async (payload: Booking) => {
  if (payload?.id && payload?.step === "cancelled-client")
    try {
      return await firestore
        .collection("bookings")
        .doc(`${payload?.id}`)
        .set(
          {
            step: "cancelled-client",
            updatedOn: new Date(),
          } as Booking,
          { merge: true }
        )
        .then(() => {
          if (DEBUG)
            console.log("(API) FIRESTORE QUERY -> setBooking() =>", {
              payload,
            });
          return true;
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    } catch (error) {
      console.error(error);
      return false;
    }
  else return false;
};
