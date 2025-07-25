import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { admin, throwError, DEBUG } from "../../config/config";
import { handleFailedBooking } from "../../booking/session/handleFailedBooking";

export const verifyClientDataExists = async (authUser: UserRecord) =>
  await admin
    .firestore()
    .collection("clients")
    .doc(authUser?.uid)
    .get()
    .then((doc: any) => {
      if (DEBUG)
        console.log("verifyClientDataExists =>", {
          docEmail: doc.data()?.email,
          docFirstName: doc.data()?.firstName,
          docLastName: doc.data()?.lastName,
          docPhone: doc.data()?.phone,
          authEmail: authUser?.email,
          authPhone: authUser?.phoneNumber,
          authDisplayName: authUser?.displayName,
        });
      if (
        doc.data()?.email &&
        doc.data()?.firstName &&
        doc.data()?.lastName &&
        doc.data()?.phone &&
        authUser?.email &&
        authUser?.phoneNumber &&
        authUser?.displayName
      )
        return false;
      else return true;
    })
    .catch(async (error: any) => {
      throwError(error);
      return await handleFailedBooking(error, "GET CLIENT FAILED");
    });
