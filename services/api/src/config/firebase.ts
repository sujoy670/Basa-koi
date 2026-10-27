import * as admin from 'firebase-admin';
import { env } from './env';

let firebaseApp: admin.app.App;

if (!admin.apps.length) {
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    const formattedKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
      storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    console.log('✅ Firebase Admin SDK initialized with Service Account');
  } else {
    // Development or CI mode fallback
    firebaseApp = admin.initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
    });
    console.warn('⚠️ Firebase Admin SDK initialized in default/project mode (No private key set)');
  }
} else {
  firebaseApp = admin.app();
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
export const messaging = admin.messaging();
export default firebaseApp;

