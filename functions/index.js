/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require('firebase-admin');
admin.initializeApp();

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const email = user.email; // 新しく登録されたユーザーのメールアドレス

    // nodemailerを使用してメールを送信するロジック
    // ...
});



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
