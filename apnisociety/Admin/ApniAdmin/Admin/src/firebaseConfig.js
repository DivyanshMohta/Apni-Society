// No changes needed here if you are already using the modular import as you mentioned.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "****",
  authDomain: "****",
  projectId: "****",
  storageBucket: "****",
  messagingSenderId: "****",
  appId: "****",
  measurementId: "****"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Use getFirestore
export const storage = getStorage(app);
