import {
  functions,
  defaultRuntimeOptions,
  throwError,
  DEBUG,
  admin,
} from "../../config/config";

export const clearAppointmentBookingSessions = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) {
      console.log("clearAppointmentBookingSessions data => ", data);
      console.log(
        "clearAppointmentBookingSessions context.auth => ",
        context.auth,
      );
    }
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    else {
      if (DEBUG) console.log("CONTEXT UID => ", context.auth.uid);
      return await admin
        .firestore()
        .collection("bookings")
        .where("client.uid", "==", `${context.auth.uid}`)
        .where("isActive", "==", true)
        .orderBy("createdAt", "desc")
        .get()
        .then(async (snapshot: any) => {
          const activeBookings: Array<any> = [];
          snapshot.forEach((doc: any) => {
            activeBookings.push(doc.id);
          });
          if (DEBUG)
            console.log(
              "getActiveAppointmentBooking => activeBookings",
              activeBookings,
            );
          await Promise.all(
            activeBookings.map(
              async (sessionId: string) =>
                await admin
                  .firestore()
                  .collection("bookings")
                  .doc(sessionId)
                  .set(
                    { isActive: false, updatedOn: new Date() },
                    { merge: true },
                  ),
            ),
          );
          return true;
        })
        .catch((error: any) => throwError(error));
    }
  });
