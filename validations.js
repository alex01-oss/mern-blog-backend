import { body } from 'express-validator';

export const registerValidator = [
  body('email', 'Incorrect email format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  body('fullName', 'Enter your name').isLength({ min: 3}),
  body('avatarUrl', 'Incorrect avatar URL').optional()
];

export const loginValidator = [
  body('email', 'Incorrect email format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
];

export const postCreateValidation = [
  body('title', 'enter article title').isLength({ min: 3 }).isString(),
  body('text', 'enter article text').isLength({ min: 3 }).isString(),
  body('tags', 'incorrect tag format').optional().isArray(),
  body('imageUrl', 'invalid image link').optional().isString()
];