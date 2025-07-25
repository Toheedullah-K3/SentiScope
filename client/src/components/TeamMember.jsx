import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap,  } from 'lucide-react';

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

export default TeamMember;