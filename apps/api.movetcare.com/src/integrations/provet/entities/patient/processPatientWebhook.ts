import { throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
import { savePatient } from "./savePatient";

export const processPatientWebhook = async (
  request: any,
  response: any
): Promise<any> => {
  if (
    !(typeof request.body.patient_id === "string") ||
    request.body.patient_id.length === 0
  )
    throwError({ message: "INVALID_PAYLOAD" });
  try {
    const proVetPatientData = await fetchEntity(
      "patient",
      request.body?.patient_id
    );
    await savePatient(proVetPatientData);
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
