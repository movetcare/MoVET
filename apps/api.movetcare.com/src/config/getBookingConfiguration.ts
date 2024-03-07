const DEBUG = true;
import { Request, Response } from "express";
import { admin, throwError } from "./config";
export const getBookingConfiguration = async (
  request: Request,
  response: Response,
): Promise<any> => {
  if (DEBUG) console.log("getBookingConfiguration req =>", request?.body);
  await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) =>
      doc.exists
        ? response.status(200).send(doc.data())
        : response.status(404).send(),
    )
    .catch((error: any) => throwError(error));
  return response.status(500).send();
};
