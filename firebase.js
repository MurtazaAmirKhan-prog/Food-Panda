import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, where } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD0cMfxGK40COxlXfrTURZMMLKTSUAkL-s",
    authDomain: "food-panda-d8d41.firebaseapp.com",
    projectId: "food-panda-d8d41",
    storageBucket: "food-panda-d8d41.firebasestorage.app",
    messagingSenderId: "708438776532",
    appId: "1:708438776532:web:f0d3d312ffcd484719b941",
    measurementId: "G-KF3VWWERX1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, db, doc, setDoc, getDoc, collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, where };