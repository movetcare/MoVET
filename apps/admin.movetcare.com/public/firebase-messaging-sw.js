/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging.js",
);

const firebase = initializeApp({
  projectId: "movet-care",
  appId: "1:516680717319:web:f6ce71c55c87f7d82006a2",
  apiKey: "AIzaSyAiepyL3_lhpvoTDywIXYXVJFpm2bLvSHg",
  authDomain: "movet-care.firebaseapp.com",
  storageBucket: "movet-care.appspot.com",
  messagingSenderId: "516680717319",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
