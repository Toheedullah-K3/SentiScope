import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Brain,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  History,
  Lock,
  Unlock,
  Info,
  ArrowRight
} from 'lucide-react';

import {ClusteringForm, ClusteringResults} from '@/components';


const ClusteringPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      query: '',
      platform: 'reddit',
      model: 'vader',
      algorithm: 'kmeans',
      clusters: 5,
      features: ['sentiment', 'engagement', 'content', 'temporal']
    }
  });

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [clusterData, setClusterData] = useState(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [error, setError] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({
    platforms: [],
    models: [],
    algorithms: []
  });
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');

  const authStatus = useSelector((state) => state.auth.status);

  console.log(" I am Here ------------")
  console.log("Auth Status:", authStatus);
  console.log("UserData", useSelector((state) => state.auth.userData));

  // Load available options on component mount
  useEffect(() => {
    loadAvailableOptions();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check if user is authenticated (you might have a token in localStorage)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    setIsAuthenticated(true);
    
    if (token) {
      loadAnalysisHistory();
    }
  };

  const loadAvailableOptions = async () => {
    try {
      setLoadingOptions(true);
      
      const [platformsRes, modelsRes, algorithmsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/clustering/platforms`).catch(() => ({ data: ['reddit', 'twitter', 'gnews'] })),
        axios.get(`${apiUrl}/api/clustering/models`).catch(() => ({ data: ['vader', 'textblob', 'genai'] })),
        axios.get(`${apiUrl}/api/clustering/algorithms`).catch(() => ({ data: ['kmeans', 'hierarchical', 'dbscan', 'gaussian', 'spectral'] }))
      ]);

      setAvailableOptions({
        platforms: platformsRes.data || ['reddit', 'twitter', 'gnews'],
        models: modelsRes.data || ['vader', 'textblob', 'genai'],
        algorithms: algorithmsRes.data || ['kmeans', 'hierarchical', 'dbscan', 'gaussian', 'spectral']
      });
    } catch (error) {
      console.error('Failed to load options:', error);
      // Use fallback defaults
      setAvailableOptions({
        platforms: ['reddit', 'twitter', 'gnews'],
        models: ['vader', 'textblob', 'genai'],
        algorithms: ['kmeans', 'hierarchical', 'dbscan', 'gaussian', 'spectral']
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadAnalysisHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await axios.get(`${apiUrl}/api/clustering/history?limit=10`, {
        withCredentials: true
      });

      if (response.status === 200) {
        setAnalysisHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }
    }
  };

  const performClustering = async (formData) => {
    try {
      setLoadingStage('Initializing analysis...');
      setLoadingProgress(10);

      const response = await axios.post(
        `${apiUrl}/api/clustering/analyze`,
        {
          query: formData.query,
          platform: formData.platform,
          model: formData.model,
          algorithm: formData.algorithm,
          clusters: parseInt(formData.clusters),
          features: formData.features
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setLoadingProgress(100);
      setLoadingStage('Analysis complete!');

      if (!response.data.success) {
        throw new Error(response.data.error || 'Analysis failed');
      }
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      throw error;
    }
  };

  const loadPreviousAnalysis = async (analysisId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiUrl}/api/clustering/analysis/${analysisId}`);
      
      if (response.status === 200) {
        const data = response.data.data;
        console.log('Loaded previous analysis:', data);
        setShowHistory(false);
        
        // Transform stored data to display format if needed
        if (data.request && data.results) {
          // Create a simplified cluster data structure for display
          const transformedData = {
            success: true,
            totalPoints: data.results.length,
            query: data.request.searchQuery,
            platform: data.request.platform,
            model: data.request.model,
            insights: {
              overallInsights: [{
                title: "Previous Analysis",
                description: `Loaded analysis from ${new Date(data.request.createdAt).toLocaleDateString()}`,
                metric: data.request.averageSentimentScore || 0
              }],
              actionableRecommendations: ["Review this historical analysis", "Compare with recent data"]
            },
            clusterSummaries: [{
              id: 0,
              name: "Historical Data",
              size: data.results.length,
              percentage: "100.0",
              avgSentiment: data.request.averageSentimentScore || 0,
              avgEngagement: 50,
              color: '#8b5cf6',
              description: `Historical analysis with ${data.results.length} data points`
            }]
          };
          
          setClusterData(transformedData);
          setAnalysisComplete(true);
        }
      }
    } catch (error) {
      console.error('Failed to load previous analysis:', error);
      setError('Failed to load previous analysis: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setAnalysisComplete(false);
      setError(null);
      setLoadingProgress(0);
      setLoadingStage('Starting analysis...');

      const result = await performClustering(formData);
      setClusterData(result);
      setAnalysisComplete(true);
      
      // Reload history to include new analysis
      if (isAuthenticated) {
        await loadAnalysisHistory();
      }
    } catch (error) {
      console.error('Clustering analysis failed:', error);
      setError(error.message || 'An error occurred during clustering analysis');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingStage('');
    }
  };

  if (loadingOptions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">Loading Configuration...</h3>
          <p className="text-gray-300">Setting up clustering options</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
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
              <div className="flex gap-2">
                {isAuthenticated && analysisHistory.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-400/30 rounded-xl text-white transition-all duration-200"
                  >
                    <History className="w-4 h-4" />
                    History ({analysisHistory.length})
                  </button>
                )}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg">
                  {isAuthenticated ? (
                    <><Unlock className="w-4 h-4 text-green-400" /><span className="text-green-400 text-sm">Authenticated</span></>
                  ) : (
                    <><Lock className="w-4 h-4 text-yellow-400" /><span className="text-yellow-400 text-sm">Guest Mode</span></>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                AI-Powered Audience Intelligence
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
                Discover hidden audience segments, understand their motivations, and get actionable insights for better engagement strategies.
              </p>
              {!isAuthenticated && (
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 max-w-md mx-auto">
                  <p className="text-yellow-300 text-sm">
                    <Info className="w-4 h-4 inline mr-1" />
                    Running in guest mode. Login to save analysis history.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Panel */}
        {showHistory && analysisHistory.length > 0 && (
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
        <ClusteringForm
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          errors={errors}
          onSubmit={onSubmit}
          isLoading={isLoading}
          availableOptions={availableOptions}
          loadingStage={loadingStage}
          loadingProgress={loadingProgress}
        />

        {/* Results Section */}
        {analysisComplete && clusterData && (
          <ClusteringResults
            clusterData={clusterData}
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </div>
  );
};

export default ClusteringPage;