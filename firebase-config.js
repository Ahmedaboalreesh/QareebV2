const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, push, update, remove, query, orderByChild, equalTo } = require('firebase/database');
const { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const admin = require('firebase-admin');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Initialize Firebase Admin for server-side operations
const serviceAccount = {
  "type": "service_account",
  "project_id": "qareeb-aba0c",
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
};

let adminApp;
try {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com/"
  });
} catch (error) {
  console.log('Firebase Admin already initialized or missing credentials');
}

module.exports = {
  database,
  storage,
  admin,
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
