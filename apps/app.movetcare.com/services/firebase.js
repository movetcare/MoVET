"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.firestore = exports.functions = exports.auth = void 0;
const app_1 = require("firebase/app");
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const functions_1 = require("firebase/functions");
const storage_1 = require("firebase/storage");
const utilities_1 = require("utilities");
const isProduction = utilities_1.environment === "production";
const firebase = (0, app_1.initializeApp)({
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
});
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = 'true';
// initializeAppCheck(firebase, {
//   provider: new ReCaptchaV3Provider('6LfnisYaAAAAAGruEJpAsGlTLVkguzkx5WOOb0h1'),
//   isTokenAutoRefreshEnabled: true,
// });
exports.auth = (0, auth_1.getAuth)(firebase);
exports.functions = (0, functions_1.getFunctions)(firebase);
exports.firestore = (0, firestore_1.getFirestore)(firebase);
exports.storage = (0, storage_1.getStorage)(firebase);
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    (0, functions_1.connectFunctionsEmulator)(exports.functions, "localhost", 5001);
    (0, auth_1.connectAuthEmulator)(exports.auth, "http://localhost:9099");
    (0, firestore_1.connectFirestoreEmulator)(exports.firestore, "localhost", 8080);
    (0, storage_1.connectStorageEmulator)(exports.storage, "localhost", 9199);
}
//# sourceMappingURL=firebase.js.map