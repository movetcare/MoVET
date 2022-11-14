import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import environment from 'utils/environment';

const isProduction = environment === 'production';

const firebase = initializeApp({
  projectId: isProduction ? 'movet-care' : 'movet-care-staging',
  appId: isProduction
    ? '1:516680717319:web:f6ce71c55c87f7d82006a2'
    : '1:411678558724:web:5a66f09432ca910d9fc351',
  apiKey: isProduction
    ? 'AIzaSyAiepyL3_lhpvoTDywIXYXVJFpm2bLvSHg'
    : 'AIzaSyCRJEv6XXchM9e2Ibq4C-yoR346vmsBMFk',
  authDomain: isProduction
    ? 'movet-care.firebaseapp.com'
    : 'movet-care-staging.firebaseapp.com',
  storageBucket: isProduction
    ? 'movet-care.appspot.com'
    : 'staging-movet-care.appspot.com',
} as object);

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
