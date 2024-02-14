import { DEBUG, defaultRuntimeOptions, functions } from "../../config/config";
import { configureReasons } from "../../integrations/provet/entities/reason/configureReasons";
import { sendNotification } from "../../notifications/sendNotification";
import { requestIsAuthorized } from "./pos/requestIsAuthorized";

export const resyncReasons = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) console.log("resyncReasons DATA =>", data);
    if (await requestIsAuthorized(context)) {
      if (await configureReasons()) {
        sendNotification({
          type: "slack",
          payload: {
            message: `:point_right: ${
              context.auth.email || "An Admin"
            } has Re-Synced all Reasons in ProVet w/ MoVET`,
          },
        });
        return true;
      }
    }
    return false;
  });
