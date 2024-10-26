import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  });
};

export const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Comprobar si el usuario existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('El usuario ya existe', 400);
  }

  // Crear usuario
  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Correo electrónico o contraseña no válidos', 401);
  }

  // Generar token
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    },
  });
});