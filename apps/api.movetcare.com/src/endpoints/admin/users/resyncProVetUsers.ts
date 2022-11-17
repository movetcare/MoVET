import {defaultRuntimeOptions, functions, DEBUG} from "../../../config/config";
import {configureProVetUsers} from "../../../integrations/provet/entities/user/configureProVetUsers";
import {requestIsAuthorized} from "../../admin/pos/requestIsAuthorized";

export const resyncProVetUsers = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) console.log("resyncProVetUsers DATA =>", data);
    if (await requestIsAuthorized(context)) {
       configureProVetUsers();
      return true;
    } else return false;
  });
