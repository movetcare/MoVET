import {
  setDoc,
  doc,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getToken, isSupported, onMessage } from "firebase/messaging";
import { firestore, messages } from "services/firebase";
import { environment } from "utilities";

export const notifications = {
  configure: async (userId: string) => {
    console.log("CONFIGURING NOTIFICATIONS");
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
            .then(async (currentToken: string) => {
              console.log("CLIENT PUSH TOKEN", currentToken);
              if (currentToken) {
                let existingTokens: any[] = [];
                const tokenAlreadyExists = await getDoc(
                  doc(firestore, "fcmTokensAdmin", userId),
                ).then((doc: any) => {
                  if (doc.exists()) {
                    existingTokens = doc.data().tokens;
                    if (
                      doc
                        .data()
                        .tokens.find(
                          (token: any) => token.token === currentToken,
                        )
                    )
                      return true;
                  } else return false;
                });
                if (tokenAlreadyExists === false)
                  await setDoc(doc(firestore, "fcmTokensAdmin", userId), {
                    tokens: [
                      {
                        token: currentToken,
                        isActive: true,
                        device: navigator.userAgent,
                        createdOn: new Date(),
                      },
                    ],
                    createdOn: serverTimestamp(),
                  });
                else if (tokenAlreadyExists === undefined)
                  await setDoc(
                    doc(firestore, "fcmTokensAdmin", userId),
                    {
                      tokens: arrayUnion({
                        token: currentToken,
                        isActive: true,
                        device: navigator.userAgent,
                        createdOn: new Date(),
                      }),
                      updatedOn: serverTimestamp(),
                    },
                    { merge: true },
                  );
                else if (tokenAlreadyExists) {
                  const newTokenData = existingTokens.map((token: any) => {
                    if (token.token === currentToken) {
                      return {
                        token: currentToken,
                        isActive: true,
                        device: navigator.userAgent,
                        updatedOn: new Date(),
                        createdOn: token.createdOn,
                      };
                    } else return token;
                  });
                  await setDoc(
                    doc(firestore, "fcmTokensAdmin", userId),
                    {
                      tokens: newTokenData,
                      updatedOn: serverTimestamp(),
                    },
                    { merge: true },
                  );
                }
                return currentToken;
              } else {
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
