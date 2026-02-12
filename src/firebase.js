import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4bgCnwm5VXAPH9jwaC4vLQ_kHJWNh5pc",
  authDomain: "mytrip-c7a3e.firebaseapp.com",
  databaseURL: "https://mytrip-c7a3e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytrip-c7a3e",
  storageBucket: "mytrip-c7a3e.firebasestorage.app",
  messagingSenderId: "204406368125",
  appId: "1:204406368125:web:6a7e34aecc102b0dae8e14",
  measurementId: "G-FY4PNZ7PQB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();