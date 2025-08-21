import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyCB2Kkl0kfqwYIbO3AP5FiRwdR5lnQPwKk",
    authDomain: "hotel-happiness-hill.firebaseapp.com",
    projectId: "hotel-happiness-hill",
    storageBucket: "hotel-happiness-hill.firebasestorage.app",
    messagingSenderId: "467644059610",
    appId: "1:467644059610:web:5dc7993380578dd14a3ae3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;