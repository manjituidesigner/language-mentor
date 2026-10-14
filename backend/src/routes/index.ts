import { Router } from 'express';
import authRoutes from './auth.routes';
import mentorRoutes from './mentor.routes';
import groupRoutes from './group.routes';
import assessmentRoutes from './assessment.routes';
import sessionRoutes from './session.routes';
import notebookRoutes from './notebook.routes';
import quizRoutes from './quiz.routes';
import progressRoutes from './progress.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/mentors', mentorRoutes);
router.use('/groups', groupRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/sessions', sessionRoutes);
router.use('/notebook', notebookRoutes);
router.use('/quiz', quizRoutes);
router.use('/progress', progressRoutes);

export default router;
