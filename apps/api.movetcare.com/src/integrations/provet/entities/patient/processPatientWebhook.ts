import { Request, Response } from "express";
import { throwError } from "../../../../config/config";
import { fetchEntity } from "../fetchEntity";
import { savePatient } from "./savePatient";

export const processPatientWebhook = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  if (
    !(typeof request.body.patient_id === "string") ||
    request.body.patient_id.length === 0
  )
    throwError({
      message: "INVALID_PAYLOAD => " + JSON.stringify(request.body),
    });
  try {
    const proVetPatientData = await fetchEntity(
      "patient",
      request.body?.patient_id,
    );
    await savePatient(proVetPatientData);
    return response.status(200).send({ received: true });
  } catch (error: any) {
    throwError(error);
    return response.status(500).send({ received: false });
  }
};
