import { Router } from 'express';
import { getProgressStats, useStreakFreeze } from '../controllers/progress.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authenticate, getProgressStats);
router.post('/streak-freeze', authenticate, useStreakFreeze);

export default router;
