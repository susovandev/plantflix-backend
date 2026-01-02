import { Router } from 'express';
import { registerController } from '../controllers/register.controller';
import {
	loginValidationSchema,
	registerValidationSchema,
	resendOTPValidationSchema,
	verifyOTPValidationSchema,
} from '../validations/auth.validation';
import { validateRequest } from 'middlewares/validation.middleware';
import { validateEmptyBody } from 'middlewares/validateBody.middleware';
import { verifyOTPController } from '../controllers/verifyOtp.controller';
import { resendOTPController } from '../controllers/resendOtp.controller';
import { loginController } from '../controllers/login.controller';
import { refreshTokenController } from '../controllers/refreshToken.controller';
import { logoutController } from '../controllers/logout.controller';
import { AuthCheck } from 'middlewares/auth.middleware';

const authRouter = Router();

authRouter.post(
	'/register',
	validateEmptyBody,
	validateRequest(registerValidationSchema),
	registerController,
);

authRouter.post(
	'/verify-otp',
	validateEmptyBody,
	validateRequest(verifyOTPValidationSchema),
	verifyOTPController,
);

authRouter.post(
	'/resend-otp',
	validateEmptyBody,
	validateRequest(resendOTPValidationSchema),
	resendOTPController,
);

authRouter.post(
	'/login',
	validateEmptyBody,
	validateRequest(loginValidationSchema),
	loginController,
);

authRouter.get('/logout', AuthCheck, logoutController);

authRouter.get('/refresh', refreshTokenController);

export default authRouter;
