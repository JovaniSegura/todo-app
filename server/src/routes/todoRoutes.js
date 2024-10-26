import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTodo,
  getUserTodos,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTodo)
  .get(getUserTodos);

router.route('/:id')
  .patch(updateTodo)
  .delete(deleteTodo);

export default router;