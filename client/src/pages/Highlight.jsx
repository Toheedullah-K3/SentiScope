import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
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
  Sparkles,
  ArrowRight,
  Play,
  BarChart3,
  Award,
  Target,
  Lightbulb,
  Filter,
  ChevronRight,
  ThumbsUp,
  AlertTriangle,
  Bookmark,
  Share
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

const HighlightCard = ({ highlight, index }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const typeColors = {
    insight: 'from-purple-500 to-purple-600',
    trend: 'from-cyan-500 to-cyan-600',
    alert: 'from-red-500 to-red-600',
    discovery: 'from-green-500 to-green-600'
  };

  const typeIcons = {
    insight: Lightbulb,
    trend: TrendingUp,
    alert: AlertTriangle,
    discovery: Award
  };

  const TypeIcon = typeIcons[highlight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300 group relative overflow-hidden"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${typeColors[highlight.type]} flex items-center justify-center`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <TypeIcon className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                highlight.type === 'insight' ? 'bg-purple-500/20 text-purple-300' :
                highlight.type === 'trend' ? 'bg-cyan-500/20 text-cyan-300' :
                highlight.type === 'alert' ? 'bg-red-500/20 text-red-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {highlight.type.charAt(0).toUpperCase() + highlight.type.slice(1)}
              </span>
              <span className="text-xs text-gray-500">{highlight.timeAgo}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{highlight.title}</h3>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isBookmarked ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-purple-400 hover:bg-purple-500/10'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
        </motion.button>
      </div>

      {/* Content */}
      <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
        {highlight.description}
      </p>

      {/* Metrics */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{highlight.mentions}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{highlight.reach}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="w-4 h-4" />
            <span>{highlight.engagement}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < highlight.importance ? 'text-yellow-400 fill-current' : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {highlight.tags.map((tag, idx) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index * 0.1) + (idx * 0.05) }}
            className="px-3 py-1 bg-slate-700/50 border border-purple-400/20 rounded-lg text-xs text-purple-300"
          >
            #{tag}
          </motion.span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button variant="small" className="text-xs">
          <Eye className="w-3 h-3" />
          View Details
        </Button>
        
        <div className="flex items-center gap-2">
          <motion.button
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const QuickInsight = ({ insight, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group"
    whileHover={{ x: 10 }}
  >
    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${insight.color} flex items-center justify-center flex-shrink-0`}>
      <insight.icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium mb-1">{insight.title}</h4>
      <p className="text-sm text-gray-400">{insight.description}</p>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-white">{insight.value}</div>
      <div className={`text-xs ${insight.trend === 'up' ? 'text-green-400' : insight.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
        {insight.change}
      </div>
    </div>
  </motion.div>
);

const FilterTab = ({ active, children, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
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

const Highlights = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const highlights = [
    {
      type: 'insight',
      title: 'AI Sentiment Surge in Tech Discussions',
      description: 'Artificial Intelligence discussions show a remarkable 67% positive sentiment increase over the past week, indicating growing optimism about AI technologies and their applications across various industries.',
      mentions: '15.2K',
      reach: '2.3M',
      engagement: '89%',
      importance: 5,
      tags: ['AI', 'Technology', 'Innovation', 'Future'],
      timeAgo: '2 hours ago'
    },
    {
      type: 'trend',
      title: 'Sustainable Energy Conversations Peak',
      description: 'Environmental discussions around renewable energy sources are trending upward with 43% more engagement than last month, reflecting increased public interest in climate solutions.',
      mentions: '23.7K',
      reach: '4.1M',
      engagement: '76%',
      importance: 4,
      tags: ['Climate', 'Energy', 'Sustainability', 'Environment'],
      timeAgo: '4 hours ago'
    },
    {
      type: 'alert',
      title: 'Cryptocurrency Market Sentiment Shift',
      description: 'Digital currency discussions experienced a sharp sentiment decline of 28% following recent market volatility, with increased mentions of regulatory concerns and market uncertainty.',
      mentions: '31.5K',
      reach: '5.8M',
      engagement: '94%',
      importance: 5,
      tags: ['Crypto', 'Finance', 'Market', 'Regulation'],
      timeAgo: '6 hours ago'
    },
    {
      type: 'discovery',
      title: 'Mental Health Awareness Growing',
      description: 'Social media conversations about mental health show unprecedented positive engagement, with support communities and wellness resources receiving 156% more interactions.',
      mentions: '12.8K',
      reach: '1.9M',
      engagement: '82%',
      importance: 4,
      tags: ['Health', 'Wellness', 'Community', 'Support'],
      timeAgo: '8 hours ago'
    },
    {
      type: 'trend',
      title: 'Remote Work Evolution Continues',
      description: 'Workplace flexibility discussions maintain strong positive sentiment with hybrid work models receiving 73% approval in professional communities and career-focused platforms.',
      mentions: '9.3K',
      reach: '1.4M',
      engagement: '71%',
      importance: 3,
      tags: ['Work', 'Career', 'Flexibility', 'Professional'],
      timeAgo: '12 hours ago'
    },
    {
      type: 'insight',
      title: 'Education Technology Breakthrough',
      description: 'EdTech platforms and online learning tools show remarkable sentiment improvement with 91% positive mentions, highlighting successful adaptation to digital education methods.',
      mentions: '7.6K',
      reach: '1.1M',
      engagement: '68%',
      importance: 3,
      tags: ['Education', 'Technology', 'Learning', 'Digital'],
      timeAgo: '1 day ago'
    }
  ];

  const quickInsights = [
    {
      icon: TrendingUp,
      title: 'Top Performer',
      description: 'AI discussions lead with 67% positive sentiment',
      value: '+67%',
      change: '↑ 12%',
      trend: 'up',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Activity,
      title: 'Most Engaging',
      description: 'Cryptocurrency topics drive highest interaction',
      value: '94%',
      change: '↑ 8%',
      trend: 'up',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Growing Community',
      description: 'Mental health support shows strong growth',
      value: '+156%',
      change: '↑ 23%',
      trend: 'up',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Sustainability topics reach widest audience',
      value: '4.1M',
      change: '↑ 15%',
      trend: 'up',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const filteredHighlights = activeFilter === 'all' 
    ? highlights 
    : highlights.filter(highlight => highlight.type === activeFilter);

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
              <div className="flex justify-center mb-8">
                <motion.div
                  className="inline-flex items-center gap-3 py-3 px-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-full border border-purple-400/30 text-purple-200 font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-5 h-5" />
                  <span>Key Insights & Discoveries</span>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-6">
                Highlights
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover the most significant sentiment insights, trending patterns, and noteworthy discoveries 
                from our AI-powered analysis across global conversations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Insights */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Quick <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Insights</span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickInsights.map((insight, index) => (
                  <QuickInsight key={insight.title} insight={insight} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="flex flex-wrap gap-3 bg-slate-800/30 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-3">
                {['all', 'insight', 'trend', 'alert', 'discovery'].map((filter) => (
                  <FilterTab
                    key={filter}
                    active={activeFilter === filter}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </FilterTab>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Highlights Grid */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8"
              >
                {filteredHighlights.map((highlight, index) => (
                  <HighlightCard
                    key={`${highlight.title}-${activeFilter}`}
                    highlight={highlight}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
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
              <Target className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Create Your <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Custom</span> Highlights
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Set up personalized highlight feeds based on your interests, industry, or research focus. 
                Never miss the insights that matter most to you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  <Zap className="w-5 h-5" />
                  Customize Highlights
                </Button>
                <Button variant="outline">
                  <Play className="w-5 h-5" />
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default Highlights;