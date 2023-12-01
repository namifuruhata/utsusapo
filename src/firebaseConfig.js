// ./firebaseConfig.js
// import firebase from 'firebase/app'; // Firebaseのコアモジュールをインポート
// import 'firebase/auth'; // 認証関連のモジュールをインポート
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


// Firebaseの設定
    const firebaseConfig = {
      
      authDomain: "chat-20231125-d8d1f.firebaseapp.com",
      projectId: "chat-20231125-d8d1f",
      storageBucket: "chat-20231125-d8d1f.appspot.com",
      messagingSenderId: "174715849662",
      appId: "1:174715849662:web:96f589639c5ca2547c47ef"
    };

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth ,storage}; // auth をエクスポートする





