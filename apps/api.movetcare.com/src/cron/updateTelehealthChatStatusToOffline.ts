import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateTelehealthChatStatusToOffline: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("0 16 * * *")
  .onRun(
    async () =>
      await admin
        .firestore()
        .collection("alerts")
        .doc("telehealth")
        .set(
          {
            isOnline: false,
            queueSize: 0,
            waitTime: 5,
            updatedOn: new Date(),
          },
          { merge: true }
        )
        .then(() =>
          sendNotification({
            type: "slack",
            payload: {
              message: ":robot_face: Telehealth status changed to OFFLINE",
            },
          })
        )
        .catch(async (error: any) => throwError(error))
  );
