import "firebase/messaging";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import environment from "utils/environment";
import { getMessaging, getToken } from "firebase/messaging";
import localforage from "localforage";

const isProduction = environment === "production";
const firebase: any = initializeApp({
  projectId: isProduction ? "movet-care" : "movet-care-staging",
  appId: isProduction
    ? "1:516680717319:web:f6ce71c55c87f7d82006a2"
    : "1:411678558724:web:5a66f09432ca910d9fc351",
  apiKey: isProduction
    ? "AIzaSyAiepyL3_lhpvoTDywIXYXVJFpm2bLvSHg"
    : "AIzaSyCRJEv6XXchM9e2Ibq4C-yoR346vmsBMFk",
  authDomain: isProduction
    ? "movet-care.firebaseapp.com"
    : "movet-care-staging.firebaseapp.com",
  storageBucket: isProduction
    ? "movet-care.appspot.com"
    : "staging-movet-care.appspot.com",
  messagingSenderId: isProduction ? "516680717319" : "411678558724",
} as object);

const messaging = typeof window !== "undefined" ? getMessaging(firebase) : null;

export const pushConfig = {
  init: async () => {
    try {
      const tokenInLocalStorage = await localforage.getItem("fcm_token");
      if (tokenInLocalStorage !== null) return tokenInLocalStorage;
      const status = await Notification.requestPermission();
      if (status && status === "granted" && messaging) {
        const fcm_token: any = getToken(messaging, {
          vapidKey: isProduction
            ? "BLrLxh7Z6MOHnuBUWwJR0RxBlRtA_3v61x6hZ_nDrrBkuurZbSsgMHM6xSNkDFbnkgfGPKQawzj71Y1mCMjeQKk"
            : "BJa6PTEnoKGVnQSZfRbB6LZDvaYnrHJyllf7t13fYpjlrJq7roYqIyFX1xZVKo3V6K3Ay7Sa7M8hE_cRSO0nyaY",
        })
          .then((currentToken: any) => {
            if (currentToken) console.log("currentToken", currentToken);
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
export const messages: any = messaging;
export const auth: any = getAuth(firebase);
export const functions: any = getFunctions(firebase);
export const firestore: any = getFirestore(firebase);
export const storage = getStorage(firebase);

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
