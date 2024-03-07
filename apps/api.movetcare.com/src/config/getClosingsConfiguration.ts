import { Request, Response } from "express";
import { DEBUG, admin, throwError } from "./config";
export const getClosingsConfiguration = async (
  request: Request,
  response: Response,
): Promise<any> => {
  if (DEBUG) console.log("getClosingsConfiguration req =>", request?.body);
  // TODO: Loop Through Data and Convert Dates into Dates Objects
  return await admin
    .firestore()
    .collection("configuration")
    .doc("closures")
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("getClosingsConfiguration query", doc.data());
      return doc.exists
        ? response.status(200).send(doc.data())
        : response.status(404).send();
    })
    .catch((error: any) => throwError(error));
};
