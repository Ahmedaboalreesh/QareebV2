// Firebase Client Configuration
// This file contains the correct Firebase configuration for client-side usage

const firebaseConfig = {
    apiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
    authDomain: "qareeb-aba0c.firebaseapp.com",
    databaseURL: "https://qareeb-aba0c-default-rtdb.firebaseio.com",
    projectId: "qareeb-aba0c",
    storageBucket: "qareeb-aba0c.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase for client-side
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
}
