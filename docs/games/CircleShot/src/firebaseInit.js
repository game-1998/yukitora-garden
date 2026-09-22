import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, updateDoc, getDoc, query,
  orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initUser } from "./user.js";
const firebaseConfig = {
  apiKey: "AIzaSyBc5LcbMuts6d8tpHSO28qprK2bu1LofHw",
  authDomain: "circleshot-f9503.firebaseapp.com",
  projectId: "circleshot-f9503",
  storageBucket: "circleshot-f9503.firebasestorage.app",
  messagingSenderId: "989588845728",
  appId: "1:989588845728:web:eaefa931214911b1b105c5"
};

// Firebase 初期化
window.firebaseApp = initializeApp(firebaseConfig);
window.db = getFirestore(window.firebaseApp);
window.auth = getAuth(window.firebaseApp);

// Firestore の関数をグローバルに公開
window.doc = doc;
window.getDoc = getDoc;
window.setDoc = setDoc;
window.updateDoc = updateDoc;
window.collection = collection;
window.query = query;
window.orderBy = orderBy;
window.limit = limit;
window.getDocs = getDocs;

// 匿名ログイン
signInAnonymously(window.auth)
  .then(() => {
    console.log("匿名ログイン成功");
    initUser();
  })
  .catch((error) => {
    console.error("匿名ログイン失敗:", error);
  });