import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
});

console.log(process.env.REACT_APP_FIREBASE_KEY);

export default app;

// REACT_APP_FIREBASE_KEY="AIzaSyC2NVJ7xib_yx4QQE5Kl3Weqb0GFf1e5MI"
// REACT_APP_FIREBASE_DOMAIN="vbucks-capstone.firebaseapp.com"
// REACT_APP_FIREBASE_DATABASE="https://vbucks-capstone.firebaseio.com"
// REACT_APP_FIREBASE_PROJECT_ID="vbucks-capstone"
// REACT_APP_FIREBASE_STORAGE_BUCKET="vbucks-capstone.appspot.com"
// REACT_APP_FIREBASE_SENDER_ID="709180316100"
// REACT_APP_FIREBASE_APPID="1:709180316100:web:3b80559d65527d7f092c91"
