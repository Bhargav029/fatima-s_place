// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpPZgj_6ygc95CJ93uBoUQBKjhLRTnrlU",
  authDomain: "fatimas-place-7e73b.firebaseapp.com",
  projectId: "fatimas-place-7e73b",
  storageBucket: "fatimas-place-7e73b.firebasestorage.app",
  messagingSenderId: "454413753774",
  appId: "1:454413753774:web:d31a5244bf0e8887a17c3f",
  measurementId: "G-K5VFD4RB0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);