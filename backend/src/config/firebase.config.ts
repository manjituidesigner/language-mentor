import * as admin from 'firebase-admin';
import { envConfig } from './env.config';
import logger from '../utils/logger';

export const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: envConfig.firebase.projectId,
          clientEmail: envConfig.firebase.clientEmail,
          privateKey: envConfig.firebase.privateKey,
        }),
        storageBucket: envConfig.firebase.storageBucket,
      });
      logger.info('Firebase Admin SDK initialized successfully.');
    }
  } catch (error) {
    logger.error(Failed to initialize Firebase Admin SDK: );
  }
};

export const getFirestore = () => admin.firestore();
export const getAuth = () => admin.auth();
export const getStorage = () => admin.storage();
export const getMessaging = () => admin.messaging();
