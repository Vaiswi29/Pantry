// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjjTOlqzUcCQGomPR8BDu8Xc2T-IKAvWY",
  authDomain: "pantry-f4df0.firebaseapp.com",
  projectId: "pantry-f4df0",
  storageBucket: "pantry-f4df0.appspot.com",
  messagingSenderId: "68276914293",
  appId: "1:68276914293:web:028e24986c4f36e179903c",
  measurementId: "G-53QLNFBLWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {firestore, storage};