import { signInUser, createUser, signOutUser, getCurrentUser, onAuthStateChanged } from './auth.js';

// Example usage of the authentication functions

// 1. Sign in with email and password
async function loginExample() {
  try {
    const user = await signInUser("user@example.com", "password123");
    console.log("Successfully logged in:", user.email);
  } catch (error) {
    console.error("Login error:", error.message);
  }
}

// 2. Create a new user account
async function registerExample() {
  try {
    const user = await createUser("newuser@example.com", "newpassword123");
    console.log("Successfully created user:", user.email);
  } catch (error) {
    console.error("Registration error:", error.message);
  }
}

// 3. Sign out
async function logoutExample() {
  try {
    await signOutUser();
    console.log("Successfully signed out");
  } catch (error) {
    console.error("Sign out error:", error.message);
  }
}

// 4. Get current user
function getCurrentUserExample() {
  const user = getCurrentUser();
  if (user) {
    console.log("Current user:", user.email);
  } else {
    console.log("No user is currently signed in");
  }
}

// 5. Listen for authentication state changes
function setupAuthListener() {
  onAuthStateChanged((user) => {
    if (user) {
      console.log("User signed in:", user.email);
    } else {
      console.log("User signed out");
    }
  });
}

// Run examples
// loginExample();
// registerExample();
// logoutExample();
// getCurrentUserExample();
// setupAuthListener();
