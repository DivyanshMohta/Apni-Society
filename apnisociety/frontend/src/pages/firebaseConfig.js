
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2ZDgYC9axb27Tcy0usXoH2EiYGmlBCoc",
  authDomain: "apni-society-9956f.firebaseapp.com",
  databaseURL: "https://apni-society-9956f-default-rtdb.firebaseio.com",
  projectId: "apni-society-9956f",
  storageBucket: "apni-society-9956f.appspot.com",
  messagingSenderId: "917562826701",
  appId: "1:917562826701:web:20be69b074d16ff5b9ee84",
  measurementId: "G-X2P79G8WMR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth};
