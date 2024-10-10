import {
  functions,
  defaultRuntimeOptions,
  throwError,
} from "../../config/config";
import { createProVetPatient } from "../../integrations/provet/entities/patient/createProVetPatient";

export const createPatient = functions
  .runWith({ ...defaultRuntimeOptions, memory: "4GB" })
  .https.onCall(async (data: any, context: any): Promise<false | boolean> => {
    if (!context.auth) throwError({ message: "MISSING AUTHENTICATION" });
    return await createProVetPatient({ ...data, client: context.auth.uid });
  });
