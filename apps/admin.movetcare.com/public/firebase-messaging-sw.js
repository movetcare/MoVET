/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js",
);

const isProduction = location.hostname === "admin.movetcare.com";

firebase.initializeApp({
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
});

const messaging = firebase.messaging();

console.log("[firebase-messaging-sw.js] RUNNING", messaging);

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload,
//   );
//   self.registration.showNotification(payload?.notification?.title, {
//     body: payload?.notification?.body,
//     icon: "/images/logo/logo-paw-black.png",
//   });
// });
