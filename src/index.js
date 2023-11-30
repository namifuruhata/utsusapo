
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // オプション：スタイルシート
import App from './App';// あなたのメインアプリコンポーネント
// 他の必要なインポート

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);





// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp();

// exports.deleteOldMessages = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
//   const now = admin.firestore.Timestamp.now();
//   const cutoff = now.seconds - 24 * 60 * 60; // 24時間前
//   const oldMessages = admin.firestore().collection('chat')
//                      .where('time', '<=', cutoff)
//                      .where('isFavorited', '==', false);

//   const snapshot = await oldMessages.get();
//   const batch = admin.firestore().batch();

//   snapshot.docs.forEach(doc => batch.delete(doc.ref));

//   return batch.commit();
// });
