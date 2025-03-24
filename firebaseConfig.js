const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxSwgjU00C_R0WR_h32P1DxrlC4zCwLlo",
  authDomain: "bangleseller.firebaseapp.com",
  projectId: "bangleseller",
  storageBucket: "bangleseller.firebasestorage.app",
  messagingSenderId: "340563599767",
  appId: "1:340563599767:web:5a28457f6f7c808b7864d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
