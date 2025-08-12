import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Calendar, 
  Users, 
  MessageCircle, 
  Heart, 
  Hash,
  Eye,
  Clock,
  Activity,
  Zap,
  Filter,
  Sparkles,
  ArrowRight,
  Play,
  BarChart3,
  Map,
  Search,
  RefreshCw,
  Settings,
  Bell,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary: "bg-slate-800/50 backdrop-blur-sm border border-purple-400/30 text-white hover:bg-slate-700/50 hover:border-purple-400/50",
    outline: "border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400",
    small: "px-4 py-2 text-sm rounded-lg"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const TrendingCategory = ({ title, description, icon: Icon, color, items, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300 group"
    whileHover={{ y: -10, scale: 1.02 }}
  >
    <motion.div
      className="relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>

      {/* Sample trending items */}
      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: (index * 0.2) + (idx * 0.1) }}
            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-purple-400 font-bold">#{idx + 1}</span>
              <span className="text-white font-medium">{item.title}</span>
              <motion.div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  item.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                  item.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                 item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                 <Minus className="w-3 h-3" />}
                {item.change}
              </motion.div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MessageCircle className="w-4 h-4" />
              <span>{item.engagement}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View more button */}
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      >
        <Button variant="small" className="w-full justify-center">
          <Eye className="w-4 h-4" />
          Explore Category
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </motion.div>
  </motion.div>
);

const SentimentOverview = () => {
  const sentimentData = [
    { label: 'Positive', value: 45, color: 'bg-green-500', icon: ThumbsUp },
    { label: 'Neutral', value: 35, color: 'bg-yellow-500', icon: Minus },
    { label: 'Negative', value: 20, color: 'bg-red-500', icon: ThumbsDown }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Global Sentiment Overview</h3>
        <p className="text-gray-400">Current sentiment distribution across all trending topics</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sentimentData.map((sentiment, index) => (
          <motion.div
            key={sentiment.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              className="relative mb-4"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 flex items-center justify-center relative overflow-hidden">
                <sentiment.icon className="w-8 h-8 text-white z-10" />
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 ${sentiment.color} transition-all duration-1000`}
                  initial={{ height: '0%' }}
                  whileInView={{ height: `${sentiment.value}%` }}
                  transition={{ delay: index * 0.2, duration: 1 }}
                />
              </div>
            </motion.div>
            <div className="text-2xl font-bold text-white mb-1">{sentiment.value}%</div>
            <div className="text-sm text-gray-400">{sentiment.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const FilterButton = ({ active, children, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      active 
        ? 'bg-purple-500 text-white shadow-lg' 
        : 'bg-slate-800/50 border border-purple-400/30 text-purple-300 hover:bg-purple-400/10'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const trendingCategories = [
    {
      title: "Technology",
      description: "Latest tech trends and innovations",
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      items: [
        { title: "Artificial Intelligence", trend: "up", change: "+15%", engagement: "2.3K" },
        { title: "Machine Learning", trend: "up", change: "+12%", engagement: "1.8K" },
        { title: "Cloud Computing", trend: "neutral", change: "+2%", engagement: "1.2K" },
        { title: "Cybersecurity", trend: "up", change: "+8%", engagement: "980" }
      ]
    },
    {
      title: "Finance",
      description: "Market trends and economic insights",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      items: [
        { title: "Cryptocurrency", trend: "down", change: "-5%", engagement: "3.1K" },
        { title: "Stock Market", trend: "up", change: "+7%", engagement: "2.7K" },
        { title: "Digital Banking", trend: "up", change: "+18%", engagement: "1.5K" },
        { title: "Investment Trends", trend: "neutral", change: "+1%", engagement: "1.1K" }
      ]
    },
    {
      title: "Social & Culture",
      description: "Social movements and cultural trends",
      icon: Users,
      color: "from-pink-500 to-pink-600",
      items: [
        { title: "Social Media", trend: "up", change: "+22%", engagement: "4.2K" },
        { title: "Entertainment", trend: "up", change: "+16%", engagement: "3.5K" },
        { title: "Lifestyle Trends", trend: "up", change: "+9%", engagement: "2.1K" },
        { title: "Education", trend: "neutral", change: "+3%", engagement: "1.4K" }
      ]
    },
    {
      title: "Global Events",
      description: "World news and current affairs",
      icon: Globe,
      color: "from-cyan-500 to-cyan-600",
      items: [
        { title: "Climate Change", trend: "up", change: "+25%", engagement: "5.1K" },
        { title: "Global Politics", trend: "up", change: "+13%", engagement: "3.8K" },
        { title: "Health & Medicine", trend: "neutral", change: "+4%", engagement: "2.2K" },
        { title: "Space Exploration", trend: "up", change: "+11%", engagement: "1.7K" }
      ]
    }
  ];

  const quickStats = [
    { label: "Active Topics", value: "247", icon: Hash, color: "text-purple-400" },
    { label: "Daily Mentions", value: "1.2M", icon: MessageCircle, color: "text-cyan-400" },
    { label: "Global Reach", value: "15.3M", icon: Globe, color: "text-pink-400" },
    { label: "Trend Updates", value: "156/hr", icon: Activity, color: "text-yellow-400" }
  ];

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
        {[...Array(40)].map((_, i) => (
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
        {/* Hero Section */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-6">
                Trending Topics
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover what's capturing global attention with real-time sentiment analysis across social media platforms, 
                news sources, and online communities.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 text-center group hover:border-purple-400/40 transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Sentiment Overview */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <SentimentOverview />
          </div>
        </section>

        {/* Trending Categories */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore by <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Category</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Dive deep into specific areas of interest and discover emerging trends in your field
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {trendingCategories.map((category, index) => (
                <TrendingCategory
                  key={category.title}
                  {...category}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Activity className="w-10 h-10 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Start Your <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Analysis</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Ready to dive deeper? Get personalized insights, set up custom alerts, 
                and track the topics that matter most to you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  <Search className="w-5 h-5" />
                  Analyze Topics
                </Button>
                <Button variant="outline">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default Trending;