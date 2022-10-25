import {
  functions,
  defaultRuntimeOptions,
  admin,
  throwError,
} from "../config/config";
import {logEvent} from "../utils/logging/logEvent";

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
          {merge: true}
        )
        .then(
          async () =>
            await logEvent({
              tag: "force-telehealth-chat-offline",
              origin: "api",
              success: true,
              data: {
                message: "Telehealth Chat Status Updated to \"OFFLINE\"",
                isOnline: false,
                queueSize: 0,
                waitTime: 5,
                updatedOn: new Date(),
              },
              sendToSlack: true,
            })
        )
        .catch(async (error: any) => await throwError(error))
  );
