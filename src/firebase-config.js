// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdikpbOGUq-rS5jexRLM5563XaZP3uk24",
  authDomain: "deventer-ptm.firebaseapp.com",
  projectId: "deventer-ptm",
  storageBucket: "deventer-ptm.appspot.com",
  messagingSenderId: "939734969366",
  appId: "1:939734969366:web:f0f0cbb33ca27e14aad937",
  measurementId: "G-C98PMJ2G3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);