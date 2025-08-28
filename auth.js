import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Firebase configuration - Using actual project config
const firebaseConfig = {
  apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
  authDomain: "qareeb-aba0c.firebaseapp.com",
  databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
  projectId: "qareeb-aba0c",
  storageBucket: "qareeb-aba0c.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in with email and password
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Create new user with email and password
export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("User creation failed:", error.message);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out failed:", error.message);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Listen for auth state changes
export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};

export { auth };
