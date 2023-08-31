import { getToken, isSupported, onMessage } from "firebase/messaging";
import { messages } from "services/firebase";
import { environment } from "utilities";

export const notifications = {
  configure: async () => {
    if (await isSupported())
      try {
        const status = await Notification.requestPermission();
        if (status && status === "granted" && messages)
          return await getToken(messages, {
            vapidKey:
              environment === "production"
                ? "BLrLxh7Z6MOHnuBUWwJR0RxBlRtA_3v61x6hZ_nDrrBkuurZbSsgMHM6xSNkDFbnkgfGPKQawzj71Y1mCMjeQKk"
                : "BJa6PTEnoKGVnQSZfRbB6LZDvaYnrHJyllf7t13fYpjlrJq7roYqIyFX1xZVKo3V6K3Ay7Sa7M8hE_cRSO0nyaY",
          })
            .then((currentToken: string) => {
              console.log("CLIENT PUSH TOKEN", currentToken);
              if (currentToken) return currentToken;
              else {
                console.error(
                  "No registration token available. Request permission to generate one.",
                );
                return false;
              }
            })
            .catch((error: any) => {
              console.error(
                "An error occurred while retrieving token. ",
                error,
              );
              return false;
            });
        else return "No permission to send push";
      } catch (error) {
        console.error(
          "CATCH An error occurred while retrieving token. ",
          error,
        );
        return false;
      }
    else {
      console.log("Notifications not supported! Missing Browser APIs");
      return false;
    }
  },
  onMessageListener: async () =>
    new Promise((resolve) => {
      onMessage(messages, (payload) => {
        resolve(payload);
      });
    }),
};
