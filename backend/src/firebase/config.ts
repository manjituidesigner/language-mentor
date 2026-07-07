import * as admin from 'firebase-admin';

export const initializeFirebaseAdmin = () => {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines from env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
};
