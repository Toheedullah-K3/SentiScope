import React, { useState } from 'react'
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
  User,
  Shield,
  CheckCircle,
  Globe,
  BarChart3,
  UserPlus
} from 'lucide-react'
import axios from 'axios'

const Signup = () => {
  const [user, setUser] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_URL

  // Watch password for strength indicator
  const watchPassword = watch("password", "")

  // Password strength checker
  React.useEffect(() => {
    const calculateStrength = (password) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (/[a-z]/.test(password)) strength += 25
      if (/[A-Z]/.test(password)) strength += 25
      if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25
      return strength
    }
    setPasswordStrength(calculateStrength(watchPassword))
  }, [watchPassword])

  const createUser = async (data) => {
    setError("")
    try {
      setLoading(true)
      const response = await axios.post(`${apiUrl}/api/v1/users/register`, data)
      setUser(response.data)
      navigate('/login')
    } catch (error) {
      setError(error.response.data.message || "An unexpected error occurred.");
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500'
    if (passwordStrength <= 50) return 'bg-yellow-500'
    if (passwordStrength <= 75) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak'
    if (passwordStrength <= 50) return 'Fair'
    if (passwordStrength <= 75) return 'Good'
    return 'Strong'
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
        {[...Array(30)].map((_, i) => (
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
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="text-center lg:text-left">
              {/* Logo/Brand */}
              <motion.div
                className="inline-flex items-center gap-3 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    SentiScope
                  </h1>
                  <p className="text-gray-400 text-sm">AI-Powered Insights</p>
                </div>
              </motion.div>

              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Join the Future of 
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent block">
                  Sentiment Analysis
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Create your account and start transforming social media data into actionable insights 
                with our cutting-edge AI platform.
              </p>

              {/* Feature highlights */}
              <div className="space-y-4">
                {[
                  { icon: Brain, text: "Advanced AI Models", desc: "TextBlob, VADER & GenAI" },
                  { icon: Globe, text: "Multi-Platform Analysis", desc: "Reddit, Twitter & News" },
                  { icon: BarChart3, text: "Rich Visualizations", desc: "Charts, graphs & insights" },
                  { icon: Shield, text: "Secure & Private", desc: "Enterprise-grade security" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.15 }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">{feature.text}</div>
                      <div className="text-sm text-gray-400">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Call to action for existing users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="mt-8 p-4 bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl"
              >
                <p className="text-gray-300 text-sm">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300"
                  >
                    Sign in here →
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8 shadow-2xl">
              
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
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

              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <UserPlus className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Join Us!</h2>
                <p className="text-gray-400">Create your account to get started</p>
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

              {/* Signup Form */}
              <form onSubmit={handleSubmit(createUser)} className="space-y-6">
                
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
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
                      placeholder="Create a strong password"
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
                  
                  {/* Password Strength Indicator */}
                  {watchPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getStrengthColor()} transition-all duration-300`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{getStrengthText()}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Use 8+ characters with letters, numbers & symbols
                      </p>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="text-sm text-gray-400">
                  By creating an account, you agree to our{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </Link>
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Sign In Link */}
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
            </div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-full text-sm text-gray-400">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Secured with 256-bit SSL encryption</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Signup