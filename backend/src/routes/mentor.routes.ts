import { Router } from 'express';
import { getMentors, getMentorById, bookMentorSession } from '../controllers/mentor.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getMentors);
router.get('/:id', getMentorById);
router.post('/book', authenticate, bookMentorSession);

export default router;
