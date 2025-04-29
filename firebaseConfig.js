// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcaxppE4DXU5Bvmekp4q3i-JFoQiDK1nc",
  authDomain: "todolistapp-414bc.firebaseapp.com",
  projectId: "todolistapp-414bc",
  storageBucket: "todolistapp-414bc.firebasestorage.app",
  messagingSenderId: "1066860362435",
  appId: "1:1066860362435:web:c0b5a3b73504951309c076",
  measurementId: "G-ERJBZ0NWBW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };