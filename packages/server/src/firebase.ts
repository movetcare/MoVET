import admin from "firebase-admin";
const environment =
  typeof window !== "undefined" && window.location.hostname === "movetcare.com"
    ? "production"
    : typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "development"
    : process.env.NODE_ENV === "development"
    ? "development"
    : "production";

if (environment === "development")
  process.env.FIRESTORE_EMULATOR_HOST = `localhost:8080`;

if (environment === "production") {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: "movet-care",
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      } as any),
      databaseURL: "https://movet-care.firebaseio.com",
    });
    admin.firestore().settings({
      ignoreUndefinedProperties: true,
    });
  }
} else {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: "movet-care-staging",
        private_key: process.env.STAGING_FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        client_email: process.env.STAGING_FIREBASE_CLIENT_EMAIL,
      } as any),
      databaseURL: "https://movet-care-staging.firebaseio.com",
    });
    admin.firestore().settings({
      host: `localhost:8080`,
      ssl: false,
      ignoreUndefinedProperties: true,
      experimentalForceLongPolling: true,
    });
  }
}
export const firestore = admin.firestore();
