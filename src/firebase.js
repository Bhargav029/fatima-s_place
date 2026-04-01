// 1. All Imports at the top
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// 2. Your Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpPZgj_6ygc95CJ93uBoUQBKjhLRTnrlU",
  authDomain: "fatimas-place-7e73b.firebaseapp.com",
  projectId: "fatimas-place-7e73b",
  storageBucket: "fatimas-place-7e73b.firebasestorage.app",
  messagingSenderId: "454413753774",
  appId: "1:454413753774:web:18959275aa04d612a17c3f",
  measurementId: "G-1MMWYPXKP2"
};

// 3. Initialize the App FIRST
const app = initializeApp(firebaseConfig);

// 4. Initialize and Export all your services SECOND
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


