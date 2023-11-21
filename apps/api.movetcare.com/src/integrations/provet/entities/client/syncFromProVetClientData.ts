import { admin } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
import { saveClient } from "./saveClient";

export const syncFromProVetClientData = async (email: string) => {
  if (email) {
    const uid = await admin
      .auth()
      .getUserByEmail(email?.toLowerCase())
      .then((userRecord: any) => userRecord?.uid)
      .catch(() => false);
    const proVetClientData = await fetchEntity("client", parseInt(uid));
    saveClient(uid, proVetClientData);
  }
};
