import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import firebaseEmulatorConfig from "./firebase.json";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
import { Platform } from "react-native";
const { emulators } = firebaseEmulatorConfig;

const FIREBASE_KEYS =
  // !isProductionEnvironment && Platform.OS === "ios"
  //   ? {
  //       API_KEY: "AIzaSyCRJEv6XXchM9e2Ibq4C-yoR346vmsBMFk",
  //       AUTH_DOMAIN: "movet-care-staging.firebaseapp.com",
  //       DATABASE_URL: "https://movet-care-staging.firebaseio.com",
  //       PROJECT_ID: "movet-care-staging",
  //       STORAGE_BUCKET: "movet-care-staging.appspot.com",
  //       MESSAGING_SENDER_ID: "411678558724",
  //       APP_ID: "1:411678558724:web:5a66f09432ca910d9fc351",
  //       MEASUREMENT_ID: "G-VPRZ7WBLWB",
  //     }
  //   :
  {
    API_KEY: "AIzaSyAiepyL3_lhpvoTDywIXYXVJFpm2bLvSHg",
    AUTH_DOMAIN: "movet-care.firebaseapp.commovet-care.firebaseapp.com",
    DATABASE_URL: "https://movet-care.firebaseio.com",
    PROJECT_ID: "movet-care",
    STORAGE_BUCKET: "movet-care.appspot.com",
    MESSAGING_SENDER_ID: "516680717319",
    APP_ID: "1:516680717319:web:f6ce71c55c87f7d82006a2",
    MEASUREMENT_ID: "G-Y9896HXDFN",
  };

const app = !getApps().length
  ? initializeApp({
      apiKey: FIREBASE_KEYS.API_KEY,
      authDomain: FIREBASE_KEYS.AUTH_DOMAIN,
      databaseURL: FIREBASE_KEYS.DATABASE_URL,
      projectId: FIREBASE_KEYS.PROJECT_ID,
      storageBucket: FIREBASE_KEYS.STORAGE_BUCKET,
      messagingSenderId: FIREBASE_KEYS.MESSAGING_SENDER_ID,
      appId: FIREBASE_KEYS.APP_ID,
      measurementId: FIREBASE_KEYS.MEASUREMENT_ID,
    })
  : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// if (!isProductionEnvironment && __DEV__ && Platform.OS === "ios") {
//   console.log("DEVELOPMENT MODE DETECTED - USING LOCAL FIREBASE EMULATORS", {
//     auth: {
//       host: emulators.auth.host,
//       port: emulators.auth.port,
//     },
//     firestore: {
//       host: emulators.firestore.host,
//       port: emulators.firestore.port,
//     },
//     storage: {
//       host: emulators.storage.host,
//       port: emulators.storage.port,
//     },
//   });
//   connectAuthEmulator(
//     auth,
//     `http://${emulators.auth.host}:${emulators.auth.port}`,
//   );
//   connectFirestoreEmulator(
//     getFirestore(app),
//     emulators.firestore.host,
//     emulators.firestore.port,
//   );
//   connectStorageEmulator(
//     getStorage(app),
//     emulators.storage.host,
//     emulators.storage.port,
//   );
//   connectFunctionsEmulator(
//     getFunctions(app),
//     emulators.functions.host,
//     emulators.functions.port,
//   );
// }
