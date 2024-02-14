import {
  functions,
  defaultRuntimeOptions,
  throwError,
} from "../../config/config";
import { updateProVetAppointment } from "../../integrations/provet/entities/appointment/updateProVetAppointment";

export const updateAppointment: Promise<boolean> = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth)
      if (!context.auth) throwError({ message: "MISSING AUTHENTICATION" });
    return await updateProVetAppointment({
      ...data,
      client: context.auth.uid,
    });
  });
