// ==================== FIREBASE ADMIN INITIALIZATION ====================
// This file now gracefully handles a missing serviceAccountKey.json.
// If the key is absent, Firestore (db) will be null and API routes can
// respond with a clear error instead of crashing the server.

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Resolve the key file relative to the project root (same folder as package.json)
const keyPath = path.resolve(__dirname, 'serviceAccountKey.json');
let db = null;

if (fs.existsSync(keyPath)) {
  try {
    const serviceAccount = require(keyPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('⚠️ Failed to initialize Firebase Admin:', error);
  }
} else {
  console.warn(
    "⚠️ serviceAccountKey.json not found. Firestore functionality will be disabled.\n" +
    "Place the generated key file in the project root and restart the server to enable."
  );
}

module.exports = { admin, db };
