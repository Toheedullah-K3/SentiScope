import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Globe, BarChart3, Sparkles, ArrowRight, Search, TrendingUp, MessageCircle, Users, Star, Play, ChevronDown, Zap, Clock, Shield, Target, Eye, Activity } from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 text-white hover:bg-slate-700/50 hover:border-purple-400/50",
    outline: "border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const TypewriterText = ({ texts, className = "" }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const text = texts[currentIndex];
    
    if (isTyping) {
      if (currentText.length < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [currentText, currentIndex, isTyping, texts]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-purple-400"
      >
        |
      </motion.span>
    </span>
  );
};

const LiveSearchDemo = () => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const demoSteps = [
    { text: "Connecting to Reddit...", color: "text-orange-400" },
    { text: "Fetching 1,247 posts...", color: "text-blue-400" },
    { text: "Analyzing sentiment...", color: "text-purple-400" },
    { text: "Generating insights...", color: "text-green-400" },
    { text: "Analysis complete!", color: "text-cyan-400" }
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsActive(false);
            setProgress(0);
            setCurrentStep(0);
            return 0;
          }
          
          const newProgress = prev + 2;
          const stepProgress = Math.floor(newProgress / 20);
          setCurrentStep(Math.min(stepProgress, demoSteps.length - 1));
          
          return newProgress;
        });
      }, 80);
      
      return () => clearInterval(interval);
    }
  }, [isActive, demoSteps.length]);

  return (
    <motion.div
      className="bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4 mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
      transition={{ duration: 0.3 }}
    >
      {isActive && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className={`text-sm font-medium ${demoSteps[currentStep]?.color}`}>
              {demoSteps[currentStep]?.text}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
};

const InteractiveStats = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  
  const stats = [
    { icon: MessageCircle, label: "Posts Analyzed", value: 2100000, suffix: "+", color: "text-purple-400", description: "Real-time posts processed across all platforms" },
    { icon: Users, label: "Active Users", value: 15000, suffix: "+", color: "text-cyan-400", description: "Businesses and researchers using our platform" },
    { icon: TrendingUp, label: "Insights Generated", value: 450000, suffix: "+", color: "text-pink-400", description: "Actionable insights delivered to users" },
    { icon: Star, label: "Accuracy Rate", value: 94, suffix: "%", color: "text-green-400", description: "ML model accuracy across sentiment classifications" }
  ];

  useEffect(() => {
    stats.forEach((stat, index) => {
      const targetValue = stat.value;
      const duration = 2000;
      const steps = 60;
      const stepValue = targetValue / steps;
      
      let currentValue = 0;
      const interval = setInterval(() => {
        currentValue += stepValue;
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          clearInterval(interval);
        }
        
        setAnimatedValues(prev => {
          const newValues = [...prev];
          newValues[index] = Math.floor(currentValue);
          return newValues;
        });
      }, duration / steps);
    });
  }, []);

  const formatValue = (value, suffix) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K${suffix}`;
    }
    return `${value}${suffix}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 + index * 0.1 }}
          className="text-center group relative"
          onMouseEnter={() => setHoveredStat(index)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <motion.div
            className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
            whileHover={{ y: -5 }}
          >
            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            
            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3 relative z-10`} />
            <div className={`text-2xl font-bold text-white mb-1 relative z-10`}>
              {formatValue(animatedValues[index], stat.suffix)}
            </div>
            <div className="text-sm text-gray-400 relative z-10">{stat.label}</div>
          </motion.div>
          
          {/* Tooltip */}
          <AnimatePresence>
            {hoveredStat === index && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-purple-400/30 rounded-lg p-3 text-sm text-gray-300 whitespace-nowrap z-20 shadow-xl"
              >
                {stat.description}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-800 border-l border-t border-purple-400/30 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const LiveAnalysisPreview = () => {
  const [isLive, setIsLive] = useState(false);
  const [currentData, setCurrentData] = useState({
    positive: 45,
    negative: 25,
    neutral: 30,
    totalPosts: 1247
  });

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setCurrentData(prev => ({
          positive: Math.max(0, Math.min(100, prev.positive + (Math.random() - 0.5) * 10)),
          negative: Math.max(0, Math.min(100, prev.negative + (Math.random() - 0.5) * 8)),
          neutral: Math.max(0, Math.min(100, prev.neutral + (Math.random() - 0.5) * 6)),
          totalPosts: prev.totalPosts + Math.floor(Math.random() * 5)
        }));
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-6 mb-16"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          Live Analysis Preview
        </h3>
        <Button
          variant={isLive ? "outline" : "primary"}
          className="text-sm px-4 py-2"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? "Stop Live" : "Start Live"}
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-300">
              {isLive ? "Live Analysis" : "Demo Mode"} • {currentData.totalPosts} posts
            </span>
          </div>
          
          <div className="space-y-3">
            {[
              { label: "Positive", value: currentData.positive, color: "bg-green-500" },
              { label: "Neutral", value: currentData.neutral, color: "bg-yellow-500" },
              { label: "Negative", value: currentData.negative, color: "bg-red-500" }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-16">{item.label}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <motion.div
                    className={`${item.color} h-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-white w-12">{Math.round(item.value)}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-700/30 rounded-xl p-4">
          <h4 className="text-sm font-medium text-purple-300 mb-3">Recent Insights</h4>
          <div className="space-y-2 text-xs text-gray-400">
            <motion.div
              key={currentData.totalPosts}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              {isLive ? "New sentiment spike detected in trending topics" : "Click 'Start Live' to see real insights"}
            </motion.div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              Analyzing cross-platform sentiment patterns
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-pink-400 rounded-full"></div>
              ML confidence: 94.2% accuracy maintained
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [currentPlatform, setCurrentPlatform] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  
  const platforms = ['Reddit', 'Twitter', 'GNews'];
  const platformColors = ['bg-orange-500', 'bg-blue-500', 'bg-red-500'];
  
  const typewriterTexts = [
    "Real-time sentiment analysis",
    "AI-powered social insights",
    "Multi-platform monitoring",
    "Advanced emotion detection"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlatform((prev) => (prev + 1) % platforms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced ML models including TextBlob, VADER, and GenAI for precise sentiment detection",
      color: "from-purple-500 to-purple-600",
      interactive: true
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Analyze sentiment across Reddit, Twitter, and news sources in real-time",
      color: "from-cyan-500 to-cyan-600",
      interactive: true
    },
    {
      icon: BarChart3,
      title: "Rich Visualizations",
      description: "Interactive charts, word clouds, and timeline analysis for deeper insights",
      color: "from-pink-500 to-pink-600",
      interactive: true
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowLiveDemo(true);
      // Simulate navigation or analysis
      console.log('Analyzing:', searchValue);
    }
  };

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
        {[...Array(50)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Enhanced Hero Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Dynamic Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <motion.div
                className="inline-flex items-center gap-2 py-2 px-6 bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-full border border-purple-400/30 text-purple-200 font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
                <TypewriterText texts={typewriterTexts} />
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.h1
                className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                SentiScope
              </motion.h1>
              <motion.h2 
                className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI-Powered <span className="text-purple-400">Insights</span>
              </motion.h2>
            </motion.div>

            {/* Enhanced Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Uncover real-time emotions behind trends, brands, and topics across social media. 
              Transform social chatter into <span className="text-purple-400 font-semibold">powerful insights</span> with 
              cutting-edge AI sentiment analysis.
            </motion.p>

            {/* Enhanced Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <motion.div
                    className={`flex bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-3 shadow-2xl transition-all duration-300 ${
                      isSearchFocused ? 'border-purple-400/60 shadow-purple-400/20' : 'border-purple-400/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        placeholder="Analyze sentiment—Try 'AI', 'Bitcoin', or 'Elections'!"
                        className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 outline-none text-lg"
                      />
                      {/* Enhanced Platform Indicator */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                        <span className="text-xs text-gray-400">on</span>
                        <motion.div
                          key={currentPlatform}
                          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                          className={`px-2 py-1 ${platformColors[currentPlatform]} rounded-md text-white text-xs font-medium`}
                        >
                          {platforms[currentPlatform]}
                        </motion.div>
                      </div>
                    </div>
                    <Button type="submit" className="ml-2">
                      <Search className="w-4 h-4" />
                      Analyze
                    </Button>
                  </motion.div>
                </div>
              </form>
              
              {/* Live Demo Component */}
              <LiveSearchDemo />
              
              {/* Enhanced suggestions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6 flex justify-center gap-3 flex-wrap"
              >
                {['Bitcoin', 'ChatGPT', 'Climate Change', 'Tesla', 'Elections', 'NFTs'].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    onClick={() => setSearchValue(suggestion)}
                    className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 border border-purple-400/20 hover:border-purple-400/40 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Interactive Stats */}
            <InteractiveStats />

            {/* Live Analysis Preview */}
            <LiveAnalysisPreview />
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">SentiScope?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Advanced AI technology meets intuitive design for unparalleled sentiment analysis
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group"
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105 h-full relative overflow-hidden">
                    {/* Animated background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                    
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 relative z-10`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed relative z-10">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-12 relative overflow-hidden"
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl"
                  animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500 rounded-full blur-2xl"
                  animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                  transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                />
              </div>
              
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                Ready to <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Transform Your Insights?</span>
              </motion.h2>
              <p className="text-lg text-gray-300 mb-8 relative z-10">
                Join thousands of businesses and researchers leveraging AI to uncover actionable insights from social media.
              </p>
              <Button
                variant="primary"
                className="text-lg px-8 py-3 relative z-10"
                onClick={() => setShowLiveDemo(true)}
              >
                Start Free Trial
              </Button>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.div>
          </div>
        </section>
        {/* Footer Section */}
        <footer className="py-12 bg-slate-900/80">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-300">
              &copy; {new Date().getFullYear()} SentiScope. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
export { Home, Button, TypewriterText, LiveSearchDemo, InteractiveStats, LiveAnalysisPreview };
export default Home;