import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { updateUserSchema } from '../schemas/userSchema.js';

const router = Router();

// All routes below require valid JWT token in Authorization: Bearer <token>
router.use(authenticate);

// Important: Define /me BEFORE /:id to prevent route collision
router.get('/me', userController.getProfile);
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.remove);

export default router;
