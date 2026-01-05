// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrOcLHtoTnMJzTF23VXy35XFkWrtEQi2Q",
  authDomain: "maguinhatuquinho.firebaseapp.com",
  projectId: "maguinhatuquinho",
  storageBucket: "maguinhatuquinho.appspot.com",
  messagingSenderId: "909870967450",
  appId: "1:909870967450:web:39904313e4e60ee9bd4d23",
  measurementId: "G-EV60EEQSK6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
