// Firebase configuration for direct frontend integration
const firebaseConfig = {
  apiKey: "AIzaSyA1V2un5t-QbnElhA76NrQWpZcBgB6gsYo",
  authDomain: "portfolio-website-32e15.firebaseapp.com",
  projectId: "portfolio-website-32e15",
  storageBucket: "portfolio-website-32e15.firebasestorage.app",
  messagingSenderId: "179802152828",
  appId: "1:179802152828:web:99ec0df94fff6ecbe98ef9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export for use in other files
window.firebaseDB = db; 