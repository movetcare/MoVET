import { updateCustomField } from "./../patient/updateCustomField";
import { throwError } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
const DEBUG = true;
export const processConsultationWebhook = async (
  request: any,
  response: any
): Promise<any> => {
  if (
    !(typeof request.body.consultation_id === "string") ||
    request.body.consultation_id.length === 0
  )
    throwError({ message: "INVALID_PAYLOAD" });
  try {
    const proVetConsultationData = await fetchEntity(
      "consultation",
      request.body?.consultation_id
    );
    if (DEBUG)
      console.log(
        "processConsultationWebhook => proVetConsultationData",
        proVetConsultationData
      );
    if (proVetConsultationData?.status === 9) {
      proVetConsultationData.patients.map(
        async (patient: string) =>
          await updateCustomField(`${getProVetIdFromUrl(patient)}`, 2, "False")
      );
    }
    return response.status(200).send({ received: true });
  } catch (error: any) {
    if (DEBUG) console.error(error);
    return response.status(400).send({ received: false });
  }
};
