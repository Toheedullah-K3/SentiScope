import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Mail, 
  ArrowLeft,
  AlertCircle, 
  CheckCircle,
  Loader2,
  Shield,
  Clock
} from 'lucide-react'
import axios from 'axios'

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [maskedEmail, setMaskedEmail] = useState("")

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const apiUrl = import.meta.env.VITE_API_URL

  const sendResetEmail = async (data) => {
    setError("")
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${apiUrl}/api/v1/users/forgot-password`, data)
      
      if (response.status === 200) {
        setIsSuccess(true)
        setMaskedEmail(response.data.email || data.email)
      }
      
    } catch (error) {
      setError(error.response?.data?.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-3000" />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
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
        <div className="w-full max-w-md mx-auto">
          
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToLogin}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl"
          >
            
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                  <p className="text-gray-400">No worries! Enter your email address and we'll send you a reset link.</p>
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

                {/* Reset Form */}
                <form onSubmit={handleSubmit(sendResetEmail)} className="space-y-6">
                  
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
                        placeholder="Enter your email address"
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

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:cursor-not-allowed"
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  {/* Back to Login Link */}
                  <div className="text-center pt-4 border-t border-purple-400/20">
                    <p className="text-gray-400">
                      Remember your password?{' '}
                      <Link 
                        to="/login" 
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                      >
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">Check Your Email!</h2>
                
                <div className="bg-slate-700/30 border border-purple-400/20 rounded-xl p-6 mb-6">
                  <p className="text-gray-300 mb-3">
                    We've sent a password reset link to:
                  </p>
                  <p className="text-purple-400 font-medium text-lg mb-4">{maskedEmail}</p>
                  
                  <div className="flex items-center justify-center gap-2 text-amber-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Link expires in 15 minutes</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-gray-400">
                  <p>
                    Click the link in your email to reset your password. 
                    If you don't see it, check your spam folder.
                  </p>
                  
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <p className="text-blue-300">
                      <strong>Didn't receive the email?</strong> Wait a few minutes and check your spam folder, 
                      or try requesting a new reset link.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <motion.button
                    onClick={() => {
                      setIsSuccess(false)
                      setError("")
                    }}
                    className="w-full py-3 px-6 bg-slate-700/50 hover:bg-slate-700/70 border border-purple-400/30 text-white font-medium rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try Different Email
                  </motion.button>
                  
                  <button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-6 text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-full text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword