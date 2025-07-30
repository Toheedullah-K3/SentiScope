import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Line
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
  Star
} from 'lucide-react';

const ClusteringPage = () => {
  // Using environment variable or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      query: '',
      platform: 'reddit',
      model: 'vader',
      algorithm: 'kmeans',
      clusters: 5,
      features: ['sentiment', 'engagement']
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [clusterData, setClusterData] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(true);

  const watchedAlgorithm = watch('algorithm');
  const watchedClusters = watch('clusters');

  // API call to your backend
  const performClustering = async (formData) => {
    try {
      console.log('Making API call to:', `${apiUrl}/api/clustering`);

      const response = await fetch(`${apiUrl}/api/clustering`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: formData.query,
          platform: formData.platform,
          model: formData.model,
          algorithm: formData.algorithm,
          clusters: parseInt(formData.clusters),
          features: formData.features
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setAnalysisComplete(false);
      setError(null);
      setShowExplanation(false);

      const result = await performClustering(formData);

      // Process the API response to match the expected format
      const processedData = processApiResponse(result);

      setClusterData(processedData);
      setRawData(processedData.dataPoints || []);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Clustering analysis failed:', error);
      setError(error.message || 'An error occurred during clustering analysis');
    } finally {
      setIsLoading(false);
    }
  };

  // Process API response to match the expected frontend format
  const processApiResponse = (apiData) => {
    // Ensure apiData exists and has expected structure
    if (!apiData) {
      console.warn('API data is null or undefined');
      return getDefaultClusterData();
    }

    // Define colors for clusters
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    // Process data points with cluster colors - with safety checks
    const dataPoints = Array.isArray(apiData.dataPoints) 
      ? apiData.dataPoints.map((point, index) => ({
          ...point,
          color: colors[(point.cluster || 0) % colors.length]
        })) 
      : [];

    // Process cluster summaries with default values - with safety checks
    const clusterSummaries = Array.isArray(apiData.clusterSummaries) 
      ? apiData.clusterSummaries.map((cluster, index) => ({
          ...cluster,
          color: colors[index % colors.length],
          description: cluster.description || getClusterDescription(cluster.avgSentiment || 0, cluster.avgEngagement || 0),
          // Ensure these properties exist with defaults
          averageSentiment: cluster.averageSentiment ?? cluster.avgSentiment ?? 0,
          averageEngagement: cluster.averageEngagement ?? cluster.avgEngagement ?? 0,
          averageToxicity: cluster.averageToxicity ?? cluster.avgToxicity ?? 0,
          numPosts: cluster.numPosts ?? cluster.size ?? 0
        }))
      : [];

    // Generate cluster insights based on the summaries
    const clusterInsights = clusterSummaries.map((cluster, index) => {
      const insight = getInsightFromCluster(cluster);
      return {
        title: `Cluster ${index + 1}: ${insight.title}`,
        description: insight.insight,
        type: insight.type,
        icon: insight.icon
      };
    });

    // Calculate averages safely with better fallbacks
    const safeAvg = (arr, key) => {
      if (!Array.isArray(arr) || arr.length === 0) return 0;
      const validValues = arr.filter(item => item && item[key] != null);
      return validValues.length > 0
        ? validValues.reduce((sum, item) => sum + item[key], 0) / validValues.length
        : 0;
    };

    const averageSentiment = safeAvg(clusterSummaries, "averageSentiment");
    const averageEngagement = safeAvg(clusterSummaries, "averageEngagement");
    const averageToxicity = safeAvg(clusterSummaries, "averageToxicity");

    return {
      algorithm: apiData.algorithm || 'kmeans',
      totalPoints: apiData.totalPoints || dataPoints.length,
      numClusters: apiData.numClusters || clusterSummaries.length,
      dataPoints: dataPoints,
      clusterSummaries: clusterSummaries,
      clusterInsights: clusterInsights, // Added this missing property
      silhouetteScore: apiData.silhouetteScore || 0,
      inertia: apiData.inertia || 0,
      averageSentiment,
      averageEngagement,
      averageToxicity
    };
  };

  // Helper function to return default cluster data structure
  const getDefaultClusterData = () => {
    return {
      algorithm: 'kmeans',
      totalPoints: 0,
      numClusters: 0,
      dataPoints: [],
      clusterSummaries: [],
      clusterInsights: [],
      silhouetteScore: 0,
      inertia: 0,
      averageSentiment: 0,
      averageEngagement: 0,
      averageToxicity: 0
    };
  };

  const getClusterDescription = (sentiment, engagement) => {
    if (sentiment > 0.3 && engagement > 50) return "Highly Positive & Engaged";
    if (sentiment > 0.3 && engagement <= 50) return "Positive but Low Engagement";
    if (sentiment < -0.3 && engagement > 50) return "Negative but Engaged";
    if (sentiment < -0.3 && engagement <= 50) return "Negative & Low Engagement";
    return "Neutral Sentiment";
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "reddit": return <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>;
      case "twitter": return <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">T</div>;
      case "gnews": return <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">N</div>;
      default: return <Globe className="w-5 h-5 text-gray-400" />;
    }
  };

  const getModelIcon = (model) => {
    switch (model) {
      case "vader": return <Brain className="w-5 h-5 text-purple-400" />;
      case "textblob": return <BarChart3 className="w-5 h-5 text-cyan-400" />;
      case "genai": return <Sparkles className="w-5 h-5 text-pink-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatNumber = (value, decimals = 2) => {
    if (value == null || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  };

  const getInsightFromCluster = (cluster) => {
    const sentiment = cluster.avgSentiment || cluster.averageSentiment || 0;
    const engagement = cluster.avgEngagement || cluster.averageEngagement || 0;

    if (sentiment > 0.5 && engagement > 70) {
      return {
        type: "success",
        icon: Heart,
        title: "Brand Champions",
        insight: "This group loves your topic! They're highly engaged and spread positive vibes. Focus marketing efforts here."
      };
    } else if (sentiment < -0.3 && engagement > 60) {
      return {
        type: "warning",
        icon: TrendingDown,
        title: "Vocal Critics",
        insight: "Active but unhappy users. Address their concerns quickly - they influence others significantly."
      };
    } else if (sentiment > 0.2 && engagement < 30) {
      return {
        type: "info",
        icon: Users,
        title: "Silent Supporters",
        insight: "They like your content but don't engage much. Try interactive content to boost participation."
      };
    } else if (engagement < 20) {
      return {
        type: "neutral",
        icon: MessageSquare,
        title: "Passive Observers",
        insight: "Low engagement group. Consider what content formats might better capture their attention."
      };
    } else {
      return {
        type: "info",
        icon: Target,
        title: "Mixed Signals",
        insight: "Moderate sentiment and engagement. Good testing ground for new content strategies."
      };
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-purple-400/30 shadow-xl">
          <p className="text-white font-semibold">{`Cluster ${(data.cluster || 0) + 1}`}</p>
          <p className="text-gray-300">{`Sentiment: ${data.sentiment?.toFixed(2) || 'N/A'}`}</p>
          <p className="text-gray-300">{`Engagement: ${data.engagement?.toFixed(1) || 'N/A'}`}</p>
          <p className="text-gray-400 text-sm mt-1">{data.content || 'No content available'}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        {/* Header with Better Explanation */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Smart Content Grouping
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Discover hidden patterns in social media conversations. See how people really feel about your topic and identify different audience segments automatically.
              </p>
            </div>
          </div>
        </div>

        {/* What You'll Discover Section */}
        {showExplanation && (
          <div className="mb-8 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">What You'll Discover</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Audience Segments</h3>
                  <p className="text-sm text-gray-300">Find different groups of people talking about your topic - supporters, critics, casual observers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Sentiment Patterns</h3>
                  <p className="text-sm text-gray-300">See which groups are positive, negative, or neutral about your topic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Actionable Insights</h3>
                  <p className="text-sm text-gray-300">Get specific recommendations for each audience group</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        {showExplanation && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">1. Search</h3>
                <p className="text-sm text-gray-300">We collect posts about your topic from social media</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">2. Analyze</h3>
                <p className="text-sm text-gray-300">AI reads the sentiment and engagement of each post</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">3. Group</h3>
                <p className="text-sm text-gray-300">Similar posts are automatically grouped together</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">4. Insights</h3>
                <p className="text-sm text-gray-300">Get actionable insights for each audience group</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-600/20 to-red-600/20 border border-red-400/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Error</h3>
                <p className="text-sm sm:text-gray-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Simplified Configuration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
            <div className="space-y-6">
              {/* Main Query Input */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-white mb-4">What topic do you want to analyze?</label>
                <div className="max-w-md mx-auto">
                  <input
                    {...register("query", { required: true })}
                    placeholder="e.g., iPhone 15, Tesla, Climate Change, Bitcoin"
                    className="w-full px-6 py-4 bg-slate-700/50 border-2 border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg text-center"
                  />
                  <p className="text-sm text-gray-400 mt-2">Enter any topic, brand, or keyword you want to understand better</p>
                </div>
              </div>

              {/* Quick Setup Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Where to look?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "reddit", label: "Reddit", desc: "Discussion forums", icon: "R", color: "orange" },
                      { value: "twitter", label: "Twitter", desc: "Social media", icon: "T", color: "blue" },
                      { value: "gnews", label: "News", desc: "News articles", icon: "N", color: "red" }
                    ].map((platform) => (
                      <label key={platform.value} className="relative cursor-pointer block">
                        <input
                          {...register("platform", { required: true })}
                          type="radio"
                          value={platform.value}
                          className="sr-only peer"
                        />
                        <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700 flex items-center gap-3">
                          <div className={`w-6 h-6 bg-${platform.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                            {platform.icon}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{platform.label}</span>
                            <span className="text-xs text-gray-400 peer-checked:text-gray-200">{platform.desc}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Number of Groups */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    How many groups?
                  </label>
                  <select
                    {...register("clusters", { required: true })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  >
                    <option value="3">3 groups (Simple)</option>
                    <option value="4">4 groups (Balanced)</option>
                    <option value="5">5 groups (Detailed)</option>
                    <option value="6">6 groups (Advanced)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">More groups = more detailed insights</p>
                </div>

                {/* Analysis Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Analysis style?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "vader", label: "Quick & Accurate", desc: "Fast results" },
                      { value: "textblob", label: "Simple Analysis", desc: "Easy to understand" },
                      { value: "genai", label: "AI-Powered", desc: "Most detailed" }
                    ].map((model) => (
                      <label key={model.value} className="relative cursor-pointer block">
                        <input
                          {...register("model", { required: true })}
                          type="radio"
                          value={model.value}
                          className="sr-only peer"
                        />
                        <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-2 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                          <div>
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{model.label}</span>
                            <span className="text-xs text-gray-400 peer-checked:text-gray-200">{model.desc}</span>
                          </div>
                        </div>
                      </label>
                    ))}
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
                    Show Advanced Options
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

                  {/* Algorithm Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Clustering Method</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "kmeans", label: "K-Means", desc: "Best for clear groups" },
                        { value: "hierarchical", label: "Hierarchical", desc: "Shows relationships" },
                        { value: "dbscan", label: "DBSCAN", desc: "Finds any shape" },
                        { value: "gaussian", label: "Gaussian", desc: "Probability-based" }
                      ].map((algorithm) => (
                        <label key={algorithm.value} className="relative cursor-pointer">
                          <input
                            {...register("algorithm", { required: true })}
                            type="radio"
                            value={algorithm.value}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{algorithm.label}</span>
                            <span className="text-xs text-gray-400 peer-checked:text-gray-200">{algorithm.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Features to Include */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">What to analyze?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { value: "sentiment", label: "How people feel" },
                        { value: "engagement", label: "How much interaction" },
                        { value: "length", label: "Post length" },
                        { value: "keywords", label: "Key topics" },
                        { value: "temporal", label: "Time patterns" },
                        { value: "user", label: "User behavior" }
                      ].map((feature) => (
                        <label key={feature.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            {...register("features")}
                            type="checkbox"
                            value={feature.value}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-purple-400/30 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-300">{feature.label}</span>
                        </label>
                      ))}
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
                    Analyzing Your Topic...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Discover Hidden Patterns
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-400 mt-3">This usually takes 30-60 seconds</p>
            </div>
          </div>
        </form>

        {/* Loading State with Better UX */}
        {isLoading && (
          <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Topic...</h3>
            <p className="text-gray-300 mb-4">We're collecting and analyzing social media posts about your topic</p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Collecting posts</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <span>Analyzing sentiment</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>Creating groups</span>
            </div>
          </div>
        )}

        {/* Results with Better Explanations */}
        {analysisComplete && clusterData && (
          <div className="space-y-8">
            {/* Success Message with Key Insights */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Analysis Complete!</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-blue-300 font-semibold">Average Sentiment</p>
                  <p className="text-gray-300">{formatNumber(clusterData.averageSentiment)} out of 5</p>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3">
                  <p className="text-yellow-300 font-semibold">Average Engagement</p>
                  <p className="text-gray-300">{formatNumber(clusterData.averageEngagement, 1)} interactions per post</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <p className="text-red-300 font-semibold">Average Toxicity</p>
                  <p className="text-gray-300">{formatNumber(clusterData.averageToxicity)} out of 5</p>
                </div>
                <div className="bg-gray-500/10 rounded-lg p-3">
                  <p className="text-gray-300 font-semibold">Quality Score</p>
                  <p className="text-gray-300">{formatNumber(clusterData.silhouetteScore)}</p>
                </div>
              </div>
            </div>

            {/* Cluster Summaries with Safety Checks */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-400" />
                Audience Groups Found
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
                  clusterData.clusterSummaries.map((cluster, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: cluster.color || '#8b5cf6' }}
                        ></div>
                        <h4 className="text-lg font-semibold text-white">Group {index + 1}</h4>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          <span className="text-purple-400 font-medium">Posts:</span> {cluster.numPosts || 0}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-purple-400 font-medium">Sentiment:</span> {formatNumber(cluster.averageSentiment)} out of 5
                        </p>
                        <p className="text-gray-300">
                          <span className="text-purple-400 font-medium">Engagement:</span> {formatNumber(cluster.averageEngagement, 1)} per post
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          {cluster.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No cluster summaries available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cluster Insights with Safety Checks */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                Actionable Insights
              </h3>
              <div className="space-y-4">
                {clusterData.clusterInsights && clusterData.clusterInsights.length > 0 ? (
                  clusterData.clusterInsights.map((insight, index) => {
                    const IconComponent = insight.icon || Info;
                    const bgColor = insight.type === 'success' ? 'bg-green-500/10 border-green-400/30' :
                                   insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-400/30' :
                                   insight.type === 'info' ? 'bg-blue-500/10 border-blue-400/30' :
                                   'bg-gray-500/10 border-gray-400/30';
                    
                    return (
                      <div key={index} className={`${bgColor} rounded-lg p-4 border`}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <IconComponent className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <h5 className="text-md font-semibold text-white mb-2">
                              {insight.title || `Insight ${index + 1}`}
                            </h5>
                            <p className="text-gray-300 text-sm">
                              {insight.description || "No description available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No insights available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cluster Data Visualization */}
            {clusterData.dataPoints && clusterData.dataPoints.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  Data Visualization
                </h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={clusterData.dataPoints}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="sentiment" 
                        stroke="#9CA3AF"
                        label={{ value: 'Sentiment', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
                      />
                      <YAxis 
                        dataKey="engagement" 
                        stroke="#9CA3AF"
                        label={{ value: 'Engagement', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Scatter dataKey="engagement" fill="#8b5cf6">
                        {clusterData.dataPoints.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#8b5cf6'} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Cluster Data Table with Safety Checks */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-400" />
                Detailed Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Group</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Posts</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Avg Sentiment</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Avg Engagement</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
                      clusterData.clusterSummaries.map((cluster, index) => (
                        <tr key={index} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: cluster.color || '#8b5cf6' }}
                              ></div>
                              Group {index + 1}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">{cluster.numPosts || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {formatNumber(cluster.averageSentiment)} / 5
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            {formatNumber(cluster.averageEngagement, 1)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {cluster.description || "No description"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ClusteringPage;