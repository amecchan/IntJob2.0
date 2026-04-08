// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQHOc0NQn8LXAiUUj-huXuUuwqvO2fGWY",
  authDomain: "intjob-7db48.firebaseapp.com",
  projectId: "intjob-7db48",
  storageBucket: "intjob-7db48.firebasestorage.app",
  messagingSenderId: "485935079398",
  appId: "1:485935079398:web:00b031f3098e351c860027",
  measurementId: "G-CTS5E05QX8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// This ensures the lookup doesn't fail due to session configuration
setPersistence(auth, browserLocalPersistence);

export { auth, db };