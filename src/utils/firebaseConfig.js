// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const apiKeyFb = process.env.API_KEY_FB;
const firebaseConfig = {
  apiKey: apiKeyFb,
  authDomain: "cantinna-app.firebaseapp.com",
  projectId: "cantinna-app",
  storageBucket: "cantinna-app.firebasestorage.app",
  messagingSenderId: "328256068502",
  appId: "1:328256068502:web:364fa2ec890a5407df1bb7",
  measurementId: "G-MX44S1RPFL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
