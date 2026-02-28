import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCIOK9CxEVk9V7SLrtWQ2jznH2OiNtZfgM",
    authDomain: "wb-ai-56020.firebaseapp.com",
    projectId: "wb-ai-56020",
    storageBucket: "wb-ai-56020.firebasestorage.app",
    messagingSenderId: "1089207052546",
    appId: "1:1089207052546:web:ce44259eb5a11c62b17a1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
