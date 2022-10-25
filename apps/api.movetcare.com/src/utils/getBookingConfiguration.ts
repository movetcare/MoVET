import {admin, throwError} from "../config/config";
export const getBookingConfiguration = async () =>
  await admin
    .firestore()
    .collection("configuration")
    .doc("booking")
    .get()
    .then((doc: any) => doc.data())
    .catch(async (error: any) => await throwError(error));
