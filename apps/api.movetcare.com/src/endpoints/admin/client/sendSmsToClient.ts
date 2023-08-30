import { sendNotification } from "../../../notifications/sendNotification";
import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
} from "../../../config/config";
import { requestIsAuthorized } from "../pos/requestIsAuthorized";
export const sendSmsToClient = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async (
      { id, message }: { id: string; message: string },
      context: any,
    ): Promise<boolean> => {
      if (DEBUG) console.log("sendSmsToClient DATA =>", id);
      if (await requestIsAuthorized(context)) {
        sendNotification({
          type: "sms",
          payload: {
            client: id,
            message,
          },
        });
        return true;
      } else return false;
    },
  );
