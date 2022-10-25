import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
} from "../../../config/config";
import {updateProVetAppointment} from "../../../integrations/provet/entities/appointment/updateProVetAppointment";

export const updateAppointment: Promise<boolean> = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth)
      if (!context.auth) throwError({message: "MISSING AUTHENTICATION"});
    if (data?.apiKey === mobileClientApiKey) {
      return await updateProVetAppointment({...data, client: context.auth.uid});
    } else return false;
  });
