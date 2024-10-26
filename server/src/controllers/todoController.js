import { Todo } from '../models/todoModel.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  const todo = await Todo.create({
    title,
    description,
    userId: req.user._id,
  });

  res.status(201).json({
    status: 'success',
    data: { todo },
  });
});

export const getUserTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ userId: req.user._id }).sort('-createdAt');

  res.json({
    status: 'success',
    data: { todos },
  });
});

export const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!todo) {
    throw new AppError('Tarea no encontrada', 404);
  }

  Object.assign(todo, req.body);
  await todo.save();

  res.json({
    status: 'success',
    data: { todo },
  });
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!todo) {
    throw new AppError('Tarea no encontrada', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});