import { getToken } from "firebase/messaging";
import localforage from "localforage";
import { messages } from "services/firebase";
import { environment } from "utilities";

export const notifications = {
  init: async () => {
    try {
      const tokenInLocalStorage = await localforage.getItem("fcm_token");
      if (tokenInLocalStorage !== null) return tokenInLocalStorage;
      const status = await Notification.requestPermission();
      if (status && status === "granted" && messages) {
        const fcm_token: any = getToken(messages, {
          vapidKey:
            environment === "production"
              ? "BLrLxh7Z6MOHnuBUWwJR0RxBlRtA_3v61x6hZ_nDrrBkuurZbSsgMHM6xSNkDFbnkgfGPKQawzj71Y1mCMjeQKk"
              : "BJa6PTEnoKGVnQSZfRbB6LZDvaYnrHJyllf7t13fYpjlrJq7roYqIyFX1xZVKo3V6K3Ay7Sa7M8hE_cRSO0nyaY",
        })
          .then((currentToken: any) => {
            if (currentToken) console.log("fetched token", currentToken);
            else
              console.error(
                "No registration token available. Request permission to generate one.",
              );
          })
          .catch((err: any) =>
            console.error("An error occurred while retrieving token. ", err),
          );
        if (fcm_token) {
          localforage.setItem("fcm_token", fcm_token);
          return fcm_token;
        }
      } else {
        console.error("No permission to send push");
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
