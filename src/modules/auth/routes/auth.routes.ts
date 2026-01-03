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

// BASE_URL = http://localhost:5555/api/v1

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post(
	'/register',
	validateEmptyBody,
	validateRequest(registerValidationSchema),
	registerController,
);

/**
 * @route   POST /auth/verify-otp
 * @desc    Verify OTP for user registration
 * @access  Public
 */
authRouter.post(
	'/verify-otp',
	validateEmptyBody,
	validateRequest(verifyOTPValidationSchema),
	verifyOTPController,
);

/**
 * @route   POST /auth/resend-otp
 * @desc    Resend OTP for user registration
 * @access  Public
 */
authRouter.post(
	'/resend-otp',
	validateEmptyBody,
	validateRequest(resendOTPValidationSchema),
	resendOTPController,
);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
authRouter.post(
	'/login',
	validateEmptyBody,
	validateRequest(loginValidationSchema),
	loginController,
);

/**
 * @route   GET /auth/logout
 * @desc    Logout user
 * @access  Private (requires authentication)
 */
authRouter.get('/logout', AuthCheck, logoutController);

/**
 * @route   GET /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
authRouter.get('/refresh', refreshTokenController);

export default authRouter;
