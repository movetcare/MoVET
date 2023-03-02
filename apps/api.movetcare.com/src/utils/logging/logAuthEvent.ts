import { getProVetIdFromUrl } from "./../getProVetIdFromUrl";
import { admin, throwError, DEBUG } from "../../config/config";
import { fetchEntity } from "../../integrations/provet/entities/fetchEntity";
import { savePatient } from "../../integrations/provet/entities/patient/savePatient";
import { timestampString } from "../timestampString";
import { saveClient } from "../../integrations/provet/entities/client/saveClient";
import type { EventLogPayload } from "../../types/event";

export const logAuthEvent = async (
  payload: EventLogPayload
): Promise<boolean> => {
  if (payload?.data?.email) {
    const uid = await admin
      .auth()
      .getUserByEmail(payload?.data?.email.toLowerCase())
      .then((userRecord: any) => userRecord?.uid)
      .catch(() => false);
    if (uid) {
      if (DEBUG)
        console.log(
          "SYNCING PROVET CLIENT & PATIENT DATA FOR CLIENT ->",
          payload?.data?.email.toLowerCase()
        );
      const proVetClientData = await fetchEntity("client", parseInt(uid));
      saveClient(uid, proVetClientData);
      if (proVetClientData?.patients) {
        proVetClientData?.patients.map(async (patient: any) => {
          const proVetPatientData = await fetchEntity(
            "patient",
            getProVetIdFromUrl(patient)
          );
          savePatient(proVetPatientData);
        });
      }

      return await admin
        .firestore()
        .collection("clients")
        .doc(uid)
        .collection("logs")
        .doc(
          `auth_${
            payload.success === true
              ? "success"
              : payload.success === false
              ? "fail"
              : "attempt"
          }_${timestampString(new Date(), "_")}`
        )
        .set({
          ...payload,
          timestamp: new Date(),
        })
        .then(() => true)
        .catch((error: any) => throwError(error));
    }
  }
  return false;
};
