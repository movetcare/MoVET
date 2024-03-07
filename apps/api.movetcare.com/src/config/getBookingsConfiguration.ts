import { Request, Response } from "express";
import { DEBUG, admin, throwError } from "./config";
export const getBookingsConfiguration = async (
  request: Request,
  response: Response,
): Promise<any> => {
  if (DEBUG) console.log("getBookingsConfiguration req =>", request?.body);
  return await admin
    .firestore()
    .collection("configuration")
    .doc("bookings")
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("getBookingsConfiguration query", doc.data());
      return doc.exists
        ? response.status(200).send({
            ...doc.data(),
            winterHousecallMode: {
              enableForNewClientsOnly:
                doc.data()?.winterHousecallMode?.enableForNewClientsOnly,
              enableForNewPatientsOnly:
                doc.data()?.winterHousecallMode?.enableForNewPatientsOnly,
              isActiveOnMobileApp:
                doc.data()?.winterHousecallMode?.isActiveOnMobileApp,
              isActiveOnWebApp:
                doc.data()?.winterHousecallMode?.isActiveOnWebApp,
              isActiveOnWebsite:
                doc.data()?.winterHousecallMode?.isActiveOnWebsite,
              message: doc.data()?.winterHousecallMode?.message,
              startDate: doc.data()?.winterHousecallMode?.startDate?.toDate(),
              endDate: doc.data()?.winterHousecallMode?.endDate?.toDate(),
            },
            updatedOn: new Date(),
          })
        : response.status(404).send();
    })
    .catch((error: any) => throwError(error));
};
