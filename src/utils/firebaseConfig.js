// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const apiKeyFb = process.env.API_KEY_FB;
const firebaseConfig = {
  apiKey: apiKeyFb,
  authDomain: "supremium-acai.firebaseapp.com",
  projectId: "supremium-acai",
  storageBucket: "supremium-acai.firebasestorage.app",
  messagingSenderId: "237849422774",
  appId: "1:237849422774:web:2708dd9c62d3146e2daf17",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
