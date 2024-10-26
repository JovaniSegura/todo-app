import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';

export const protect = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No autorizado', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Obtener usuario del token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('No autorizado', 401));
  }
};