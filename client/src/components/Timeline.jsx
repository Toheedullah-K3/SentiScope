import React from 'react'
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain, Microscope, Cpu, Trophy } from 'lucide-react';

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

export default Timeline;