
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7EsVuDIxS_YgyF9rNTYqMBLXdCd7f5HM",
  authDomain: "retailhive-247bd.firebaseapp.com",
  projectId: "retailhive-247bd",
  storageBucket: "retailhive-247bd.appspot.com",
  messagingSenderId: "852373536499",
  appId: "1:852373536499:web:c528e8ef9b5d69c1abc186",
  measurementId: "G-TQPY9WNEJZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);