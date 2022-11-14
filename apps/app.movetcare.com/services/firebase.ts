import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { environment } from "utilities";

const isProduction = environment === "production";
console.log(environment);
const firebase = initializeApp({
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
    : "movet-care-staging.appspot.com",
} as object);

// self.FIREBASE_APPCHECK_DEBUG_TOKEN = 'true';

// initializeAppCheck(firebase, {
//   provider: new ReCaptchaV3Provider('6LfnisYaAAAAAGruEJpAsGlTLVkguzkx5WOOb0h1'),
//   isTokenAutoRefreshEnabled: true,
// });

export const auth = getAuth(firebase);
export const functions = getFunctions(firebase);
export const firestore = getFirestore(firebase);
export const storage = getStorage(firebase);

if (environment === "development") {
  connectFunctionsEmulator(functions, "localhost", 5001);
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}
