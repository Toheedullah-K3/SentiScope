import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, TeamMember, Timeline, ValueCard } from '@/components';
import { teamMembers, projectValues, stats } from '@/components/data';
import { 
  Heart,
  Mail,
  Rocket,
  GraduationCap,
  Trophy,
  Building,
} from 'lucide-react';




const AboutUs = () => {
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  

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
      

    </div>
  );
}
export default AboutUs;
