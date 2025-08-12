import React, { useState, useEffect } from 'react'
import { Button, Input } from '../components/index.js'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Loader2,
  UserPlus,
  Shield,
  CheckCircle,
  Clock,
  RotateCcw
} from 'lucide-react'
import axios from 'axios'

const Signup = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1) // 1: Registration form, 2: OTP verification
  const [otpData, setOtpData] = useState({ email: '', maskedEmail: '' })
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpLoading, setOtpLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()

  const apiUrl = import.meta.env.VITE_API_URL

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Step 1: Send registration data and get OTP
  const sendRegistrationOTP = async (data) => {
    setError("")
    setLoading(true)
    
    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/send-registration-otp`, data)
      
      if (response.status === 200) {
        setOtpData({
          email: data.email,
          maskedEmail: response.data.email
        })
        setStep(2)
        setCountdown(60) // 60 seconds before allowing resend
      }
      
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only take the last digit
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`)
      nextInput?.focus()
    }
  }

  // Handle backspace in OTP input
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`)
      prevInput?.focus()
    }
  }

  // Step 2: Verify OTP and complete registration
  const verifyOTPAndRegister = async () => {
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }
    
    setError("")
    setOtpLoading(true)
    
    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/verify-otp-register`, {
        email: otpData.email,
        otp: otpString
      })
      
      if (response.status === 201) {
        // Show success message and redirect to login
        setStep(3) // Success step
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
      
    } catch (error) {
      setError(error.response?.data?.message || "OTP verification failed")
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
    } finally {
      setOtpLoading(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    if (countdown > 0) return
    
    setResendLoading(true)
    setError("")
    
    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/resend-otp`, {
        email: otpData.email
      })
      
      if (response.status === 200) {
        setCountdown(60)
        setOtp(['', '', '', '', '', ''])
        // Show success message briefly
        setError("")
      }
      
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP")
    } finally {
      setResendLoading(false)
    }
  }

  // Go back to step 1
  const goBack = () => {
    setStep(1)
    setOtp(['', '', '', '', '', ''])
    setError("")
    setCountdown(0)
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/40 backdrop-blur-xl border border-green-400/30 rounded-3xl p-8 text-center max-w-md mx-auto"
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Account Created!</h2>
          <p className="text-gray-300 mb-6">
            Your account has been successfully created. You'll be redirected to the login page shortly.
          </p>
          
          <motion.div
            className="inline-flex items-center gap-2 text-green-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting...</span>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
            
            {/* Logo */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  SentiScope
                </h1>
              </motion.div>
            </div>

            {/* Step 1: Registration Form */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <UserPlus className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join SentiScope for powerful AI insights</p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit(sendRegistrationOTP)} className="space-y-6">
                    
                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserPlus className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Choose a username"
                          className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          {...register('username', { 
                            required: "Username is required",
                            minLength: {
                              value: 3,
                              message: "Username must be at least 3 characters"
                            }
                          })}
                        />
                      </div>
                      {errors.username && (
                        <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          {...register('email', { 
                            required: "Email is required",
                            validate: {
                              matchPattern: (value) =>
                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Enter valid email address",
                            },
                          })}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          {...register('password', { 
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters"
                            }
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          Send Verification Code
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    {/* Login Link */}
                    <div className="text-center pt-4 border-t border-purple-400/20">
                      <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link 
                          to="/login" 
                          className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Mail className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                    <p className="text-gray-400 mb-2">
                      We've sent a verification code to
                    </p>
                    <p className="text-purple-400 font-medium">{otpData.maskedEmail}</p>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* OTP Input */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                      Enter 6-digit verification code
                    </label>
                    <div className="flex justify-center gap-3 mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          name={`otp-${index}`}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          onKeyDown={(e) => handleOtpKeyDown(e, index)}
                          className="w-12 h-12 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white text-center text-xl font-bold focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timer and Resend */}
                  <div className="text-center mb-6">
                    {countdown > 0 ? (
                      <div className="flex items-center justify-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Resend available in {countdown}s</span>
                      </div>
                    ) : (
                      <button
                        onClick={resendOTP}
                        disabled={resendLoading}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 flex items-center gap-2 mx-auto disabled:opacity-50"
                      >
                        {resendLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                        Resend Code
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <motion.button
                      onClick={verifyOTPAndRegister}
                      disabled={otpLoading || otp.join('').length !== 6}
                      className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
                      whileHover={{ scale: otpLoading ? 1 : 1.02 }}
                      whileTap={{ scale: otpLoading ? 1 : 0.98 }}
                    >
                      {otpLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify & Create Account
                          <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    <button
                      onClick={goBack}
                      className="w-full py-2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      ← Back to registration
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-full text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secured with email verification</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Signup