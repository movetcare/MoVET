import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
  environment,
} from "../config/config";
import { sendNotification } from "../notifications/sendNotification";

export const updateTelehealthChatStatusToOnline: Promise<void> = functions
  .runWith(defaultRuntimeOptions)
  .pubsub.schedule("0 9 * * 1-5")
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
            isOnline: true,
            queueSize: 0,
            waitTime: 1,
            updatedOn: new Date(),
          },
          { merge: true },
        )
        .then(() =>
          sendNotification({
            type: "slack",
            payload: {
              message: ":robot_face: Telehealth status changed to ONLINE",
            },
          }),
        )
        .catch((error: any) => throwError(error)),
  );
