import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAP5ql4yHUpzsPk9ba251oea1jyCHAF1hs",
    authDomain: "paseeliteshop.firebaseapp.com",
    projectId: "paseeliteshop",
    storageBucket: "paseeliteshop.firebasestorage.app",
    messagingSenderId: "614041480534",
    appId: "1:614041480534:web:b4a00db4478a965eecfaf7",
    measurementId: "G-VP573TQ5HQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
