import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileText, Smile, Globe, Brain, Sparkles, BarChart3 } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SentimentOverTime,
  SentimentBreakdown,
  PostTimeline,
  TopKeywords,
  WordCloudChart,
  Input,
  Button,
  Radio,
  StatCard
} from "@/components";

const SearchAnalyze = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [option, setOption] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [progress, setProgress] = useState(0);
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchDetailsFromId = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequestById`, {
          params: { id },
          withCredentials: true
        });

        const {
          search,
          model,
          platform,
          total_posts,
          average_sentiment,
          sentiment_details
        } = response.data;

        setOption({
          search,
          model,
          platform,
          total_posts,
          average_sentiment,
          sentiment_details,
          id
        });
      } catch (error) {
        console.error("Error loading data on refresh:", error?.response?.data || error.message);
        alert("Search data not found. Please run a new analysis.");
        navigate("/dashboard/sentiment-analysis");
      }
    };

    fetchDetailsFromId();
  }, [id]);

  const createSearch = async (data) => {
    setIsLoading(true);
    setProgress(0);
    
    // Simulate realistic loading stages
    const stages = [
      { stage: 'Connecting to platform...', duration: 800, progress: 20 },
      { stage: 'Fetching posts...', duration: 1200, progress: 50 },
      { stage: 'Analyzing sentiment...', duration: 1000, progress: 80 },
      { stage: 'Generating insights...', duration: 600, progress: 95 }
    ];
    
    let currentProgress = 0;
    
    // Animate through loading stages
    const animateStages = async () => {
      for (const { stage, duration, progress } of stages) {
        setLoadingStage(stage);
        
        // Smooth progress animation
        const startProgress = currentProgress;
        const progressDiff = progress - startProgress;
        const steps = 20;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
          const newProgress = startProgress + (progressDiff * i) / steps;
          setProgress(newProgress);
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
        
        currentProgress = progress;
      }
    };
    
    try {
      // Start loading animation
      const animationPromise = animateStages();
      
      const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequest`, {
        params: {
          search: data.search,
          model: data.model,
          platform: data.platform
        },
        withCredentials: true
      });

      // Wait for animation to complete
      await animationPromise;
      
      // Final stage
      setLoadingStage('Complete!');
      setProgress(100);
      
      // Brief pause before showing results
      await new Promise(resolve => setTimeout(resolve, 500));

      const { total_posts, average_sentiment, sentiment_details, searchRequestId } = response.data;

      setOption({
        search: data.search,
        model: data.model,
        platform: data.platform,
        total_posts,
        average_sentiment,
        sentiment_details,
        id: searchRequestId
      });

      navigate(`/dashboard/sentiment-analysis?id=${searchRequestId}`);
    } catch (error) {
      console.error("Search failed:", error);
      setLoadingStage('Error occurred');
      setProgress(0);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Blurred Backgrounds */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Advanced Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center"
        >
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
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

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/20 shadow-2xl max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-cyan-400 rounded-full opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full opacity-40"></div>
                <div className="absolute inset-4 bg-gradient-to-tr from-purple-600 to-cyan-600 rounded-full"></div>
                <Brain className="absolute inset-0 w-8 h-8 text-white m-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Analysis in Progress</h3>
              <p className="text-gray-300 text-sm">Processing your request with advanced sentiment analysis</p>
            </div>

            {/* Progress Ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgb(100 116 139 / 0.2)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Current Stage */}
            <motion.div
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <p className="text-purple-300 font-medium mb-2">{loadingStage}</p>
              <div className="flex justify-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              />
              <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>

            {/* Process Steps */}
            <div className="mt-6 space-y-3">
              {[
                { label: 'Platform Connection', threshold: 20, icon: '🔗' },
                { label: 'Data Retrieval', threshold: 50, icon: '📡' },
                { label: 'Sentiment Analysis', threshold: 80, icon: '🧠' },
                { label: 'Report Generation', threshold: 95, icon: '📊' }
              ].map((step, index) => (
                <div key={step.label} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                    progress >= step.threshold 
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white' 
                      : progress >= step.threshold - 20 
                      ? 'bg-slate-600 text-gray-300 animate-pulse' 
                      : 'bg-slate-700 text-gray-500'
                  }`}>
                    {progress >= step.threshold ? '✓' : step.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium transition-colors duration-300 ${
                      progress >= step.threshold 
                        ? 'text-white' 
                        : progress >= step.threshold - 20 
                        ? 'text-gray-300' 
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                  {progress >= step.threshold && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Real-time Sentiment Analysis
          </h1>
          <p className="text-gray-300 mt-2">Run a search and visualize internet sentiment in real-time.</p>
        </div>

        {/* Form Container */}
        <motion.form
          onSubmit={handleSubmit(createSearch)}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl space-y-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Try 'AI', 'Bitcoin', or 'Election'..."
              className="flex-1 bg-slate-700/50 border border-purple-400/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:ring-2 focus:ring-purple-400"
              {...register("search")}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Platform Card Group */}
  <div>
  <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
    <Globe className="w-4 h-4" />
    Choose Platform
  </h3>
  <div className="grid grid-cols-3 gap-4">
    {[
      { label: "GNews", value: "gnews", icon: "N", color: "bg-red-500" },
      { label: "Reddit", value: "reddit", icon: "R", color: "bg-orange-500" },
      { label: "Twitter", value: "twitter", icon: "T", color: "bg-blue-500" },
    ].map((item) => (
      <label
        key={item.value}
        className="relative group cursor-pointer"
      >
        <input
          {...register("platform")}
          type="radio"
          value={item.value}
          className="peer hidden"
          disabled={isLoading}
        />
        <div className="bg-slate-800/40 backdrop-blur-md border border-purple-400/20 rounded-xl px-4 py-3 text-white text-center shadow-sm peer-checked:border-2 peer-checked:border-purple-500 group-hover:scale-[1.02] transition-all duration-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
          <div className={`w-6 h-6 ${item.color} rounded-full mx-auto mb-1 text-white flex items-center justify-center font-bold`}>
            {item.icon}
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </div>
      </label>
    ))}
  </div>
</div>


  {/* Model Card Group */}
  <div>
    <h3 className="text-sm font-semibold text-pink-300 mb-3 flex items-center gap-2">
      <Brain className="w-4 h-4" />
      Choose Model
    </h3>
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: "TextBlob", value: "textblob", icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
        { label: "VADER", value: "vader", icon: <Brain className="w-4 h-4 text-purple-400" /> },
        { label: "GenAI", value: "genai", icon: <Sparkles className="w-4 h-4 text-pink-400" /> }
      ].map((item) => (
        <label
          key={item.value}
          className="relative group cursor-pointer"
        >
          <input
            {...register("model")}
            type="radio"
            value={item.value}
            className="peer hidden"
            disabled={isLoading}
          />
          <div className="bg-slate-800/40 backdrop-blur-md border border-purple-400/20 rounded-xl px-4 py-3 text-white text-center shadow-sm peer-checked:border-2 peer-checked:border-pink-500 group-hover:scale-[1.02] transition-all duration-300 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed">
            <div className="flex justify-center mb-1">{item.icon}</div>
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
</div>

        </motion.form>

        {/* Empty State */}
        {!option.search && (
          <div className="text-center border border-dashed border-purple-400/30 rounded-xl bg-slate-800/50 p-10 mt-12 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">🔍 Ready to Analyze?</h2>
            <p className="text-gray-300">
              Enter a topic, select a platform and sentiment model to analyze trending discussions.
            </p>
          </div>
        )}

        {/* Stat Cards */}
        {option.search && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StatCard name="Total Posts" icon={FileText} value={option.total_posts || 0} color="#6366F1" />
            <StatCard name="Sentiment Score" icon={Smile} value={option.average_sentiment || 0} color="#8B5CF6" />
            <StatCard name="Platform" icon={Globe} value={option.platform || "—"} color="#EC4899" />
            <StatCard name="Model" icon={Brain} value={option.model || "—"} color="#10B981" />
          </motion.div>
        )}

        {/* Insights */}
        {option.search && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            <SentimentOverTime
              query={option.search}
              model={option.model}
              platform={option.platform}
            />
            <SentimentBreakdown sentimentDetails={option.sentiment_details || []} />
            <WordCloudChart sentimentDetails={option.sentiment_details || []} />
            <TopKeywords sentimentDetails={option.sentiment_details || []} />
          </motion.div>
        )}

        {/* Timeline */}
        {option.search && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <PostTimeline sentimentDetails={option.sentiment_details || []} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchAnalyze;