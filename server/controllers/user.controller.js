import User from '../models/user.model.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "toheedullah002@gmail.com",
        pass: "qgcp fpda cozu mezp"
    }
})

// Store OTP temporarily (in production, use Redis or database)
const otpStore = new Map()
// Store password reset tokens temporarily
const resetTokenStore = new Map()

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.updateOne({ refreshToken });

    return { accessToken, refreshToken }
}

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString()
}

// Generate secure reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex')
}

// Send OTP email
const sendOTPEmail = async (email, otp, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SentiScope - Email Verification',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
                <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">🧠</span>
                    </div>
                    <h1 style="color: #333; margin-bottom: 20px;">Welcome to SentiScope!</h1>
                    <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Hi ${username}, please verify your email address to complete your registration.</p>
                    
                    <div style="background: #f8f9ff; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; margin: 30px 0;">
                        <h2 style="color: #333; margin-bottom: 10px;">Your Verification Code</h2>
                        <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: monospace;">${otp}</div>
                        <p style="color: #666; font-size: 14px; margin-top: 10px;">This code expires in 10 minutes</p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">If you didn't create an account with SentiScope, please ignore this email.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">© 2025 SentiScope - AI-Powered Sentiment Analysis</p>
                    </div>
                </div>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, username) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'SentiScope - Password Reset Request',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
                <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">🔐</span>
                    </div>
                    <h1 style="color: #333; margin-bottom: 20px;">Password Reset Request</h1>
                    <p style="color: #666; font-size: 16px; margin-bottom: 30px;">Hi ${username}, we received a request to reset your password for your SentiScope account.</p>
                    
                    <div style="background: #f8f9ff; border: 2px solid #667eea; border-radius: 10px; padding: 30px; margin: 30px 0;">
                        <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
                        <p style="color: #666; margin-bottom: 25px;">Click the button below to create a new password. This link will expire in 15 minutes for security.</p>
                        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; margin: 10px 0;">Reset Password</a>
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:<br>
                        <span style="word-break: break-all;">${resetUrl}</span></p>
                    </div>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <p style="color: #856404; font-size: 14px; margin: 0;"><strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">© 2025 SentiScope - AI-Powered Sentiment Analysis</p>
                    </div>
                </div>
            </div>
        `
    }

    await transporter.sendMail(mailOptions)
}

// Step 1: Send password reset email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).json({ 
                message: 'If an account with this email exists, you will receive a password reset link shortly.',
                email: email.replace(/(.{2}).*(@.*)/, '$1***$2')
            });
        }

        // Generate reset token
        const resetToken = generateResetToken();
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Store reset token data
        const resetData = {
            email,
            resetToken,
            resetTokenExpiry,
            userId: user._id,
            attempts: 0
        };

        resetTokenStore.set(email, resetData);

        // Send reset email
        await sendPasswordResetEmail(email, resetToken, user.username);

        res.status(200).json({ 
            message: 'If an account with this email exists, you will receive a password reset link shortly.',
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2')
        });

    } catch (error) {
        console.error("Error in forgot password: ", error);
        res.status(500).json({ message: 'Failed to process password reset request. Please try again.' });
    }
};

// Step 2: Verify reset token and update password
const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ message: 'Email, token, and new password are required' });
        }

        // Password validation
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Get stored reset data
        const resetData = resetTokenStore.get(email);

        if (!resetData) {
            return res.status(400).json({ message: 'Invalid or expired reset token. Please request a new password reset.' });
        }

        // Check if token expired
        if (Date.now() > resetData.resetTokenExpiry) {
            resetTokenStore.delete(email);
            return res.status(400).json({ message: 'Reset token has expired. Please request a new password reset.' });
        }

        // Check attempt limit
        if (resetData.attempts >= 3) {
            resetTokenStore.delete(email);
            return res.status(400).json({ message: 'Too many failed attempts. Please request a new password reset.' });
        }

        // Verify token
        if (resetData.resetToken !== token) {
            resetData.attempts++;
            resetTokenStore.set(email, resetData);
            return res.status(400).json({ 
                message: `Invalid reset token. ${3 - resetData.attempts} attempts remaining.` 
            });
        }

        // Update user password
        const user = await User.findById(resetData.userId);
        
        if (!user) {
            resetTokenStore.delete(email);
            return res.status(400).json({ message: 'User account not found.' });
        }

        // Update password (assuming your User model has password hashing middleware)
        user.password = newPassword;
        await user.save();

        // Clear the refresh token to force re-login
        user.refreshToken = undefined;
        await user.updateOne({ $unset: { refreshToken: 1 } });

        // Clean up reset token
        resetTokenStore.delete(email);

        res.status(200).json({ 
            message: 'Password reset successful! Please login with your new password.' 
        });

    } catch (error) {
        console.error("Error in reset password: ", error);
        res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};

// Verify reset token (for frontend validation)
const verifyResetToken = async (req, res) => {
    try {
        const { email, token } = req.query;

        if (!email || !token) {
            return res.status(400).json({ message: 'Email and token are required' });
        }

        const resetData = resetTokenStore.get(email);

        if (!resetData) {
            return res.status(400).json({ 
                valid: false, 
                message: 'Invalid or expired reset token' 
            });
        }

        if (Date.now() > resetData.resetTokenExpiry) {
            resetTokenStore.delete(email);
            return res.status(400).json({ 
                valid: false, 
                message: 'Reset token has expired' 
            });
        }

        if (resetData.resetToken !== token) {
            return res.status(400).json({ 
                valid: false, 
                message: 'Invalid reset token' 
            });
        }

        const user = await User.findById(resetData.userId).select('username email');
        
        res.status(200).json({ 
            valid: true, 
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error in verify reset token: ", error);
        res.status(500).json({ 
            valid: false, 
            message: 'Failed to verify reset token' 
        });
    }
};

// Step 1: Send OTP for registration
const sendRegistrationOTP = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Email validation
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }

        // Password validation (min 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Store OTP and user data temporarily
        const tempData = {
            username,
            email,
            password,
            otp,
            otpExpiry,
            attempts: 0
        };

        otpStore.set(email, tempData);

        // Send OTP email
        await sendOTPEmail(email, otp, username);

        res.status(200).json({ 
            message: 'OTP sent successfully to your email address',
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for security
        });

    } catch (error) {
        console.error("Error in sending OTP: ", error);
        res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

// Step 2: Verify OTP and complete registration
const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Get stored data
        const tempData = otpStore.get(email);

        if (!tempData) {
            return res.status(400).json({ message: 'OTP expired or invalid. Please request a new one.' });
        }

        // Check if OTP expired
        if (Date.now() > tempData.otpExpiry) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Check attempt limit
        if (tempData.attempts >= 3) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'Too many failed attempts. Please request a new OTP.' });
        }

        // Verify OTP
        if (tempData.otp !== otp.toString()) {
            tempData.attempts++;
            otpStore.set(email, tempData);
            return res.status(400).json({ 
                message: `Invalid OTP. ${3 - tempData.attempts} attempts remaining.` 
            });
        }

        // Create user in database
        const user = await User.create({
            username: tempData.username,
            email: tempData.email,
            password: tempData.password
        });

        if (!user) {
            return res.status(500).json({ message: 'Failed to create user' });
        }

        // Clean up temporary data
        otpStore.delete(email);

        // Remove sensitive data from response
        user.password = undefined;
        user.refreshToken = undefined;

        res.status(201).json({ 
            message: 'Account created successfully! You can now login.',
            user 
        });

    } catch (error) {
        console.error("Error in OTP verification: ", error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
};

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const tempData = otpStore.get(email);

        if (!tempData) {
            return res.status(400).json({ message: 'No pending registration found. Please start registration again.' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update stored data
        tempData.otp = otp;
        tempData.otpExpiry = otpExpiry;
        tempData.attempts = 0;
        otpStore.set(email, tempData);

        // Send new OTP
        await sendOTPEmail(email, otp, tempData.username);

        res.status(200).json({ 
            message: 'New OTP sent successfully to your email address' 
        });

    } catch (error) {
        console.error("Error in resending OTP: ", error);
        res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
    }
};

// Keep existing functions
const registerUser = async (req, res) => {
    // This function is now replaced by the two-step process above
    // But keeping it for backward compatibility if needed
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            username,
            email,
            password
        });

        if (!user) {
            return res.status(400).json({ message: 'User not created' });
        }

        user.password = undefined;
        user.refreshToken = undefined;

        return res.status(201).json({ user })

    } catch (error) {
        console.log("Error in Creating User: ", error)
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    const user = await User.findOne({ email })

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }
    
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({ 
            user: loggedInUser, 
            accessToken, 
            refreshToken,
            message: 'Login Successful'
        });
}

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options) // Fixed typo: was "accessTOken"
    .json({ message: 'Logout Successful' });
}

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json({ user: req.user });
}

export {
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
}