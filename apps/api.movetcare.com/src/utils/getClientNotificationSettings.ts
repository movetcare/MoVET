import {admin, DEBUG, throwError} from "../config/config";

export interface UserNotificationSettings {
  sendEmail: boolean;
  sendSms: boolean;
}

export const getClientNotificationSettings = async (
  id: string
): Promise<UserNotificationSettings | false> =>
  await admin
    .firestore()
    .collection("clients")
    .doc(id)
    .get()
    .then((document: any) => {
      if (DEBUG)
        console.log("RETRIEVED CLIENT NOTIFICATION PREFERENCES", {
          sendEmail: document.data()?.sendEmail,
          sendSms: document.data()?.sendSms,
        });
      return {
        sendEmail: document.data()?.sendEmail,
        sendSms: document.data()?.sendSms,
      };
    })
    .catch((error: any) => throwError(error));
