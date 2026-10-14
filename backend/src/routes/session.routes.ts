import { Router } from 'express';
import { startSession, sendMessage, endSession, getSessionById } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/start', authenticate, startSession);
router.post('/:sessionId/message', authenticate, sendMessage);
router.post('/:sessionId/end', authenticate, endSession);
router.get('/:sessionId', authenticate, getSessionById);

export default router;
