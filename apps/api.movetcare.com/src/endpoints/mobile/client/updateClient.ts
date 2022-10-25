import {
  functions,
  defaultRuntimeOptions,
  mobileClientApiKey,
  throwError,
} from "../../../config/config";
import {updateProVetClient} from "../../../integrations/provet/entities/client/updateProVetClient";

export const updateClient: Promise<boolean> = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (!context.auth)
      if (!context.auth) throwError({message: "MISSING AUTHENTICATION"});
    if (data?.apiKey === mobileClientApiKey) {
      return await updateProVetClient({...data, id: context.auth.uid});
    } else return false;
  });
