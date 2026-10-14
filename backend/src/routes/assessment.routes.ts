import { Router } from 'express';
import { submitAssessment, getLatestAssessment } from '../controllers/assessment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/submit', authenticate, submitAssessment);
router.get('/latest', authenticate, getLatestAssessment);

export default router;
