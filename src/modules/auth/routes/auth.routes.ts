import { Router } from 'express';
import { registerController } from '../controllers/register.controller';
import { registerSchema } from '../validations/auth.validation';
import { validateRequest } from 'middlewares/validation.middleware';
import { validateEmptyBody } from 'middlewares/validateBody.middleware';

const authRouter = Router();

authRouter.post(
	'/register',
	validateEmptyBody,
	validateRequest(registerSchema),
	registerController,
);

export default authRouter;
