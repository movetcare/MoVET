import type { Booking } from "types";
import { firestore } from "../firebase";
const DEBUG = false;
export const setBooking = async (payload: Booking) => {
  const bookingRef = firestore.collection("bookings").doc(`${payload?.id}`);
  if (
    payload?.id &&
    (payload?.step === "success" ||
      payload?.step === "complete" ||
      payload?.step === "restart" ||
      payload?.step === "cancelled-client")
  )
    try {
      return await bookingRef
        .set(
          {
            step: payload?.step,
            updatedOn: new Date(),
          } as Booking,
          { merge: true },
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
  else if (payload?.id && payload?.cancelReason)
    try {
      return await bookingRef
        .set(
          {
            ...payload,
            updatedOn: new Date(),
          } as Booking,
          { merge: true },
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

export const setClinicBooking = async (payload: Booking) => {
  const bookingRef = firestore
    .collection("clinic_bookings")
    .doc(`${payload?.id}`);
  if (
    payload?.id &&
    (payload?.step === "success" ||
      payload?.step === "complete" ||
      payload?.step === "restart" ||
      payload?.step === "cancelled-client")
  )
    try {
      return await bookingRef
        .set(
          {
            step: payload?.step,
            updatedOn: new Date(),
          } as Booking,
          { merge: true },
        )
        .then(() => {
          if (DEBUG)
            console.log("(API) FIRESTORE QUERY -> setClinicBooking() =>", {
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
  else if (payload?.id && payload?.cancelReason)
    try {
      return await bookingRef
        .set(
          {
            ...payload,
            updatedOn: new Date(),
          } as Booking,
          { merge: true },
        )
        .then(() => {
          if (DEBUG)
            console.log("(API) FIRESTORE QUERY -> setClinicBooking() =>", {
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
