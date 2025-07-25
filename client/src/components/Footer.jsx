import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Building, GraduationCap, Globe, BarChart3, Users, BookOpen, Mail, Github, Linkedin, Twitter, Calendar, Heart } from 'lucide-react'


const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-purple-400/20 overflow-hidden">
  {/* Animated Background */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000" />
  </div>
  
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
    {/* Main Footer Content */}
    <div className="grid md:grid-cols-4 gap-12 mb-12">
      {/* Brand Section */}
      <div className="md:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              SentiScope
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
            A cutting-edge sentiment analysis platform developed as a Final Year Project by Computer Science students at IIUI. 
            Real-time insights powered by advanced AI models.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Building className="w-4 h-4" />
            <span>International Islamic University, Islamabad</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <GraduationCap className="w-4 h-4" />
            <span>Computer Science Final Year Project 2025</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h4 className="text-white font-semibold text-lg mb-6">Quick Links</h4>
        <ul className="space-y-3">
          {[
            { name: 'Home', icon: Globe },
            { name: 'Dashboard', icon: BarChart3 },
            { name: 'About Us', icon: Users },
            { name: 'Documentation', icon: BookOpen },
            { name: 'Contact', icon: Mail }
          ].map((link, index) => (
            <li key={link.name}>
              <motion.a
                href="#"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-300 group"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <link.icon className="w-4 h-4 group-hover:text-purple-400" />
                {link.name}
              </motion.a>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Technologies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h4 className="text-white font-semibold text-lg mb-6">Technologies</h4>
        <div className="space-y-3">
          {[
            'React.js & Framer Motion',
            'Python & NLP Libraries',
            'TextBlob & VADER',
            'GenAI Integration',
            'Real-time Data Processing'
          ].map((tech, index) => (
            <div key={tech} className="flex items-center gap-2 text-gray-400">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span className="text-sm">{tech}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Social Links & Team */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="border-t border-purple-400/20 pt-8 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Team Credits */}
        <div className="text-center md:text-left">
          <p className="text-gray-300 font-medium mb-2">Developed by IIUI Students</p>
          <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                TK
              </div>
              <span>Toheed Ullah Khan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                BA
              </div>
              <span>Bilal Asghar</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm mr-2">Connect with us:</span>
          {[
            { icon: Github, url: '#', label: 'GitHub' },
            { icon: Linkedin, url: '#', label: 'LinkedIn' },
            { icon: Mail, url: '#', label: 'Email' },
            { icon: Twitter, url: '#', label: 'Twitter' }
          ].map((social, index) => (
            <motion.a
              key={social.label}
              href={social.url}
              className="w-10 h-10 bg-slate-800/50 hover:bg-purple-600/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={social.label}
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>

    {/* Creative Hard Work Showcase */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-6 mb-8 text-center relative overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-2xl"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10">
        <motion.div
          className="text-lg md:text-xl font-medium text-gray-200 mb-2"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'linear-gradient(90deg, #a855f7, #06b6d4, #ec4899, #a855f7)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Built with 💡 passion, ☕ late nights, and 🤖 AI tools — IIUI Final Year Project
        </motion.div>
        
        {/* Animated icons that float */}
        <div className="flex justify-center items-center gap-4 mt-4">
          {[
            { emoji: '💡', delay: 0 },
            { emoji: '☕', delay: 0.5 },
            { emoji: '🤖', delay: 1 },
            { emoji: '🎓', delay: 1.5 }
          ].map((item, index) => (
            <motion.span
              key={index}
              className="text-2xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {item.emoji}
            </motion.span>
          ))}
        </div>
        
        {/* Stats about hard work */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-purple-400 font-bold text-lg">500+</div>
            <div className="text-xs text-gray-400">Hours Coded</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-cyan-400 font-bold text-lg">∞</div>
            <div className="text-xs text-gray-400">Coffee Cups</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3">
            <div className="text-pink-400 font-bold text-lg">2</div>
            <div className="text-xs text-gray-400">Dedicated Devs</div>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Bottom Bar */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="border-t border-purple-400/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
    >
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>&copy; 2025 SentiScope - Final Year Project | All rights reserved</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-400" />
          <span>Made with dedication at IIUI</span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-purple-400 transition-colors">Documentation</a>
        </div>
      </div>
    </motion.div>

    {/* Floating particles for footer */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
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
  </div>
</footer>

)
}

export default Footer