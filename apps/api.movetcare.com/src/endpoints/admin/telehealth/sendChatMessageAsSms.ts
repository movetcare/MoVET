import { UserRecord } from "firebase-admin/lib/auth/user-record";
import {
  defaultRuntimeOptions,
  functions,
  DEBUG,
} from "../../../config/config";
import { sendNotification } from "../../../notifications/sendNotification";
import { getAuthUserByEmail } from "../../../utils/auth/getAuthUserByEmail";
import { requestIsAuthorized } from "../../admin/pos/requestIsAuthorized";

export const sendChatMessageAsSms = functions
  .runWith(defaultRuntimeOptions)
  .https.onCall(async (data: any, context: any): Promise<boolean> => {
    if (DEBUG) console.log("sendChatMessageAsSms DATA =>", data);
    if (await requestIsAuthorized(context)) {
      const authUser: UserRecord | null = await getAuthUserByEmail(data?.email);
      if (authUser)
        await sendNotification({
          type: "sms",
          payload: {
            client: authUser?.uid,
            message: data?.message,
            subject: "Telehealth Chat Message Forward to SMS",
          },
        });
      return true;
    } else return false;
  });
