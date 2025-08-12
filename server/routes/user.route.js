import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentUser,
    sendRegistrationOTP,
    verifyOTPAndRegister,
    resendOTP,
    forgotPassword,
    resetPassword,
    verifyResetToken
} from '../controllers/user.controller.js';
import { VerifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Registration routes (OTP-based)
router.route('/send-registration-otp').post(sendRegistrationOTP);
router.route('/verify-otp-register').post(verifyOTPAndRegister);
router.route('/resend-otp').post(resendOTP);

// Authentication routes
router.route('/register').post(registerUser); // Keep for backward compatibility
router.route('/login').post(loginUser);
router.route('/logout').post(VerifyJWT, logoutUser);
router.route('/current-user').get(VerifyJWT, getCurrentUser);

// Password reset routes
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/verify-reset-token').get(verifyResetToken);

export default router;