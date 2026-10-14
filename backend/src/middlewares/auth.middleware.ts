import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { ApiError } from '../utils/apiError';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, envConfig.jwtSecret) as { id: string; email: string; name?: string };
      req.user = decoded;
      return next();
    } catch {
      // In development mode, if token is invalid or expired, allow demo fallback user
      if (envConfig.nodeEnv === 'development') {
        req.user = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'demo@lumina.mentor',
          name: 'Demo Student',
        };
        return next();
      }
      return next(new ApiError(401, 'Unauthorized: Invalid or expired token'));
    }
  }

  // Development convenience: auto-assign default demo user if header missing
  if (envConfig.nodeEnv === 'development') {
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'demo@lumina.mentor',
      name: 'Demo Student',
    };
    return next();
  }

  return next(new ApiError(401, 'Unauthorized: Authorization token required'));
};
