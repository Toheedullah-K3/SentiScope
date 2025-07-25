import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Globe, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Star, 
  Play, 
  ChevronDown, 
  Zap, 
  Clock, 
  Shield, 
  Target, 
  Eye, 
  Activity,
  Heart,
  Award,
  Lightbulb,
  Code,
  Database,
  Palette,
  Coffee,
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Calendar,
  Rocket,
  BookOpen,
  Briefcase,
  GraduationCap,
  Trophy,
  Cpu,
  FlaskConical,
  Network,
  Microscope,
  Building,
  Users2
} from 'lucide-react';

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

const TeamMember = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
        {/* Animated background on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        
        {/* Avatar with University Badge */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-white text-3xl font-bold relative z-10 border-4 border-purple-400/30`}>
            {member.avatar}
          </div>
          {/* IIUI Badge */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center border-2 border-slate-800 z-20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
        </motion.div>
        
        <div className="text-center relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
          <p className="text-purple-300 text-lg font-medium mb-1">{member.role}</p>
          <p className="text-gray-400 text-sm font-medium mb-3">{member.university}</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">{member.bio}</p>
          
          {/* Academic Info */}
          <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
            <div className="text-xs text-gray-400 mb-1">Academic Focus</div>
            <div className="text-purple-300 font-medium text-sm">{member.specialization}</div>
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {member.skills.map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-3 py-1 bg-slate-700/50 text-xs text-gray-300 rounded-full border border-purple-400/20 hover:border-purple-400/40 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-3">
            {member.social.map((link, linkIndex) => (
              <motion.a
                key={linkIndex}
                href={link.url}
                className="w-10 h-10 bg-slate-700/50 hover:bg-purple-600/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ValueCard = ({ value, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
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
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 relative z-10`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <value.icon className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{value.title}</h3>
        <p className="text-gray-300 leading-relaxed relative z-10">{value.description}</p>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const milestones = [
    {
      year: "Fall 2021",
      title: "CS Journey at IIUI Begins",
      description: "Started our Computer Science degree at International Islamic University, Islamabad. First exposure to programming with C++ and data structures.",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2022",
      title: "Core Programming & Web Development",
      description: "Mastered Java, Python, and web technologies. Built our first projects and discovered the power of full-stack development through hands-on coursework.",
      icon: Code,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2023",
      title: "AI & Machine Learning Deep Dive",
      description: "Enrolled in advanced AI courses, learned about neural networks, NLP, and sentiment analysis. Started experimenting with Python libraries like NLTK and TextBlob.",
      icon: Brain,
      color: "from-cyan-500 to-cyan-600" 
    },
    {
      year: "Early 2024",
      title: "FYP Topic Selection & Research",
      description: "Chose 'Real-time Multi-platform Sentiment Analysis' as our Final Year Project. Conducted extensive research on VADER, TextBlob, and modern GenAI models.",
      icon: Microscope,
      color: "from-pink-500 to-pink-600"
    },
    {
      year: "Mid 2024",
      title: "SentiScope Development Phase",
      description: "Built the core architecture, integrated multiple AI models, developed the web interface, and implemented real-time data processing capabilities.",
      icon: Cpu,
      color: "from-green-500 to-green-600" 
    },
    {
      year: "2025",
      title: "Project Completion & Deployment",
      description: "Successfully completed and deployed SentiScope as our FYP, demonstrating comprehensive sentiment analysis across Reddit, Twitter, and Google News.",
      icon: Trophy,
      color: "from-green-500 to-green-600" 
    }
  ];

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-pink-500"></div> 
      
      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <motion.div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center shadow-lg relative z-10 border-4 border-slate-800`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <milestone.icon className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Content */}
            <div className="ml-8 flex-1">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {milestone.year}
                  </span>
                  <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-400/30 to-transparent"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                <p className="text-gray-300 leading-relaxed">{milestone.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);

  const teamMembers = [
    {
      name: "Toheed Ullah Khan",
      role: "FYP Team Lead & Full-Stack Developer",
      university: "International Islamic University, Islamabad",
      bio: "Final year Computer Science student passionate about AI and machine learning. Leading the development of SentiScope with expertise in full-stack development and sentiment analysis systems.",
      avatar: "TK",
      gradient: "from-purple-500 to-indigo-600",
      specialization: "AI/ML & Full-Stack Development",
      skills: ["React.js", "Framer Motion", "API Development", "Node.js", "MongoDB", "UI/UX"],
      social: [
        { icon: Github, url: "#" },
        { icon: Linkedin, url: "#" },
        { icon: Mail, url: "#" }
      ]
    },
    {
      name: "Bilal Asghar",
      role: "FYP Co-Developer & NLP Engineer",
      university: "International Islamic University, Islamabad",
      bio: "Final year Computer Science student specializing in Natural Language Processing and data science. Expert in sentiment analysis models, data visualization, and AI model integration.",
      avatar: "BA",
      gradient: "from-cyan-500 to-blue-600", 
      specialization: "NLP & Data Science",
      skills: ["Python", "NLP", "TextBlob", "VADER", "Data Visualization", "API Testing"],
      social: [
        { icon: Github, url: "#" },
        { icon: Linkedin, url: "#" },
        { icon: Mail, url: "#" }
      ]
    }
  ];

  const projectValues = [
    {
      icon: GraduationCap,
      title: "Academic Excellence at IIUI",
      description: "Built on solid computer science fundamentals from International Islamic University, Islamabad. Our project represents 4 years of dedicated learning and practical application.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FlaskConical,
      title: "Research & Innovation",
      description: "Extensive research into modern sentiment analysis techniques, comparing traditional methods like VADER and TextBlob with cutting-edge GenAI models for optimal accuracy.",
      color: "from-pink-500 to-pink-600" 
    },
    {
      icon: Users2,
      title: "Collaborative Teamwork",
      description: "Two CS students working together, combining our individual strengths in full-stack development and NLP research to create a comprehensive AI platform.",
      color: "from-cyan-500 to-cyan-600" 
    },
    {
      icon: Target,
      title: "Real-World Problem Solving",
      description: "Addressing the practical need for accessible sentiment analysis across multiple platforms, making complex AI insights available to businesses and researchers.",
      color: "from-yellow-500 to-orange-600" 
    }
  ];

  const stats = [
    { label: "Years at IIUI", value: 4, suffix: "", description: "Computer Science degree journey" },
    { label: "FYP Development", value: 10, suffix: "+", description: "Months of intensive development" },
    { label: "AI Models Integrated", value: 4, suffix: "", description: "TextBlob, VADER, GenAI, and custom models" },
    { label: "Data Sources", value: 5, suffix: "+", description: "Reddit, Twitter, Google News, and more" }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden font-inter">
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
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-3 py-3 px-8 bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-full border border-purple-400/30 text-purple-200 font-semibold mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Building className="w-5 h-5" />
                <span>International Islamic University, Islamabad</span>
                <GraduationCap className="w-5 h-5" />
              </motion.div>

              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent leading-tight mb-6">
                About Our Team
              </h1>
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-8">
                CS Students Building the Future of <span className="text-purple-400">Sentiment Analysis</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6">
                We're Toheed Ullah Khan and Bilal Asghar, two Computer Science students at International Islamic University, 
                Islamabad (IIUI), passionate about artificial intelligence and natural language processing. 
              </p>
              <p className="text-lg text-gray-400 max-w-4xl mx-auto leading-relaxed">
                <strong className="text-purple-400">SentiScope</strong> is our Final Year Project (FYP) - a comprehensive 
                real-time sentiment analysis platform that demonstrates our mastery of AI, machine learning, and full-stack 
                development acquired through our 4-year journey at IIUI.
              </p>
            </motion.div>
          </div>
        </section>

        {/* University & Project Highlights */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Trophy className="w-8 h-8 text-purple-400" />
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    Our <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">FYP Journey</span>
                  </h2>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  As Final Year Project students at IIUI's Computer Science department, we embarked on an ambitious journey 
                  to create SentiScope - a platform that showcases everything we've learned from programming fundamentals 
                  to advanced AI concepts.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  Our project combines theoretical knowledge from our coursework with practical implementation, resulting 
                  in a production-ready sentiment analysis platform that processes real-time data from multiple social 
                  media sources using state-of-the-art AI models.
                </p>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-purple-400/20 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-bold text-purple-400 mb-3">🎓 Academic Achievement Highlights</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Integrated 4+ AI models (TextBlob, VADER, GenAI)</li>
                    <li>• Real-time data processing from 3+ platforms</li>
                    <li>• Full-stack web application with modern UI/UX</li>
                    <li>• Comprehensive sentiment visualization dashboard</li>
                  </ul>
                </div>
                <Button>
                  <Rocket className="w-5 h-5" />
                  Explore Our Project
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                          {animatedValues[index]}{stat.suffix}
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                        <div className="text-xs text-gray-400">{stat.description}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* University Badge */}
                  <div className="mt-6 pt-6 border-t border-purple-400/20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">IIUI Computer Science</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Values Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Project <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Foundation</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The principles and methodologies that guided our Final Year Project development at IIUI
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {projectValues.map((value, index) => (
                <ValueCard key={value.title} value={value} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet the <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Developers</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Two passionate Computer Science students from IIUI who transformed their FYP idea into a production-ready AI platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <TeamMember key={member.name} member={member} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Academic <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                From CS beginners at IIUI to AI developers - here's our complete journey
              </p>
            </motion.div>

            <Timeline />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-12"
            >
              <div className="flex justify-center items-center gap-4 mb-6">
                <Mail className="w-16 h-16 text-purple-400" />
                <Heart className="w-8 h-8 text-pink-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Connect with <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Us</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Interested in our Final Year Project? Want to collaborate or learn more about our work at IIUI? 
                We'd love to hear from you!
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="primary" className="flex items-center">
                  <Mail className="w-5 h-5" />
                  Email Us
                </Button>
                <Button variant="secondary" className="flex items-center">
                  <Heart className="w-5 h-5" />
                  Support Us
                </Button> 
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      {/* Enhanced Footer */}
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
          className="absolute w-0.5 h-0.5 bg-purple-400/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.2, 0.6, 0.2],
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

    </div>
  );
}
export default AboutUs;
