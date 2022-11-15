import { sendCancellationEmail } from "../../../../notifications/templates/sendCancellationEmail";
import { saveAppointment } from "./saveAppointment";
import {
  DEBUG,
  proVetApiUrl,
  request,
  throwError,
} from "../../../../config/config";

export const updateProVetAppointment = async (data: any): Promise<any> => {
  if (DEBUG) console.log("updateProVetAppointment -> ", data);
  const requestPayload: any = {
    modified: new Date(),
  };

  Object.entries(data).forEach(([key, value]: any) => {
    switch (key) {
      case "client":
        requestPayload.client = `${proVetApiUrl}/client/${value}/`;
        break;
      case "start":
        requestPayload.start = value;
        break;
      case "end":
        requestPayload.end = value;
        break;
      case "title":
        requestPayload.title = value;
        break;
      case "complaint":
        requestPayload.complaint = value;
        break;
      case "duration":
        requestPayload.duration = value;
        break;
      case "notes":
        requestPayload.notes = value;
        break;
      case "patients":
        requestPayload.patients = value.map(
          (patient: any) => `${proVetApiUrl}/patient/${patient}/`
        );
        break;
      case "user":
        requestPayload.user = `${proVetApiUrl}/user/${value}/`;
        break;
      case "active":
        requestPayload.active = value;
        break;
      case "type":
        requestPayload.type = parseInt(value as string);
        break;
      case "cancellation_reason_text":
        requestPayload.cancellation_reason_text = value;
        break;
      case "cancellation_reason":
        requestPayload.cancellation_reason = `${proVetApiUrl}/cancellationreason/${value}/`;
        break;
      default:
        break;
    }
  });

  const proVetAppointmentData = await request
    .patch(`/appointment/${data?.id}`, requestPayload)
    .then(async (response: any) => {
      const { data } = response;
      if (DEBUG) console.log("API Response: PATCH /appointment/ => ", data);
      return data;
    })
    .catch((error: any) => throwError(error));

  if (proVetAppointmentData && requestPayload.cancellation_reason)
    await sendCancellationEmail(`${data?.client}`, `${data?.id}`);

  return await saveAppointment(proVetAppointmentData, data.movetData);
};
