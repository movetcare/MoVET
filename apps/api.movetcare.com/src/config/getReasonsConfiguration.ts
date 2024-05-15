import { Request, Response } from "express";
import { DEBUG, admin, throwError } from "./config";
export const getReasonsConfiguration = async (
  request: Request,
  response: Response,
): Promise<any> => {
  if (DEBUG) console.log("getReasonsConfiguration req =>", request?.body);
  const reasonGroups = await admin
    .firestore()
    .collection("reason_groups")
    .get()
    .then((querySnapshot: any) => {
      if (DEBUG)
        console.log("reason_groups found => ", querySnapshot?.docs?.length);
      const reasonGroups: Array<{
        name: string;
        department: number;
        id: string;
        isVisible: boolean;
        updatedOn: any;
      }> = [];
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) =>
          reasonGroups.push({
            ...doc.data(),
          }),
        );
      return reasonGroups;
    })
    .catch((error: any) => throwError(error));
  const reasons = await admin
    .firestore()
    .collection("reasons")
    .get()
    .then((querySnapshot: any) => {
      if (DEBUG) console.log("reasons found => ", querySnapshot?.docs?.length);
      const reasons: Array<any> = [];
      if (querySnapshot?.docs?.length > 0)
        querySnapshot.forEach(async (doc: any) =>
          reasons.push({
            ...doc.data(),
          }),
        );
      return reasons;
    })
    .catch((error: any) => throwError(error));
  if (DEBUG) {
    console.log("reasonGroups", reasonGroups);
    console.log("reasons", reasons);
  }
  if (
    reasonGroups &&
    reasons &&
    reasonGroups?.length > 0 &&
    reasons?.length > 0
  )
    return response.status(200).send({ reasonGroups, reasons });
  else return response.status(404).send();
};
