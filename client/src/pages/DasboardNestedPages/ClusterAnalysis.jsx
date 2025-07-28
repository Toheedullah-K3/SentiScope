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
} from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ClusteringPage = () => {
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

  const watchedAlgorithm = watch('algorithm');
  const watchedClusters = watch('clusters');

  // Mock clustering function - replace with actual API call
  const performClustering = async (formData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock data for demonstration
    const mockData = generateMockClusterData(formData);
    return mockData;
  };

  const generateMockClusterData = (formData) => {
    const numClusters = parseInt(formData.clusters);
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    // Generate scattered data points
    const dataPoints = [];
    for (let cluster = 0; cluster < numClusters; cluster++) {
      const centerX = Math.random() * 100;
      const centerY = Math.random() * 100;
      const pointsInCluster = Math.floor(Math.random() * 30) + 10;
      
      for (let i = 0; i < pointsInCluster; i++) {
        dataPoints.push({
          x: centerX + (Math.random() - 0.5) * 20,
          y: centerY + (Math.random() - 0.5) * 20,
          cluster: cluster,
          sentiment: (Math.random() - 0.5) * 2,
          engagement: Math.random() * 100,
          content: `Sample post ${i + 1} in cluster ${cluster}`,
          platform: formData.platform,
          color: colors[cluster % colors.length]
        });
      }
    }

    // Generate cluster summaries
    const clusterSummaries = [];
    for (let i = 0; i < numClusters; i++) {
      const clusterPoints = dataPoints.filter(p => p.cluster === i);
      const avgSentiment = clusterPoints.reduce((sum, p) => sum + p.sentiment, 0) / clusterPoints.length;
      const avgEngagement = clusterPoints.reduce((sum, p) => sum + p.engagement, 0) / clusterPoints.length;
      
      clusterSummaries.push({
        id: i,
        name: `Cluster ${i + 1}`,
        size: clusterPoints.length,
        avgSentiment: avgSentiment,
        avgEngagement: avgEngagement,
        color: colors[i % colors.length],
        keywords: [`keyword${i}_1`, `keyword${i}_2`, `keyword${i}_3`],
        description: getClusterDescription(avgSentiment, avgEngagement)
      });
    }

    return {
      algorithm: formData.algorithm,
      totalPoints: dataPoints.length,
      numClusters: numClusters,
      dataPoints: dataPoints,
      clusterSummaries: clusterSummaries,
      silhouetteScore: 0.65 + Math.random() * 0.3,
      inertia: Math.random() * 1000 + 500
    };
  };

  const getClusterDescription = (sentiment, engagement) => {
    if (sentiment > 0.3 && engagement > 50) return "Highly Positive & Engaged";
    if (sentiment > 0.3 && engagement <= 50) return "Positive but Low Engagement";
    if (sentiment < -0.3 && engagement > 50) return "Negative but Engaged";
    if (sentiment < -0.3 && engagement <= 50) return "Negative & Low Engagement";
    return "Neutral Sentiment";
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setAnalysisComplete(false);
      
      const result = await performClustering(formData);
      setClusterData(result);
      setRawData(result.dataPoints);
      setAnalysisComplete(true);
    } catch (error) {
      console.error('Clustering analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-purple-400/30 shadow-xl">
          <p className="text-white font-semibold">{`Cluster ${data.cluster + 1}`}</p>
          <p className="text-gray-300">{`Sentiment: ${data.sentiment.toFixed(2)}`}</p>
          <p className="text-gray-300">{`Engagement: ${data.engagement.toFixed(1)}`}</p>
          <p className="text-gray-400 text-sm mt-1">{data.content}</p>
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
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Clustering Analysis
              </h1>
              <p className="text-base sm:text-xl text-gray-300 mt-2">
                Discover hidden patterns and group similar content using advanced clustering algorithms
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Search Query</label>
                  <input
                    {...register("query", { required: true })}
                    placeholder="e.g., AI, Bitcoin, Climate Change"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Number of Clusters</label>
                  <input
                    {...register("clusters", { required: true, min: 2, max: 10 })}
                    type="number"
                    min="2"
                    max="10"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "reddit", label: "Reddit", icon: "R", color: "orange" },
                    { value: "twitter", label: "Twitter", icon: "T", color: "blue" },
                    { value: "gnews", label: "GNews", icon: "N", color: "red" }
                  ].map((platform) => (
                    <label key={platform.value} className="relative cursor-pointer">
                      <input
                        {...register("platform", { required: true })}
                        type="radio"
                        value={platform.value}
                        className="sr-only peer"
                      />
                      <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                        <div className={`w-6 h-6 bg-${platform.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-2`}>
                          {platform.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-300 peer-checked:text-white">{platform.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Sentiment Model</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "vader", label: "VADER", icon: Brain, color: "purple" },
                    { value: "textblob", label: "TextBlob", icon: BarChart3, color: "cyan" },
                    { value: "genai", label: "GenAI", icon: Sparkles, color: "pink" }
                  ].map((model) => (
                    <label key={model.value} className="relative cursor-pointer">
                      <input
                        {...register("model", { required: true })}
                        type="radio"
                        value={model.value}
                        className="sr-only peer"
                      />
                      <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                        <model.icon className={`w-5 h-5 text-${model.color}-400 mx-auto mb-2`} />
                        <span className="text-sm font-medium text-gray-300 peer-checked:text-white">{model.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Algorithm Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Clustering Algorithm</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "kmeans", label: "K-Means", icon: Target, desc: "Centroid-based clustering" },
                    { value: "hierarchical", label: "Hierarchical", icon: GitBranch, desc: "Tree-based clustering" },
                    { value: "dbscan", label: "DBSCAN", icon: Layers, desc: "Density-based clustering" },
                    { value: "gaussian", label: "Gaussian Mixture", icon: Cpu, desc: "Probability-based clustering" }
                  ].map((algorithm) => (
                    <label key={algorithm.value} className="relative cursor-pointer">
                      <input
                        {...register("algorithm", { required: true })}
                        type="radio"
                        value={algorithm.value}
                        className="sr-only peer"
                      />
                      <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                        <algorithm.icon className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                        <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{algorithm.label}</span>
                        <span className="text-xs text-gray-400 peer-checked:text-gray-200">{algorithm.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Advanced Options</span>
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="bg-slate-700/30 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Features to Include</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { value: "sentiment", label: "Sentiment Score" },
                        { value: "engagement", label: "Engagement Rate" },
                        { value: "length", label: "Content Length" },
                        { value: "keywords", label: "Keyword Density" },
                        { value: "temporal", label: "Temporal Patterns" },
                        { value: "user", label: "User Behavior" }
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
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 sm:px-12 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing Clusters...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Start Clustering Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {analysisComplete && clusterData && (
          <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Clustering Analysis Complete!</h3>
                  <p className="text-sm sm:text-gray-300">
                    Successfully identified {clusterData.numClusters} distinct clusters from {clusterData.totalPoints} data points.
                  </p>
                </div>
              </div>
            </div>

            {/* Cluster Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Total Clusters</span>
                </div>
                <p className="text-2xl font-bold text-white">{clusterData.numClusters}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <span className="text-gray-300">Data Points</span>
                </div>
                <p className="text-2xl font-bold text-white">{clusterData.totalPoints}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Silhouette Score</span>
                </div>
                <p className="text-2xl font-bold text-white">{clusterData.silhouetteScore.toFixed(3)}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-pink-400" />
                  <span className="text-gray-300">Algorithm</span>
                </div>
                <p className="text-2xl font-bold text-white capitalize">{clusterData.algorithm}</p>
              </div>
            </div>

            {/* Cluster Visualization */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Cluster Visualization</h2>
              </div>
              
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={clusterData.dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="x" 
                      stroke="#9CA3AF"
                      label={{ value: 'Sentiment Score', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                    />
                    <YAxis 
                      dataKey="y" 
                      stroke="#9CA3AF"
                      label={{ value: 'Engagement Rate', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter 
                      dataKey="y" 
                      fill={(entry) => entry.color}
                    >
                      {clusterData.dataPoints.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cluster Details */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Cluster Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clusterData.clusterSummaries.map((cluster) => (
                  <div 
                    key={cluster.id}
                    className="bg-slate-700/50 rounded-xl p-4 border border-purple-400/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedCluster(cluster)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      ></div>
                      <h3 className="text-lg font-bold text-white">{cluster.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Size:</span>
                        <span className="text-white font-semibold">{cluster.size} posts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Avg Sentiment:</span>
                        <span className={`font-semibold ${cluster.avgSentiment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {cluster.avgSentiment.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Engagement:</span>
                        <span className="text-white font-semibold">{cluster.avgEngagement.toFixed(1)}%</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-purple-300">{cluster.description}</p>
                      </div>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {cluster.keywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cluster Distribution Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Cluster Size Distribution</h2>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterData.clusterSummaries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #7c3aed',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="size" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sentiment Distribution by Cluster */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Sentiment Distribution by Cluster</h2>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clusterData.clusterSummaries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #7c3aed',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgSentiment" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Engagement Distribution by Cluster */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Engagement Distribution by Cluster</h2>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clusterData.clusterSummaries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #7c3aed',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgEngagement"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClusteringPage;
