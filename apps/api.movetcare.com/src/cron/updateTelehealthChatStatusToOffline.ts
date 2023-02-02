import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
  environment,
} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateTelehealthChatStatusToOffline: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("0 17 * * *")
  .timeZone("America/Denver")
  .onRun(
    () =>
      environment?.type === "production" &&
      admin
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
        .catch((error: any) => throwError(error))
  );
