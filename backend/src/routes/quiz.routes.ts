import { Router } from 'express';
import { generateQuiz, submitQuiz } from '../controllers/quiz.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/generate', authenticate, generateQuiz);
router.post('/submit', authenticate, submitQuiz);

export default router;
