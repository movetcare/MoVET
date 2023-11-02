import { updateCustomField } from "./../patient/updateCustomField";
import { throwError, DEBUG } from "../../../../config/config";
import { getProVetIdFromUrl } from "../../../../utils/getProVetIdFromUrl";
import { fetchEntity } from "../fetchEntity";
import { Request, Response } from "express";

export const processConsultationWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (
    !(typeof request.body.consultation_id === "string") ||
    request.body.consultation_id.length === 0
  )
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    const proVetConsultationData = await fetchEntity(
      "consultation",
      request.body?.consultation_id,
    );
    if (DEBUG)
      console.log(
        "processConsultationWebhook => proVetConsultationData",
        proVetConsultationData,
      );
    if (proVetConsultationData?.status === 9) {
      proVetConsultationData.patients.map((patient: string) =>
        updateCustomField(`${getProVetIdFromUrl(patient)}`, 2, "False"),
      );
    }
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(400).send({ received: false });
  }
};
