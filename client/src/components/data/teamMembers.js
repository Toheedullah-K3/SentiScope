import { Github, Linkedin, Mail } from 'lucide-react';

export const teamMembers = [
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