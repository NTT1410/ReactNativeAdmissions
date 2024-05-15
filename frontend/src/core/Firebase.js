import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import {} from "firebase/auth";
import { getDatabase, get, ref, onValue, child } from "firebase/database";
import {} from "firebase/firestore";
import {} from "firebase/functions";
import {} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5dM-iOCY2NXVOjKmSJxI16Ldrgy5_GHU",
  authDomain: "admission-663b7.firebaseapp.com",
  databaseURL: "https://admission-663b7-default-rtdb.firebaseio.com",
  projectId: "admission-663b7",
  storageBucket: "admission-663b7.appspot.com",
  messagingSenderId: "257069571322",
  appId: "1:257069571322:web:4e75ef8ba07fecaa3a3d43",
  measurementId: "G-1EXKW1CDH1",
};

const ConnFirebase = () => {
  initializeApp(firebaseConfig);
  const db = getDatabase();
  return db;
};

export default ConnFirebase;
