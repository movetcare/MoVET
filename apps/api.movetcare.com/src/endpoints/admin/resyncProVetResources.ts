import { defaultRuntimeOptions, functions, DEBUG } from "../../config/config";
import { configureResources } from "../../integrations/provet/entities/resource/configureResources";
import { requestIsAuthorized } from "./pos/requestIsAuthorized";

export const resyncProVetResources = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) console.log("resyncProVetResources DATA =>", data);
    if (await requestIsAuthorized(context)) {
      return await configureResources();
    } else return false;
  });
