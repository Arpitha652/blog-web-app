// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import{getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTe6a_9_wftL2pr1yhVOqfEzjWn2w0gIo",
  authDomain: "signfusion-fd995.firebaseapp.com",
  
  projectId: "signfusion-fd995",
  storageBucket: "signfusion-fd995.firebasestorage.app",
  messagingSenderId: "788826633590",
  appId: "1:788826633590:web:0a3687b89666300d29f657",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);