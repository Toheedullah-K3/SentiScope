import React, { useState } from 'react';
import {
  Globe,
  Target,
  Brain,
  Settings,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Users,
  TrendingUp,
  MessageSquare,
  Clock
} from 'lucide-react';

const ClusteringForm = ({
  register,
  handleSubmit,
  watch,
  errors,
  onSubmit,
  isLoading,
  availableOptions,
  loadingStage,
  loadingProgress
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Updated platform info - only Reddit & GNews
  const getPlatformInfo = (platform) => {
    const platformMap = {
      reddit: { 
        label: "Reddit", 
        desc: "Community discussions & opinions", 
        icon: "R", 
        color: "bg-orange-500",
        dataType: "Threaded conversations",
        volume: "High volume"
      },
      gnews: { 
        label: "Google News", 
        desc: "News articles & journalism", 
        icon: "N", 
        color: "bg-red-500",
        dataType: "Professional content",
        volume: "Curated sources"
      }
    };
    return platformMap[platform] || { label: platform, desc: "Data source", icon: platform[0]?.toUpperCase() || "?", color: "bg-gray-500" };
  };

  // Updated model info - TextBlob, Vader & GenAI
  const getModelInfo = (model) => {
    const modelMap = {
      vader: { 
        label: "VADER", 
        desc: "Optimized for social media", 
        icon: "⚡", 
        time: "~30s",
        accuracy: "Fast & reliable",
        bestFor: "Social posts"
      },
      textblob: { 
        label: "TextBlob", 
        desc: "Balanced sentiment analysis", 
        icon: "🎯", 
        time: "~45s",
        accuracy: "Well-rounded",
        bestFor: "General content"
      },
      genai: { 
        label: "GenAI", 
        desc: "Advanced AI with context understanding", 
        icon: "🧠", 
        time: "~90s",
        accuracy: "Highest quality",
        bestFor: "Complex analysis"
      }
    };
    return modelMap[model] || { label: model, desc: "Analysis model", icon: "🔍", time: "~60s" };
  };

  const getAlgorithmInfo = (algorithm) => {
    const algorithmMap = {
      kmeans: { 
        label: "K-Means", 
        desc: "Creates distinct, balanced groups", 
        icon: "🎯", 
        complexity: "Simple",
        bestFor: "Clear segments"
      },
      hierarchical: { 
        label: "Hierarchical", 
        desc: "Shows relationships between groups", 
        icon: "🌳", 
        complexity: "Medium",
        bestFor: "Group relationships"
      },
      dbscan: { 
        label: "DBSCAN", 
        desc: "Finds natural clusters & outliers", 
        icon: "🔍", 
        complexity: "Advanced",
        bestFor: "Organic patterns"
      },
      gaussian: { 
        label: "Gaussian", 
        desc: "Probability-based soft clustering", 
        icon: "📊", 
        complexity: "Advanced",
        bestFor: "Overlapping groups"
      },
      spectral: { 
        label: "Spectral", 
        desc: "Graph-based complex patterns", 
        icon: "🌐", 
        complexity: "Expert",
        bestFor: "Complex structures"
      }
    };
    return algorithmMap[algorithm] || { label: algorithm, desc: "Clustering method", icon: "⚙️", complexity: "Unknown" };
  };

  // Filter available options to only show desired platforms and models
  const filteredPlatforms = ['reddit', 'gnews'];
  const filteredModels = ['textblob', 'vader', 'genai'];

  // Default algorithms if not provided in availableOptions
  const defaultAlgorithms = ['kmeans', 'hierarchical', 'dbscan', 'gaussian', 'spectral'];
  
  // Ensure we have a valid array for algorithms
  const availableAlgorithms = Array.isArray(availableOptions?.algorithms) 
    ? availableOptions.algorithms 
    : defaultAlgorithms;

  return (
    <>
      {/* Configuration Form */}
      <div onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
          <div className="space-y-6">
            {/* Main Query Input */}
            <div className="text-center">
              <label className="block text-lg font-semibold text-white mb-4">
                What topic would you like to analyze?
              </label>
              <div className="max-w-md mx-auto">
                <input
                  {...register("query", { 
                    required: "Topic is required",
                    minLength: { value: 2, message: "Topic must be at least 2 characters" },
                    maxLength: { value: 100, message: "Topic must be less than 100 characters" }
                  })}
                  placeholder="e.g., iPhone 15, Tesla Model 3, Climate Change"
                  className="w-full px-6 py-4 bg-slate-700/50 border-2 border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg text-center"
                />
                {errors.query && (
                  <p className="text-red-400 text-sm mt-2">{errors.query.message}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                  Enter any topic, brand, product, or keyword to discover audience segments
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
                <div className="space-y-3">
                  {filteredPlatforms.map((platform) => {
                    const platformInfo = getPlatformInfo(platform);
                    return (
                      <label key={platform} className="relative cursor-pointer block">
                        <input
                          {...register("platform", { required: "Platform is required" })}
                          type="radio"
                          value={platform}
                          className="sr-only peer"
                        />
                        <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-4 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {platformInfo.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-300 peer-checked:text-white">{platformInfo.label}</span>
                                <span className="text-xs text-purple-400 peer-checked:text-purple-200">{platformInfo.volume}</span>
                              </div>
                              <p className="text-xs text-gray-400 peer-checked:text-gray-200 mt-1">{platformInfo.desc}</p>
                              <p className="text-xs text-gray-500 peer-checked:text-gray-300 mt-1">{platformInfo.dataType}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.platform && (
                  <p className="text-red-400 text-sm mt-2">{errors.platform.message}</p>
                )}
              </div>

              {/* Number of Segments */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Audience Segments
                </label>
                <select
                  {...register("clusters", { required: "Number of clusters is required" })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mb-3"
                >
                  <option value="">Select segments...</option>
                  <option value="3">3 segments (Simple)</option>
                  <option value="4">4 segments (Balanced)</option>
                  <option value="5">5 segments (Detailed)</option>
                  <option value="6">6 segments (Comprehensive)</option>
                  <option value="7">7 segments (Advanced)</option>
                  <option value="8">8 segments (Expert)</option>
                </select>
                
                <div className="bg-slate-700/30 rounded-lg p-3">
                  <h4 className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Segment Examples
                  </h4>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>• Enthusiasts vs Critics</div>
                    <div>• Early Adopters vs Skeptics</div>
                    <div>• Price-Conscious vs Premium</div>
                    <div>• Technical vs Casual Users</div>
                  </div>
                </div>
                
                {errors.clusters && (
                  <p className="text-red-400 text-sm mt-1">{errors.clusters.message}</p>
                )}
              </div>

              {/* Analysis Depth */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Analysis Model
                </label>
                <div className="space-y-2">
                  {filteredModels.map((model) => {
                    const modelInfo = getModelInfo(model);
                    return (
                      <label key={model} className="relative cursor-pointer block">
                        <input
                          {...register("model", { required: "Analysis model is required" })}
                          type="radio"
                          value={model}
                          className="sr-only peer"
                        />
                        <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{modelInfo.icon}</span>
                              <div>
                                <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{modelInfo.label}</span>
                                <span className="text-xs text-gray-400 peer-checked:text-gray-200">{modelInfo.desc}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 peer-checked:text-gray-300 block">{modelInfo.time}</span>
                              <span className="text-xs text-purple-400 peer-checked:text-purple-200">{modelInfo.accuracy}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.model && (
                  <p className="text-red-400 text-sm mt-2">{errors.model.message}</p>
                )}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-3 px-6 py-3 bg-slate-700/40 hover:bg-slate-700/60 border border-purple-400/30 rounded-xl text-white transition-all duration-300"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Advanced Configuration</span>
                <div className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
                <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">Optional</span>
              </button>
            </div>

            {/* Enhanced Advanced Options */}
            {showAdvanced && (
              <div className="bg-slate-700/30 rounded-xl p-6 space-y-6 border border-purple-400/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Advanced Clustering Configuration
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(false)}
                    className="text-gray-400 hover:text-gray-300 p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Clustering Algorithm Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Clustering Algorithm
                  </label>
                  <p className="text-xs text-gray-400 mb-4">Choose how to group similar audience segments</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableAlgorithms.map((algorithm) => {
                      const algorithmInfo = getAlgorithmInfo(algorithm);
                      return (
                        <label key={algorithm} className="relative cursor-pointer">
                          <input
                            {...register("algorithm")}
                            type="radio"
                            value={algorithm}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-4 text-center transition-all duration-300 peer-checked:bg-purple-600 peer-checked:border-purple-400 hover:bg-slate-700 h-full">
                            <div className="text-2xl mb-2">{algorithmInfo.icon}</div>
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white block">{algorithmInfo.label}</span>
                            <span className="text-xs text-gray-400 peer-checked:text-gray-200 block mt-1">{algorithmInfo.desc}</span>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-purple-400 peer-checked:text-purple-200">{algorithmInfo.complexity}</span>
                            </div>
                            <span className="text-xs text-gray-500 peer-checked:text-gray-300 block mt-1">{algorithmInfo.bestFor}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Clustering Features */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Analysis Dimensions
                  </label>
                  <p className="text-xs text-gray-400 mb-4">Select which aspects to consider when creating audience segments</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        value: "sentiment", 
                        label: "Sentiment Patterns", 
                        desc: "How positive/negative opinions are expressed", 
                        icon: "❤️",
                        impact: "High impact on segmentation"
                      },
                      { 
                        value: "engagement", 
                        label: "Engagement Behavior", 
                        desc: "Comment frequency, upvotes, interactions", 
                        icon: "📊",
                        impact: "Medium impact on segmentation"
                      },
                      { 
                        value: "content", 
                        label: "Content Analysis", 
                        desc: "Writing style, vocabulary, topic focus", 
                        icon: "📝",
                        impact: "High impact on segmentation"
                      },
                      { 
                        value: "temporal", 
                        label: "Temporal Patterns", 
                        desc: "When users are active and post content", 
                        icon: "🕐",
                        impact: "Low impact on segmentation"
                      },
                      { 
                        value: "keywords", 
                        label: "Keyword Themes", 
                        desc: "Most mentioned topics and terms", 
                        icon: "🔍",
                        impact: "Medium impact on segmentation"
                      },
                      { 
                        value: "user", 
                        label: "User Behavior", 
                        desc: "Posting frequency and community participation", 
                        icon: "👤",
                        impact: "Medium impact on segmentation"
                      }
                    ].map((feature) => (
                      <label key={feature.value} className="bg-slate-600/30 hover:bg-slate-600/50 p-4 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-purple-400/30">
                        <div className="flex items-start gap-3">
                          <input
                            {...register("features")}
                            type="checkbox"
                            value={feature.value}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-purple-400/30 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{feature.icon}</span>
                              <span className="text-sm text-gray-300 font-medium">{feature.label}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{feature.desc}</p>
                            <span className="text-xs text-purple-400">{feature.impact}</span>
                          </div>
                        </div>
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
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto shadow-2xl hover:shadow-purple-500/25"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing Audience...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Discover Audience Segments
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-sm text-gray-400 mt-3">
              {watch('model') && `Analysis takes ${getModelInfo(watch('model')).time} on average`}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-white mb-2">{loadingStage || 'Analyzing Your Audience...'}</h3>
          <p className="text-gray-300 mb-4">We're processing your data and identifying unique audience segments</p>
          
          {/* Progress Bar */}
          {loadingProgress > 0 && (
            <div className="max-w-md mx-auto mb-4">
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">{loadingProgress}% complete</p>
            </div>
          )}

          <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Collecting data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <span>Analyzing sentiment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>Creating clusters</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
              <span>Generating insights</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClusteringForm;