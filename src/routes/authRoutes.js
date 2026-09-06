import { Router } from 'express';
import authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

export default router;
