import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
} from "../../../config/config";
import {createProVetPatient} from "../../../integrations/provet/entities/patient/createProVetPatient";

export const createPatient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<false | boolean> => {
    if (!context.auth)
      if (!context.auth) throwError({message: "MISSING AUTHENTICATION"});
    if (data?.apiKey === mobileClientApiKey) {
      return await createProVetPatient({...data, client: context.auth.uid});
    } else return false;
  });
