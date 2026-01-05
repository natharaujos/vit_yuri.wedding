// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrzd6Llc21YyNwvmYYLweW5A5C_YlhH-Q",
  authDomain: "vitoriayuricasamento.firebaseapp.com",
  projectId: "vitoriayuricasamento",
  storageBucket: "vitoriayuricasamento.firebasestorage.app",
  messagingSenderId: "969563058642",
  appId: "1:969563058642:web:47a1dbf71c87bab912980b",
  measurementId: "G-SDCWJXJ824"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };