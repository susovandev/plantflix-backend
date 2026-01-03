import { Router } from 'express';
import { AuthCheck } from 'middlewares/auth.middleware';
import { getCurrentUserProfileController } from '../controllers/getCurrentProfile.controller';

const userRouter = Router();

// BASE_URL = http://localhost:5555/api/v1/users

/**
 * @route   POST /me
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 */
userRouter.get('/me', AuthCheck, getCurrentUserProfileController);

export default userRouter;
