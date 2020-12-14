import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyC2NVJ7xib_yx4QQE5Kl3Weqb0GFf1e5MI",
  authDomain: "vbucks-capstone.firebaseapp.com",
  databaseURL: "https://vbucks-capstone.firebaseio.com",
  projectId: "vbucks-capstone",
  storageBucket: "vbucks-capstone.appspot.com",
  messagingSenderId: "709180316100",
  appId: "1:709180316100:web:3b80559d65527d7f092c91",
});

export default app;
