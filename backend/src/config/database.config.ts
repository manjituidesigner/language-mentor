import mongoose from 'mongoose';
import { envConfig } from './env.config';
import logger from '../utils/logger';

export const connectDatabase = async () => {
  try {
    mongoose.connection.on('connected', () => logger.info('MongoDB connected successfully.'));
    mongoose.connection.on('error', (err) => logger.error(MongoDB connection error: ));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected.'));

    await mongoose.connect(envConfig.mongodbUri);
  } catch (error) {
    logger.error(Failed to connect to MongoDB: );
    process.exit(1);
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed.');
};
