import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Firebase web apiKey is a publishable identifier (safe in client code).
// See: https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: "xcey-version-2.firebaseapp.com",
  projectId: "xcey-version-2",
  storageBucket: "xcey-version-2.firebasestorage.app",
  messagingSenderId: "211566012076",
  appId: "1:211566012076:web:aec0f080adf30bc93ca109",
  measurementId: "G-DNLCT7014L",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = initializeFirestore(firebaseApp, {
  experimentalAutoDetectLongPolling: true,
});
