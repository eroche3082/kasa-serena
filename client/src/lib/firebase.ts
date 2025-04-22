import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXkCgqWWHTMRfZUYOkJaC0-olo_gdA3ug",
  authDomain: "erudite-creek-431302-q3.firebaseapp.com",
  projectId: "erudite-creek-431302-q3",
  storageBucket: "erudite-creek-431302-q3.firebasestorage.app",
  messagingSenderId: "744217150021",
  appId: "1:744217150021:web:f8e528d9e8ee1dea7c192c",
  measurementId: "G-XML0PN4STQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication helper functions
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
};

export const logoutUser = () => {
  return signOut(auth);
};

export { auth, db, storage, analytics };
export default app;
