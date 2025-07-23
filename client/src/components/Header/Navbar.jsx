import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, User, LogOut, TrendingUp, Activity, Home, Info, Sparkles } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 text-white hover:bg-slate-700/50 hover:border-purple-400/50",
    outline: "border border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400",
    ghost: "text-white hover:text-purple-300 hover:bg-white/5"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const LogoutBtn = () => (
  <Button variant="ghost" className="text-red-300 hover:text-red-200 hover:bg-red-500/10">
    <LogOut className="w-4 h-4" />
    <span className="hidden md:inline">Logout</span>
  </Button>
);

const NavLink = ({ to, children, className, isActive, onClick }) => (
  <a 
    href={to} 
    className={className}
    onClick={(e) => {
      e.preventDefault();
      onClick && onClick();
    }}
  >
    {children}
  </a>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  
  // Mock auth status - replace with your actual auth state
  const authStatus = true;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: Home },
    { name: 'About', slug: '/about-us', active: true, icon: Info },
    { name: 'Trending', slug: '/trending', active: true, icon: TrendingUp },
    { name: 'Highlights', slug: '/highlights', active: true, icon: Activity }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-2 bg-slate-900/80 backdrop-blur-xl border-b border-purple-400/20' 
            : 'py-4 lg:py-6'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled 
                ? 'bg-slate-800/40 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-3' 
                : 'bg-slate-800/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-4'
            }`}
            whileHover={{ 
              borderColor: 'rgba(168, 85, 247, 0.4)',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.1)'
            }}
          >
            {/* Logo Section */}
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-20"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  SentiScope
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Sparkles className="w-3 h-3" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  item.active && (
                    <motion.li key={item.slug}>
                      <NavLink
                        to={item.slug}
                        isActive={activeTab === item.slug}
                        onClick={() => setActiveTab(item.slug)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                          activeTab === item.slug 
                            ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-400/30' 
                            : 'text-white hover:text-purple-300 hover:bg-white/5'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </NavLink>
                    </motion.li>
                  )
                ))}
              </ul>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {authStatus ? (
                <>
                  <NavLink to="/dashboard/sentiment-analysis">
                    <Button className="relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Dashboard
                      </span>
                    </Button>
                  </NavLink>
                  <LogoutBtn />
                </>
              ) : (
                <>
                  <NavLink to="/login">
                    <Button variant="secondary">
                      <User className="w-4 h-4" />
                      Log In
                    </Button>
                  </NavLink>
                  <NavLink to="/signup">
                    <Button>
                      <Sparkles className="w-4 h-4" />
                      Sign Up
                    </Button>
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-white hover:text-purple-300 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-2 mx-4 overflow-hidden"
            >
              <motion.div 
                className="bg-slate-800/90 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-4 shadow-2xl"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {/* Mobile Navigation Items */}
                <ul className="space-y-2 mb-4">
                  {navItems.map((item, index) => (
                    item.active && (
                      <motion.li
                        key={item.slug}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <NavLink
                          to={item.slug}
                          isActive={activeTab === item.slug}
                          onClick={() => {
                            setActiveTab(item.slug);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                            activeTab === item.slug 
                              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-400/30' 
                              : 'text-white hover:text-purple-300 hover:bg-white/5'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </NavLink>
                      </motion.li>
                    )
                  ))}
                </ul>

                {/* Mobile Auth Buttons */}
                <motion.div 
                  className="space-y-2 pt-4 border-t border-purple-400/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {authStatus ? (
                    <>
                      <NavLink 
                        to="/dashboard/sentiment-analysis"
                        onClick={() => setIsMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full justify-center">
                          <Activity className="w-4 h-4" />
                          Dashboard
                        </Button>
                      </NavLink>
                      <div className="pt-2">
                        <LogoutBtn />
                      </div>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="secondary" className="w-full justify-center">
                          <User className="w-4 h-4" />
                          Log In
                        </Button>
                      </NavLink>
                      <NavLink 
                        to="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full justify-center">
                          <Sparkles className="w-4 h-4" />
                          Sign Up
                        </Button>
                      </NavLink>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20 lg:h-24"></div>
    </>
  );
};

export default Navbar;