import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, User, TrendingUp, Activity, Home, Info, Sparkles, Bell, Settings } from 'lucide-react';
import { Button, LogoutBtn } from '../index.js';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SidebarContext } from '../SidebarItemParent.jsx';

const NavLink = ({ to, children, className, isActive, onClick }) => (
  <Link
    to={to}
    className={className}
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  const [expanded, setExpanded] = useState(true); 
  
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  
  // Check if we're on a dashboard route
  const isDashboard = location.pathname.startsWith('/dashboard');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active tab based on current location
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: Home },
    { name: 'About', slug: '/about-us', active: true, icon: Info },
    { name: 'Trending', slug: '/trending', active: true, icon: TrendingUp },
    { name: 'Highlights', slug: '/highlights', active: true, icon: Activity }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Landing Page Navbar 
  if (!isDashboard) {
    return (
      <SidebarContext.Provider value={{ expanded, setExpanded }}>
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
              ? 'py-2 bg-slate-900/80 backdrop-blur-xl border-b border-purple-400/20' 
              : 'py-2 bg-slate-900/80 backdrop-blur-xl border-b border-purple-400/20'
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
                    <Brain className="w-6 h-6" />
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
        <div className="h-20 lg:h-24"></div>
      </SidebarContext.Provider>
    );
  }

  // Dashboard Top Bar - Fixed positioning based on expanded state
  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 right-0 z-30 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 h-16 transition-all duration-300
                ${expanded ? 'left-0 md:left-64' : 'left-0 md:left-20'}
            `}
      >
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          
          {/* Left Section - Mobile logo and breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Mobile Logo (only visible on small screens when sidebar is hidden) */}
            <motion.div 
              className="flex items-center gap-2 md:hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-1.5 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                SentiScope
              </h1>
            </motion.div>

            {/* Page Title/Breadcrumb */}
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-white">
                {location.pathname === '/dashboard' ? 'Dashboard' :
                 location.pathname === '/dashboard/sentiment-analysis' ? 'Sentiment Analysis' :
                 location.pathname === '/dashboard/compare-trends' ? 'Compare Trends' :
                 location.pathname === '/dashboard/saved-analysis' ? 'History & Saved' :
                 location.pathname === '/dashboard/cluster-analysis' ? 'Cluster Analysis' :
                 location.pathname === '/dashboard/help' ? 'Help' : 'Dashboard'}
              </h2>
            </div>
          </div>

          {/* Right Section - Quick Actions & User Menu */}
          <div className="flex items-center gap-3">
            
            {/* Quick Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <NavLink to="/">
                <Button 
                  variant="secondary" 
                  className="text-sm py-2 px-3 bg-slate-700/50 hover:bg-slate-700 border-slate-600"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden lg:inline ml-1">Home</span>
                </Button>
              </NavLink>
              
              <div className="hidden sm:block">
                <LogoutBtn />
              </div>

              {/* Mobile Menu for Dashboard */}
              <motion.button
                onClick={toggleMenu}
                className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu for Dashboard (Small screens only) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="sm:hidden overflow-hidden border-t border-slate-700/50 absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-md"
            >
              <div className="p-4 space-y-2">
                <NavLink 
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  <Button variant="secondary" className="w-full justify-center bg-slate-700/50 hover:bg-slate-700 border-slate-600">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                </NavLink>
                <LogoutBtn />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dashboard Top Bar Spacer */}
      <div className="h-16"></div>
    </SidebarContext.Provider>
  );
};

export default Navbar;