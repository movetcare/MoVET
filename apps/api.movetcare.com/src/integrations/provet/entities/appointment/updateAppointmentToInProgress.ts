import { admin } from "../../../../config/config";

export const updateAppointmentToInProgress = async (options: {
  id: number;
}): Promise<void> =>
  admin
    .firestore()
    .collection("appointments")
    .doc(`${options?.id}`)
    .set({ status: "IN-PROGRESS", updatedOn: new Date() }, { merge: true });
