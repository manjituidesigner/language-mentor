import { Router } from 'express';
import { getGroups, joinGroup } from '../controllers/group.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getGroups);
router.post('/:id/join', authenticate, joinGroup);

export default router;
