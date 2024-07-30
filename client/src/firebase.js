// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "auth-application-cf46b.firebaseapp.com",
    projectId: "auth-application-cf46b",
    storageBucket: "auth-application-cf46b.appspot.com",
    messagingSenderId: "38768400517",
    appId: "1:38768400517:web:0f4df36ab46cd78426f1ec"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);