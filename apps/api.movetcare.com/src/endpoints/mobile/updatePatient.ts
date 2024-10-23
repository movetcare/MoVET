import {
  functions,
  defaultRuntimeOptions,
  throwError,
} from "../../config/config";
import { updateProVetPatient } from "../../integrations/provet/entities/patient/updateProVetPatient";

export const updatePatient: Promise<boolean> = functions
  .runWith({ ...defaultRuntimeOptions, memory: "2GB" })
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth) throwError({ message: "MISSING AUTHENTICATION" });
    return await updateProVetPatient({ ...data, client: context.auth.uid });
  });
