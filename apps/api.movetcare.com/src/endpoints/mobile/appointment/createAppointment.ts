import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
} from "../../../config/config";
import {createProVetAppointment} from "../../../integrations/provet/entities/appointment/createProVetAppointment";

export const createAppointment = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean | string> => {
    if (!context.auth) return throwError({ message: "MISSING AUTHENTICATION" });
    if (data?.apiKey === mobileClientApiKey) {
      return await createProVetAppointment(
        { ...data?.proVetData, client: context.auth.uid },
        { ...data?.movetData }
      );
    } else return false;
  });
