import { Request, Response } from "express";
import { DEBUG, admin, throwError } from "./config";
export const getOpeningsConfiguration = async (
  request: Request,
  response: Response,
): Promise<any> => {
  if (DEBUG) console.log("getOpeningsConfiguration req =>", request?.body);
  return await admin
    .firestore()
    .collection("configuration")
    .doc("openings")
    .get()
    .then((doc: any) => {
      if (DEBUG) console.log("getOpeningsConfiguration query", doc.data());
      return doc.exists
        ? response.status(200).send(doc.data())
        : response.status(404).send();
    })
    .catch((error: any) => throwError(error));
};
