// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtkrllqvGWG5aI83v3TJng-S4uTFiKpd4",
  authDomain: "simple-925d1.firebaseapp.com",
  projectId: "simple-925d1",
  storageBucket: "simple-925d1.firebasestorage.app",
  messagingSenderId: "838620502553",
  appId: "1:838620502553:web:250b3087351a11512e2888"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);