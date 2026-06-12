import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAq3x0lijo7UlBpl-lCYMArgkmbJ6KOy2Y",
    authDomain: "smart-queue-management-dcade.firebaseapp.com",
    projectId: "smart-queue-management-dcade",
    storageBucket: "smart-queue-management-dcade.firebasestorage.app",
    messagingSenderId: "207470580950",
    appId: "1:207470580950:web:a8c89e975386f57a106577",
    measurementId: "G-3FNPL51X9V"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;