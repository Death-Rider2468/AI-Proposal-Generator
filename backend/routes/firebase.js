const admin = require('firebase-admin');
const serviceAccount = require('./Firebase.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.firestore();
module.exports = { admin, db };