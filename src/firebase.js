import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // ✔ Correct import

const firebaseConfig = {
  apiKey: "AIzaSyA1FsWFiDzC5xKeLik0EUKbIcKzvtP40FA",
  authDomain: "fuelbud-auth.firebaseapp.com",
  projectId: "fuelbud-auth",
  storageBucket: "fuelbud-auth.appspot.com",
  messagingSenderId: "204774806885",
  appId: "1:204774806885:web:c6b4189b4c68246030fd8c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth + Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
