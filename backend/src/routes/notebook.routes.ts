import { Router } from 'express';
import {
  getNotebookItems,
  addNotebookItem,
  updateNotebookItem,
  deleteNotebookItem,
} from '../controllers/notebook.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getNotebookItems);
router.post('/', authenticate, addNotebookItem);
router.patch('/:id', authenticate, updateNotebookItem);
router.delete('/:id', authenticate, deleteNotebookItem);

export default router;
