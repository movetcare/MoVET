import { sendNotification } from "./../../../notifications/sendNotification";
import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
} from "../../../config/config";
import { requestIsAuthorized } from "../../admin/pos/requestIsAuthorized";
export const checkInText = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(
    async ({ id }: { id: string }, context: any): Promise<boolean> => {
      if (DEBUG) console.log("checkInText DATA =>", id);
      const isAuthorized = await requestIsAuthorized(context);
      if (isAuthorized) {
        sendNotification({
          type: "sms",
          payload: {
            client: id,
            message:
              "This is MoVET checking in to let you know that we are ready to start your appointment! Please meet us at the front desk.",
            subject: "We're ready to start your appointment! (SMS)",
          },
        });
        return true;
      } else return false;
    }
  );
