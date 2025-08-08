import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar
} from 'recharts';
import {
  Brain,
  Sparkles,
  BarChart3,
  Globe,
  Zap,
  RefreshCw,
  Settings,
  Target,
  Activity,
  CheckCircle2,
  TrendingUp,
  Users,
  Layers,
  GitBranch,
  Cpu,
  FileText,
  Eye,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Search,
  MessageSquare,
  TrendingDown,
  Heart,
  ThumbsDown,
  Info,
  BookOpen,
  Star,
  AlertTriangle,
  DollarSign,
  Clock,
  Calendar,
  UserCheck,
  Megaphone,
  Shield,
  Award,
  Briefcase,
  Coffee,
  History
} from 'lucide-react';

const ImprovedClusteringPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      query: '',
      platform: 'reddit',
      model: 'vader',
      algorithm: 'kmeans',
      clusters: 5,
      features: ['sentiment', 'engagement', 'content', 'temporal']
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [clusterData, setClusterData] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [availableOptions, setAvailableOptions] = useState({
    platforms: [],
    models: [],
    algorithms: []
  });
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load available options on component mount
  useEffect(() => {
    loadAvailableOptions();
    loadAnalysisHistory();
  }, []);

  const loadAvailableOptions = async () => {
    try {
      const [platformsRes, modelsRes, algorithmsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/clustering/platforms`),
        axios.get(`${apiUrl}/api/clustering/models`),
        axios.get(`${apiUrl}/api/clustering/algorithms`)
      ]);

      setAvailableOptions({
        platforms: platformsRes.data || ['reddit', 'twitter', 'gnews'],
        models: modelsRes.data || ['vader', 'textblob', 'genai'],
        algorithms: algorithmsRes.data || ['kmeans', 'hierarchical', 'dbscan', 'gaussian']
      });
    } catch (error) {
      console.error('Failed to load options:', error);
      // Use fallback defaults
      setAvailableOptions({
        platforms: ['reddit', 'twitter', 'gnews'],
        models: ['vader', 'textblob', 'genai'],
        algorithms: ['kmeans', 'hierarchical', 'dbscan', 'gaussian']
      });
    }
  };

  const loadAnalysisHistory = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/clustering/history?limit=10`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setAnalysisHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      // Don't show error for history - it's not critical
    }
  };

  const performClustering = async (formData) => {
    try {
      console.log('Making API call to:', `${apiUrl}/api/clustering/analyze`);

      const response = await axios.post(`${apiUrl}/api/clustering/analyze`, {
        query: formData.query,
        platform: formData.platform,
        model: formData.model,
        algorithm: formData.algorithm,
        clusters: parseInt(formData.clusters),
        features: formData.features
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      
      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      return data;
    } catch (error) {
      console.error('API call failed:', error);
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something else happened
        throw error;
      }
    }
  };

  const loadPreviousAnalysis = async (analysisId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/api/clustering/analysis/${analysisId}`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        const data = response.data;
        // Transform the stored data to match expected format
        console.log('Loaded previous analysis:', data);
        setShowHistory(false);
        // You might need to reconstruct the clustering results from stored data
        // setClusterData(transformedData);
        // setAnalysisComplete(true);
      }
    } catch (error) {
      console.error('Failed to load previous analysis:', error);
      setError('Failed to load previous analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setAnalysisComplete(false);
      setError(null);

      const result = await performClustering(formData);
      setClusterData(result);
      setAnalysisComplete(true);
      
      // Reload history to include new analysis
      await loadAnalysisHistory();
    } catch (error) {
      console.error('Clustering analysis failed:', error);
      setError(error.message || 'An error occurred during clustering analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value, decimals = 2) => {
    if (value == null || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  };

  const getPersonaIcon = (personaName) => {
    switch (personaName) {
      case 'Brand Advocates': return <Award className="w-5 h-5 text-yellow-400" />;
      case 'Concerned Critics': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Casual Supporters': return <Coffee className="w-5 h-5 text-blue-400" />;
      case 'Passive Observers': return <Eye className="w-5 h-5 text-gray-400" />;
      case 'Information Seekers': return <Search className="w-5 h-5 text-purple-400" />;
      case 'Mixed Community': return <Users className="w-5 h-5 text-green-400" />;
      default: return <Users className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'positive': return 'text-green-400 bg-green-500/10 border-green-400/30';
      case 'negative': return 'text-red-400 bg-red-500/10 border-red-400/30';
      case 'mild_positive': return 'text-blue-400 bg-blue-500/10 border-blue-400/30';
      case 'mild_negative': return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-400/30';
    }
  };

  const getPlatformInfo = (platform) => {
    const platformMap = {
      reddit: { label: "Reddit", desc: "Discussion communities", icon: "R", color: "bg-orange-500" },
      twitter: { label: "Twitter/X", desc: "Social media posts", icon: "X", color: "bg-blue-500" },
      gnews: { label: "Google News", desc: "News articles", icon: "N", color: "bg-red-500" }
    };
    return platformMap[platform] || { label: platform, desc: "Data source", icon: platform[0]?.toUpperCase() || "?", color: "bg-gray-500" };
  };

  const getModelInfo = (model) => {
    const modelMap = {
      vader: { label: "Fast Analysis", desc: "Quick results, good accuracy" },
      textblob: { label: "Standard Analysis", desc: "Balanced speed and depth" },
      genai: { label: "Deep Analysis", desc: "AI-powered, most detailed" }
    };
    return modelMap[model] || { label: model, desc: "Analysis model" };
  };

  const getAlgorithmInfo = (algorithm) => {
    const algorithmMap = {
      kmeans: { label: "K-Means", desc: "Best for distinct groups" },
      hierarchical: { label: "Hierarchical", desc: "Shows group relationships" },
      dbscan: { label: "DBSCAN", desc: "Finds natural clusters" },
      gaussian: { label: "Gaussian", desc: "Probability-based" }
    };
    return algorithmMap[algorithm] || { label: algorithm, desc: "Clustering method" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-purple-400/30 shadow-xl max-w-xs">
          <p className="text-white font-semibold">{data.persona || `Cluster ${(data.cluster || 0) + 1}`}</p>
          <p className="text-gray-300">Sentiment: {formatNumber(data.sentiment)}</p>
          <p className="text-gray-300">Engagement: {formatNumber(data.engagement, 1)}</p>
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {data.content ? data.content.substring(0, 100) + '...' : 'No content available'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              {analysisHistory.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-400/30 rounded-xl text-white transition-all duration-200"
                >
                  <History className="w-4 h-4" />
                  History ({analysisHistory.length})
                </button>
              )}
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                AI-Powered Audience Intelligence
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Discover hidden audience segments, understand their motivations, and get actionable insights for better engagement strategies.
              </p>
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Previous Analyses
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {analysisHistory.map((analysis, index) => (
                <div key={analysis._id || index} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{analysis.searchQuery}</p>
                    <p className="text-sm text-gray-400">
                      {analysis.platform} • {analysis.model} • {analysis.totalPosts} posts
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => loadPreviousAnalysis(analysis._id)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-600/20 to-red-600/20 border border-red-400/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Analysis Error</h3>
                <p className="text-sm sm:text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
            <div className="space-y-6">
              {/* Main Query Input */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-white mb-4">
                  What topic would you like to analyze?
                </label>
                <div className="max-w-md mx-auto">
                  <input
                    {...register("query", { required: true })}
                    placeholder="e.g., iPhone 15, Tesla Model 3, Climate Change"
                    className="w-full px-6 py-4 bg-slate-700/50 border-2 border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg text-center"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Enter any topic, brand, product, or keyword
                  </p>
                </div>
              </div>

              {/* Quick Setup Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Data Source
                  </label>
                  <div className="space-y-2">
                    {availableOptions.platforms.map((platform) => {
                      const platformInfo = getPlatformInfo(platform);
                      return (
                        <label key={platform} className="relative cursor-pointer block">
                          <input
                            {...register("platform", { required: true })}
                            type="radio"
                            value={platform}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700 flex items-center gap-3">
                            <div className={`w-6 h-6 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                              {platformInfo.icon}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{platformInfo.label}</span>
                              <span className="text-xs text-gray-400 peer-checked:text-gray-200">{platformInfo.desc}</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Number of Segments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Audience Segments
                  </label>
                  <select
                    {...register("clusters", { required: true })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="3">3 segments (Simple)</option>
                    <option value="4">4 segments (Balanced)</option>
                    <option value="5">5 segments (Detailed)</option>
                    <option value="6">6 segments (Comprehensive)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">More segments = deeper insights</p>
                </div>

                {/* Analysis Depth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Analysis Depth
                  </label>
                  <div className="space-y-2">
                    {availableOptions.models.map((model) => {
                      const modelInfo = getModelInfo(model);
                      return (
                        <label key={model} className="relative cursor-pointer block">
                          <input
                            {...register("model", { required: true })}
                            type="radio"
                            value={model}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-2 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{modelInfo.label}</span>
                            <span className="text-xs text-gray-400 peer-checked:text-gray-200">{modelInfo.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              {!showAdvanced && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(true)}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    <Settings className="w-4 h-4" />
                    Advanced Configuration
                  </button>
                </div>
              )}

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="bg-slate-700/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Advanced Settings</h3>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(false)}
                      className="text-gray-400 hover:text-gray-300"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Analysis Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Features to Analyze</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "sentiment", label: "Sentiment Analysis", desc: "How people feel" },
                        { value: "engagement", label: "Engagement Patterns", desc: "Interaction levels" },
                        { value: "content", label: "Content Analysis", desc: "Writing style & topics" },
                        { value: "temporal", label: "Time Patterns", desc: "When people post" },
                        { value: "keywords", label: "Topic Keywords", desc: "Key themes" },
                        { value: "user", label: "User Behavior", desc: "Posting habits" }
                      ].map((feature) => (
                        <label key={feature.value} className="flex items-start gap-2 cursor-pointer p-2 hover:bg-slate-600/30 rounded">
                          <input
                            {...register("features")}
                            type="checkbox"
                            value={feature.value}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-purple-400/30 rounded focus:ring-purple-500 focus:ring-2 mt-0.5"
                          />
                          <div>
                            <span className="text-sm text-gray-300 font-medium">{feature.label}</span>
                            <p className="text-xs text-gray-400">{feature.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Algorithm Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Clustering Algorithm</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableOptions.algorithms.map((algorithm) => {
                        const algorithmInfo = getAlgorithmInfo(algorithm);
                        return (
                          <label key={algorithm} className="relative cursor-pointer">
                            <input
                              {...register("algorithm", { required: true })}
                              type="radio"
                              value={algorithm}
                              className="sr-only peer"
                            />
                            <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                              <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{algorithmInfo.label}</span>
                              <span className="text-xs text-gray-400 peer-checked:text-gray-200">{algorithmInfo.desc}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing Audience...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Discover Your Audience
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 mt-3">Analysis takes 30-90 seconds</p>
            </div>
          </div>
        </form>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Audience...</h3>
            <p className="text-gray-300 mb-4">We're collecting data and identifying audience segments</p>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Collecting posts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                <span>Analyzing sentiment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
                <span>Finding patterns</span>
              </div>
            </div>
          </div>
        )}

        {/* Results - Keep the existing results rendering code */}
        {analysisComplete && clusterData && (
          <div className="space-y-8">
            {/* Success Header with Key Stats */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Analysis Complete!</h2>
                <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-sm">
                  {clusterData.totalPoints} posts analyzed
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-blue-300 font-semibold">Audience Segments</p>
                  <p className="text-2xl font-bold text-white">{clusterData.numClusters}</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="text-purple-300 font-semibold">Overall Sentiment</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(clusterData.insights?.overallInsights?.[0]?.metric || 0)}</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <p className="text-yellow-300 font-semibold">Cluster Quality</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(clusterData.silhouetteScore)}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3">
                  <p className="text-green-300 font-semibold">Actionable Insights</p>
                  <p className="text-2xl font-bold text-white">{clusterData.insights?.actionableRecommendations?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
              <div className="flex flex-wrap gap-1 p-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'segments', label: 'Audience Segments', icon: Users },
                  { id: 'insights', label: 'Key Insights', icon: Lightbulb },
                  { id: 'recommendations', label: 'Action Plan', icon: Target },
                  { id: 'visualization', label: 'Data Visualization', icon: BarChart3 }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Overall Insights */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-400" />
                    Overall Analysis
                  </h3>
                  <div className="space-y-4">
                    {clusterData.insights?.overallInsights?.map((insight, index) => (
                      <div key={index} className={`rounded-lg p-4 border ${getSeverityColor(insight.severity)}`}>
                        <h4 className="font-semibold mb-2">{insight.title}</h4>
                        <p className="text-sm opacity-90">{insight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-5 h-5 text-red-400" />
                      <h4 className="font-semibold text-white">Most Positive Segment</h4>
                    </div>
                    {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 && (
                      <div>
                        <p className="text-lg font-bold text-green-400">
                          {clusterData.clusterSummaries.reduce((max, cluster) => 
                            cluster.avgSentiment > max.avgSentiment ? cluster : max
                          ).name}
                        </p>
                        <p className="text-sm text-gray-300">
                          {clusterData.clusterSummaries.reduce((max, cluster) => 
                            cluster.avgSentiment > max.avgSentiment ? cluster : max
                          ).percentage}% of your audience
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <h4 className="font-semibold text-white">Most Engaged Segment</h4>
                    </div>
                    {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 && (
                      <div>
                        <p className="text-lg font-bold text-blue-400">
                          {clusterData.clusterSummaries.reduce((max, cluster) => 
                            cluster.avgEngagement > max.avgEngagement ? cluster : max
                          ).name}
                        </p>
                        <p className="text-sm text-gray-300">
                          {formatNumber(clusterData.clusterSummaries.reduce((max, cluster) => 
                            cluster.avgEngagement > max.avgEngagement ? cluster : max
                          ).avgEngagement, 1)} avg engagement
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <h4 className="font-semibold text-white">Priority Segment</h4>
                    </div>
                    {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 && (
                      <div>
                        <p className="text-lg font-bold text-purple-400">
                          {clusterData.clusterSummaries[0].name}
                        </p>
                        <p className="text-sm text-gray-300">
                          Highest potential impact
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'segments' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  Audience Segments
                </h3>
                <div className="space-y-6">
                  {clusterData.clusterSummaries?.map((cluster, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getPersonaIcon(cluster.name)}
                          <div>
                            <h4 className="text-xl font-bold text-white">{cluster.name}</h4>
                            <p className="text-gray-300">{cluster.percentage}% of your audience ({cluster.size} posts)</p>
                          </div>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: cluster.color }}
                        ></div>
                      </div>

                      <p className="text-gray-300 mb-4">{cluster.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-500/10 rounded p-3">
                          <p className="text-blue-300 text-sm">Sentiment</p>
                          <p className="text-white font-bold">{formatNumber(cluster.avgSentiment)}/1.0</p>
                        </div>
                        <div className="bg-green-500/10 rounded p-3">
                          <p className="text-green-300 text-sm">Engagement</p>
                          <p className="text-white font-bold">{cluster.characteristics?.engagementLevel || 'Medium'}</p>
                        </div>
                        <div className="bg-yellow-500/10 rounded p-3">
                          <p className="text-yellow-300 text-sm">Questions</p>
                          <p className="text-white font-bold">{cluster.characteristics?.questionRate || '0'}%</p>
                        </div>
                        <div className="bg-purple-500/10 rounded p-3">
                          <p className="text-purple-300 text-sm">Avg Words</p>
                          <p className="text-white font-bold">{cluster.avgWordCount || 0}</p>
                        </div>
                      </div>

                      {cluster.keywords && cluster.keywords.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-300 mb-2">Key Topics:</p>
                          <div className="flex flex-wrap gap-2">
                            {cluster.keywords.map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-700 rounded-full text-xs text-gray-300">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-600 pt-4">
                        <p className="text-sm font-semibold text-gray-300 mb-2">Marketing Profile:</p>
                        <p className="text-sm text-gray-400 mb-3">{cluster.marketingProfile || 'General audience segment'}</p>
                        
                        <p className="text-sm font-semibold text-gray-300 mb-2">Recommended Actions:</p>
                        <div className="space-y-1">
                          {cluster.recommendedActions?.length > 0 ? cluster.recommendedActions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                              <ArrowRight className="w-3 h-3" />
                              <span>{action}</span>
                            </div>
                          )) : (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <ArrowRight className="w-3 h-3" />
                              <span>Monitor this segment for engagement opportunities</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                  Key Insights & Opportunities
                </h3>
                <div className="space-y-6">
                  {/* Marketing Opportunities */}
                  {clusterData.insights?.marketingOpportunities && clusterData.insights.marketingOpportunities.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Marketing Opportunities
                      </h4>
                      <div className="space-y-3">
                        {clusterData.insights.marketingOpportunities.map((opportunity, index) => (
                          <div key={index} className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                            <h5 className="font-semibold text-green-300 mb-2">{opportunity.title}</h5>
                            <p className="text-sm text-gray-300">{opportunity.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        Marketing Opportunities
                      </h4>
                      <p className="text-sm text-gray-300">
                        Focus on the most engaged segments for maximum ROI. Consider targeted campaigns for each audience persona.
                      </p>
                    </div>
                  )}

                  {/* Risk Factors */}
                  {clusterData.insights?.riskFactors && clusterData.insights.riskFactors.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-400" />
                        Risk Factors & Challenges
                      </h4>
                      <div className="space-y-3">
                        {clusterData.insights.riskFactors.map((risk, index) => (
                          <div key={index} className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                            <h5 className="font-semibold text-red-300 mb-2">{risk.title}</h5>
                            <p className="text-sm text-gray-300 mb-2">{risk.description}</p>
                            <p className="text-xs text-red-400">Impact Level: {risk.severity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-400" />
                        Risk Factors & Challenges
                      </h4>
                      <p className="text-sm text-gray-300">
                        Monitor negative sentiment segments closely. Address concerns proactively to prevent reputation issues.
                      </p>
                    </div>
                  )}

                  {/* Cluster-Specific Insights */}
                  {clusterData.insights?.clusterSpecificInsights && clusterData.insights.clusterSpecificInsights.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-400" />
                        Segment-Specific Insights
                      </h4>
                      <div className="space-y-3">
                        {clusterData.insights.clusterSpecificInsights.map((insight, index) => (
                          <div key={index} className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                            <h5 className="font-semibold text-purple-300 mb-2">{insight.title}</h5>
                            <p className="text-sm text-gray-300">{insight.description}</p>
                            {insight.actionItems && (
                              <div className="mt-2">
                                <p className="text-xs text-purple-400 mb-1">Action Items:</p>
                                <ul className="text-xs text-gray-400">
                                  {insight.actionItems.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-1">
                                      <ArrowRight className="w-3 h-3" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-400" />
                  Actionable Recommendations
                </h3>
                <div className="space-y-6">
                  {clusterData.insights?.actionableRecommendations && clusterData.insights.actionableRecommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {clusterData.insights.actionableRecommendations.map((rec, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-600/10 to-blue-600/10 border border-green-400/30 rounded-lg p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </div>
                            <h4 className="font-semibold text-white">{rec.title || `Recommendation ${index + 1}`}</h4>
                          </div>
                          <p className="text-gray-300 mb-3">{rec.description || rec}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                              {rec.priority || 'Medium'} Priority
                            </span>
                            <span className="text-xs text-gray-400">
                              Est. Impact: {rec.impact || 'Medium'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-green-600/10 to-blue-600/10 border border-green-400/30 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          </div>
                          <h4 className="font-semibold text-white">Engage Top Performers</h4>
                        </div>
                        <p className="text-gray-300 mb-3">Focus on your most positive and engaged audience segments for maximum impact</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">High Priority</span>
                          <span className="text-xs text-gray-400">Est. Impact: High</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border border-yellow-400/30 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          </div>
                          <h4 className="font-semibold text-white">Address Concerns</h4>
                        </div>
                        <p className="text-gray-300 mb-3">Proactively address negative sentiment segments to improve overall perception</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Medium Priority</span>
                          <span className="text-xs text-gray-400">Est. Impact: Medium</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Implementation Timeline */}
                  <div className="bg-slate-700/30 rounded-lg p-5">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Implementation Timeline
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                          <span className="text-red-300 text-sm font-bold">1</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Immediate (This Week)</p>
                          <p className="text-sm text-gray-400">Address negative sentiment in concerned segments</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <span className="text-yellow-300 text-sm font-bold">2</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Short-term (Next Month)</p>
                          <p className="text-sm text-gray-400">Engage with brand advocates and optimize content</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                          <span className="text-green-300 text-sm font-bold">3</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Long-term (Next Quarter)</p>
                          <p className="text-sm text-gray-400">Build comprehensive engagement strategies for each segment</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visualization' && (
              <div className="space-y-6">
                {/* Main Scatter Plot */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                    Audience Segment Visualization
                  </h3>
                  <div className="h-96 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={clusterData.dataPoints}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="sentiment" 
                          stroke="#9CA3AF"
                          label={{ value: 'Sentiment Score', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
                          domain={[-1, 1]}
                        />
                        <YAxis 
                          dataKey="engagement" 
                          stroke="#9CA3AF"
                          label={{ value: 'Engagement Level', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter dataKey="engagement" fill="#8b5cf6">
                          {clusterData.dataPoints?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#8b5cf6'} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {clusterData.clusterSummaries?.map((cluster, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cluster.color }}
                        ></div>
                        <span className="text-sm text-gray-300">{cluster.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segment Size Distribution */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                  <h3 className="text-xl font-bold text-white mb-6">Segment Size Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clusterData.clusterSummaries?.map(cluster => ({
                            name: cluster.name,
                            value: cluster.size,
                            fill: cluster.color
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sentiment vs Engagement Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <h4 className="text-lg font-bold text-white mb-4">Average Sentiment by Segment</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clusterData.clusterSummaries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Bar dataKey="avgSentiment" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
                    <h4 className="text-lg font-bold text-white mb-4">Average Engagement by Segment</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clusterData.clusterSummaries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Bar dataKey="avgEngagement" fill="#06b6d4" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Metrics Footer */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-400" />
                Analysis Quality Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {formatNumber(clusterData.silhouetteScore)}
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Silhouette Score</p>
                  <p className="text-xs text-gray-400">
                    {clusterData.silhouetteScore > 0.5 ? 'Excellent' : 
                     clusterData.silhouetteScore > 0.3 ? 'Good' : 'Fair'} cluster separation
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {formatNumber(clusterData.inertia, 0)}
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Inertia</p>
                  <p className="text-xs text-gray-400">Lower is better</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {formatNumber(clusterData.clusterCoherence || 0.75)}
                  </div>
                  <p className="text-sm text-gray-300 mb-1">Coherence</p>
                  <p className="text-xs text-gray-400">Topic consistency</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedClusteringPage;