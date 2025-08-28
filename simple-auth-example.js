// Simple Firebase Authentication Example
// This shows how to use your original authentication code

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration (using your actual project config)
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

// Your original authentication code - now properly initialized!
async function loginUser() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, "user@example.com", "password123");
    console.log("Logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

// Example usage
loginUser()
  .then((user) => {
    console.log("Successfully logged in:", user.email);
  })
  .catch((error) => {
    console.error("Login error:", error.message);
  });

// Export for use in other files
export { auth, loginUser };
