import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvfykwdvksAnLRcm9b2ZV4usorLVaoYik",
  authDomain: "whatsapp-clone-290a1.firebaseapp.com",
  projectId: "whatsapp-clone-290a1",
  storageBucket: "whatsapp-clone-290a1.appspot.com",
  messagingSenderId: "29964584997",
  appId: "1:29964584997:web:dae82d7169c0e3b9c417cc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
