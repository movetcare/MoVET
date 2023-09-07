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
import { UAParser } from "ua-parser-js";

export const notifications = {
  configure: async (user: any) => {
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
              if (currentToken) {
                if (
                  user?.uid === "0" ||
                  user?.uid === "bBbNFLLYA9O7Xi4oAVEAPP34rmm2"
                )
                  console.log("PUSH TOKEN", currentToken);
                const deviceInfo = JSON.parse(
                  JSON.stringify(UAParser(), (key: any, value: any) =>
                    value === undefined ? null : value,
                  ),
                );
                let existingTokens: any[] = [];
                const tokenAlreadyExists = await getDoc(
                  doc(firestore, "fcmTokensAdmin", user?.uid),
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
                  await setDoc(doc(firestore, "fcmTokensAdmin", user?.uid), {
                    tokens: [
                      {
                        token: currentToken,
                        isActive: true,
                        device: deviceInfo,
                        createdOn: new Date(),
                      },
                    ],
                    user: {
                      displayName: user?.displayName,
                      email: user?.email,
                      emailVerified: user?.emailVerified,
                      photoURL: user?.photoURL,
                      uid: user?.uid,
                      phoneNumber: user?.phoneNumber,
                    },
                    createdOn: serverTimestamp(),
                  });
                else if (tokenAlreadyExists === undefined) {
                  let tokenToMakeActive = null;
                  existingTokens.forEach((token: any) => {
                    if (token.token === currentToken) {
                      token.isActive = true;
                      token.updatedOn = new Date();
                      tokenToMakeActive = currentToken;
                    }
                  });
                  if (tokenToMakeActive)
                    await setDoc(
                      doc(firestore, "fcmTokensAdmin", user?.uid),
                      {
                        tokens: existingTokens,
                        user: {
                          displayName: user?.displayName,
                          email: user?.email,
                          emailVerified: user?.emailVerified,
                          photoURL: user?.photoURL,
                          uid: user?.uid,
                          phoneNumber: user?.phoneNumber,
                        },
                        updatedOn: serverTimestamp(),
                      },
                      { merge: true },
                    );
                  else
                    await setDoc(
                      doc(firestore, "fcmTokensAdmin", user?.uid),
                      {
                        tokens: arrayUnion({
                          token: currentToken,
                          isActive: true,
                          device: deviceInfo,
                          createdOn: new Date(),
                        }),
                        user: {
                          displayName: user?.displayName,
                          email: user?.email,
                          emailVerified: user?.emailVerified,
                          photoURL: user?.photoURL,
                          uid: user?.uid,
                          phoneNumber: user?.phoneNumber,
                        },
                        updatedOn: serverTimestamp(),
                      },
                      { merge: true },
                    );
                } else if (tokenAlreadyExists) {
                  const newTokenData = existingTokens.map((token: any) => {
                    if (token.token === currentToken) {
                      return {
                        token: currentToken,
                        isActive: true,
                        device: deviceInfo,
                        updatedOn: new Date(),
                        createdOn: token.createdOn,
                      };
                    } else return token;
                  });
                  await setDoc(
                    doc(firestore, "fcmTokensAdmin", user?.uid),
                    {
                      tokens: newTokenData,
                      user: {
                        displayName: user?.displayName,
                        email: user?.email,
                        emailVerified: user?.emailVerified,
                        photoURL: user?.photoURL,
                        uid: user?.uid,
                        phoneNumber: user?.phoneNumber,
                      },
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
      console.error("Notifications not supported! Missing Browser APIs");
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
