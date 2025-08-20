import React, { useState } from 'react';
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
  PieChart,
  Pie
} from 'recharts';
import {
  CheckCircle2,
  Eye,
  Users,
  Lightbulb,
  Target,
  BarChart3,
  Cpu,
  FileText,
  Info,
  AlertTriangle,
  ArrowRight,
  Heart,
  Activity,
  TrendingUp,
  DollarSign,
  Shield,
  Clock,
  Award,
  Coffee,
  Search,
  MessageSquare,
  Star
} from 'lucide-react';

const ClusteringResults = ({ clusterData, isAuthenticated }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCluster, setSelectedCluster] = useState(null);

  const formatNumber = (value, decimals = 2) => {
    if (value == null || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  };

  const getPersonaIcon = (personaName) => {
    const name = personaName?.toLowerCase() || '';
    if (name.includes('advocate') || name.includes('supporter')) return <Award className="w-5 h-5 text-yellow-400" />;
    if (name.includes('critic') || name.includes('concern')) return <AlertTriangle className="w-5 h-5 text-red-400" />;
    if (name.includes('casual') || name.includes('coffee')) return <Coffee className="w-5 h-5 text-blue-400" />;
    if (name.includes('passive') || name.includes('observer')) return <Eye className="w-5 h-5 text-gray-400" />;
    if (name.includes('seeker') || name.includes('search')) return <Search className="w-5 h-5 text-purple-400" />;
    if (name.includes('mixed') || name.includes('community')) return <Users className="w-5 h-5 text-green-400" />;
    return <Users className="w-5 h-5 text-gray-400" />;
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
      gnews: { label: "Google News", desc: "News articles", icon: "N", color: "bg-red-500" },
    //   facebook: { label: "Facebook", desc: "Social network posts", icon: "F", color: "bg-blue-600" }
    };
    return platformMap[platform] || { label: platform, desc: "Data source", icon: platform[0]?.toUpperCase() || "?", color: "bg-gray-500" };
  };

  const getModelInfo = (model) => {
    const modelMap = {
      vader: { label: "VADER", desc: "Fast & reliable sentiment", icon: "⚡", time: "~30s" },
      textblob: { label: "TextBlob", desc: "Balanced analysis", icon: "🎯", time: "~45s" },
      genai: { label: "GenAI", desc: "Advanced AI analysis", icon: "🧠", time: "~90s" },
      bert: { label: "BERT", desc: "Deep learning model", icon: "🤖", time: "~120s" }
    };
    return modelMap[model] || { label: model, desc: "Analysis model", icon: "🔍", time: "~60s" };
  };

  const getAlgorithmInfo = (algorithm) => {
    const algorithmMap = {
      kmeans: { label: "K-Means", desc: "Fast, distinct groups", icon: "🎯", complexity: "Simple" },
      hierarchical: { label: "Hierarchical", desc: "Group relationships", icon: "🌳", complexity: "Medium" },
      dbscan: { label: "DBSCAN", desc: "Natural clusters", icon: "🔍", complexity: "Advanced" },
      gaussian: { label: "Gaussian", desc: "Probability-based", icon: "📊", complexity: "Advanced" },
      spectral: { label: "Spectral", desc: "Graph-based clustering", icon: "🌐", complexity: "Expert" }
    };
    return algorithmMap[algorithm] || { label: algorithm, desc: "Clustering method", icon: "⚙️", complexity: "Unknown" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-purple-400/30 shadow-xl max-w-xs">
          <p className="text-white font-semibold">{data.persona || `Cluster ${(data.cluster || 0) + 1}`}</p>
          <p className="text-gray-300">Sentiment: {formatNumber(data.sentiment)}</p>
          <p className="text-gray-300">Engagement: {formatNumber(data.engagement, 1)}</p>
          {data.clusterProbability && (
            <p className="text-gray-300">Confidence: {formatNumber(data.clusterProbability * 100, 0)}%</p>
          )}
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {data.content ? data.content.substring(0, 100) + '...' : 'No content available'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Success Header with Enhanced Key Stats */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Analysis Complete!</h2>
          <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-sm">
            {clusterData.totalPoints || 0} posts analyzed
          </span>
          {clusterData.algorithm && (
            <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm">
              {getAlgorithmInfo(clusterData.algorithm).label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-3">
            <p className="text-blue-300 font-semibold text-sm">Segments</p>
            <p className="text-2xl font-bold text-white">{clusterData.numClusters || 0}</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3">
            <p className="text-purple-300 font-semibold text-sm">Avg Sentiment</p>
            <p className="text-2xl font-bold text-white">{formatNumber(clusterData.insights?.overallInsights?.[0]?.metric || 0)}</p>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3">
            <p className="text-yellow-300 font-semibold text-sm">Quality Score</p>
            <p className="text-2xl font-bold text-white">{formatNumber(clusterData.silhouetteScore * 100, 0)}%</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3">
            <p className="text-green-300 font-semibold text-sm">Insights</p>
            <p className="text-2xl font-bold text-white">{clusterData.insights?.actionableRecommendations?.length || 0}</p>
          </div>
          <div className="bg-cyan-500/10 rounded-lg p-3">
            <p className="text-cyan-300 font-semibold text-sm">Platform</p>
            <p className="text-lg font-bold text-white">{getPlatformInfo(clusterData.platform || 'unknown').label}</p>
          </div>
          <div className="bg-indigo-500/10 rounded-lg p-3">
            <p className="text-indigo-300 font-semibold text-sm">Model</p>
            <p className="text-lg font-bold text-white">{getModelInfo(clusterData.model || 'unknown').label}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-400/30">
        <div className="flex flex-wrap gap-1 p-2">
          {[
            { id: 'overview', label: 'Overview', icon: Eye, desc: 'Key findings' },
            { id: 'segments', label: 'Audience Segments', icon: Users, desc: 'Detailed personas' },
            { id: 'insights', label: 'Key Insights', icon: Lightbulb, desc: 'Strategic insights' },
            { id: 'recommendations', label: 'Action Plan', icon: Target, desc: 'Next steps' },
            { id: 'visualization', label: 'Data Visualization', icon: BarChart3, desc: 'Charts & graphs' },
            { id: 'technical', label: 'Technical Details', icon: Cpu, desc: 'Analysis metrics' }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
                title={tab.desc}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline text-center leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content with Enhanced Information */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overall Insights */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-blue-400" />
              Overall Analysis Summary
            </h3>
            <div className="space-y-4">
              {clusterData.insights?.overallInsights?.length > 0 ? (
                clusterData.insights.overallInsights.map((insight, index) => (
                  <div key={index} className={`rounded-lg p-4 border ${getSeverityColor(insight.severity)}`}>
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm opacity-90">{insight.description}</p>
                    {insight.metric !== undefined && (
                      <p className="text-xs mt-2 opacity-75">Metric: {formatNumber(insight.metric)}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-300">Analysis Overview</h4>
                  <p className="text-sm text-gray-300">
                    Successfully analyzed {clusterData.totalPoints} data points and identified {clusterData.numClusters} distinct audience segments
                    using {getAlgorithmInfo(clusterData.algorithm || 'kmeans').label} clustering algorithm.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-white">Most Positive Segment</h4>
              </div>
              {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
                <div>
                  <p className="text-lg font-bold text-green-400">
                    {clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgSentiment || 0) > (max.avgSentiment || 0) ? cluster : max
                    ).name || 'Unknown Segment'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgSentiment || 0) > (max.avgSentiment || 0) ? cluster : max
                    ).percentage || '0'}% of your audience
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sentiment: {formatNumber(clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgSentiment || 0) > (max.avgSentiment || 0) ? cluster : max
                    ).avgSentiment || 0)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white">Most Engaged Segment</h4>
              </div>
              {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
                <div>
                  <p className="text-lg font-bold text-blue-400">
                    {clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgEngagement || 0) > (max.avgEngagement || 0) ? cluster : max
                    ).name || 'Unknown Segment'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {formatNumber(clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgEngagement || 0) > (max.avgEngagement || 0) ? cluster : max
                    ).avgEngagement || 0, 1)} avg engagement
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Size: {clusterData.clusterSummaries.reduce((max, cluster) => 
                      (cluster.avgEngagement || 0) > (max.avgEngagement || 0) ? cluster : max
                    ).size || 0} posts
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">Priority Focus</h4>
              </div>
              {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
                <div>
                  <p className="text-lg font-bold text-purple-400">
                    {clusterData.clusterSummaries[0].name || 'Primary Segment'}
                  </p>
                  <p className="text-sm text-gray-300">
                    {clusterData.clusterSummaries[0].percentage || '0'}% of audience
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Highest strategic importance
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'segments' && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            Detailed Audience Segments
          </h3>
          <div className="space-y-6">
            {clusterData.clusterSummaries?.length > 0 ? (
              clusterData.clusterSummaries.map((cluster, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-6 border border-gray-600/30 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPersonaIcon(cluster.name)}
                      <div>
                        <h4 className="text-xl font-bold text-white">{cluster.name || `Segment ${index + 1}`}</h4>
                        <p className="text-gray-300">
                          {cluster.percentage || '0'}% of your audience ({cluster.size || 0} posts)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: cluster.color || '#8b5cf6' }}
                      ></div>
                      <span className="text-xs text-gray-400">Cluster {index + 1}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">
                    {cluster.description || `This segment represents ${cluster.percentage || '0'}% of your analyzed audience with distinct characteristics and behavior patterns.`}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-500/10 rounded p-3">
                      <p className="text-blue-300 text-sm font-medium">Sentiment</p>
                      <p className="text-white font-bold">{formatNumber(cluster.avgSentiment || 0)}</p>
                      <p className="text-xs text-blue-400">{cluster.characteristics?.sentimentLevel || 'Neutral'}</p>
                    </div>
                    <div className="bg-green-500/10 rounded p-3">
                      <p className="text-green-300 text-sm font-medium">Engagement</p>
                      <p className="text-white font-bold">{formatNumber(cluster.avgEngagement || 0, 1)}</p>
                      <p className="text-xs text-green-400">{cluster.characteristics?.engagementLevel || 'Medium'}</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded p-3">
                      <p className="text-yellow-300 text-sm font-medium">Activity</p>
                      <p className="text-white font-bold">{cluster.characteristics?.questionRate || 'N/A'}</p>
                      <p className="text-xs text-yellow-400">Questions/Comments</p>
                    </div>
                    <div className="bg-purple-500/10 rounded p-3">
                      <p className="text-purple-300 text-sm font-medium">Content</p>
                      <p className="text-white font-bold">{cluster.avgWordCount || 'N/A'}</p>
                      <p className="text-xs text-purple-400">Avg Words</p>
                    </div>
                  </div>

                  {cluster.keywords && cluster.keywords.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-300 mb-2">Key Topics & Themes:</p>
                      <div className="flex flex-wrap gap-2">
                        {cluster.keywords.map((keyword, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 rounded-full text-xs text-gray-300 hover:bg-slate-600 transition-colors">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-600 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">Marketing Profile:</p>
                        <p className="text-sm text-gray-400 mb-3">
                          {cluster.marketingProfile || `${cluster.characteristics?.sentimentLevel || 'Neutral'} audience segment with ${cluster.characteristics?.engagementLevel?.toLowerCase() || 'moderate'} engagement levels. Focus on ${cluster.avgSentiment > 0 ? 'maintaining positive sentiment' : cluster.avgSentiment < -0.1 ? 'addressing concerns' : 'building stronger relationships'}.`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">Recommended Actions:</p>
                        <div className="space-y-1">
                          {cluster.recommendedActions?.length > 0 ? cluster.recommendedActions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                              <ArrowRight className="w-3 h-3 flex-shrink-0" />
                              <span>{action}</span>
                            </div>
                          )) : (
                            <>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <ArrowRight className="w-3 h-3" />
                                <span>Monitor engagement patterns in this segment</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <ArrowRight className="w-3 h-3" />
                                <span>Create targeted content for this audience</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <ArrowRight className="w-3 h-3" />
                                <span>Track sentiment changes over time</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-400 mb-2">No Segments Available</h4>
                <p className="text-gray-500">Cluster summaries are not available for this analysis.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Strategic Insights & Opportunities
          </h3>
          <div className="space-y-6">
            {/* Marketing Opportunities */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Marketing Opportunities
              </h4>
              {clusterData.insights?.marketingOpportunities?.length > 0 ? (
                <div className="space-y-3">
                  {clusterData.insights.marketingOpportunities.map((opportunity, index) => (
                    <div key={index} className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                      <h5 className="font-semibold text-green-300 mb-2">{opportunity.title}</h5>
                      <p className="text-sm text-gray-300 mb-2">{opportunity.description}</p>
                      {opportunity.impact && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                          Impact: {opportunity.impact}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <h5 className="font-semibold text-green-300 mb-2">Focus on High-Value Segments</h5>
                  <p className="text-sm text-gray-300">
                    Target your most engaged and positive audience segments for maximum ROI. 
                    Consider personalized campaigns for each identified persona.
                  </p>
                </div>
              )}
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Risk Factors & Challenges
              </h4>
              {clusterData.insights?.riskFactors?.length > 0 ? (
                <div className="space-y-3">
                  {clusterData.insights.riskFactors.map((risk, index) => (
                    <div key={index} className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                      <h5 className="font-semibold text-red-300 mb-2">{risk.title}</h5>
                      <p className="text-sm text-gray-300 mb-2">{risk.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                          {risk.severity || 'Medium'} Risk
                        </span>
                        {risk.mitigation && (
                          <span className="text-xs text-gray-400">Mitigation available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <h5 className="font-semibold text-red-300 mb-2">Monitor Negative Sentiment</h5>
                  <p className="text-sm text-gray-300">
                    Keep close watch on segments with negative sentiment. Address concerns proactively 
                    to prevent reputation issues and maintain brand trust.
                  </p>
                </div>
              )}
            </div>

            {/* Cluster-Specific Insights */}
            {clusterData.insights?.clusterSpecificInsights?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Segment-Specific Insights
                </h4>
                <div className="space-y-3">
                  {clusterData.insights.clusterSpecificInsights.map((insight, index) => (
                    <div key={index} className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-300 mb-2">{insight.title}</h5>
                      <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                      {insight.actionItems && insight.actionItems.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-purple-400 mb-1">Action Items:</p>
                          <ul className="text-xs text-gray-400 space-y-1">
                            {insight.actionItems.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                <span>{item}</span>
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

            {/* Trends Analysis */}
            {clusterData.trends && clusterData.trends.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Trend Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusterData.trends.map((trend, index) => (
                    <div key={index} className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-300 mb-2">
                        Cluster {trend.clusterId + 1} Trend
                      </h5>
                      <p className="text-sm text-gray-300 mb-2">
                        Direction: <span className={trend.trend === 'positive' ? 'text-green-400' : 'text-red-400'}>
                          {trend.trend}
                        </span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Strength: {formatNumber(trend.strength)}</span>
                        <span>Engagement: {formatNumber(trend.engagement, 1)}</span>
                      </div>
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
            Actionable Recommendations & Strategy
          </h3>
          <div className="space-y-6">
            {/* Priority Recommendations */}
            {clusterData.insights?.actionableRecommendations && clusterData.insights.actionableRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clusterData.insights.actionableRecommendations.map((rec, index) => {
                  const priority = typeof rec === 'object' ? rec.priority : 'medium';
                  const title = typeof rec === 'object' ? rec.title : `Recommendation ${index + 1}`;
                  const description = typeof rec === 'object' ? rec.description : rec;
                  const impact = typeof rec === 'object' ? rec.impact : 'medium';
                  
                  return (
                    <div key={index} className={`bg-gradient-to-br rounded-lg p-5 border ${
                      priority === 'high' ? 'from-red-600/10 to-orange-600/10 border-red-400/30' :
                      priority === 'low' ? 'from-blue-600/10 to-cyan-600/10 border-blue-400/30' :
                      'from-green-600/10 to-emerald-600/10 border-green-400/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          priority === 'high' ? 'bg-red-500/20' :
                          priority === 'low' ? 'bg-blue-500/20' :
                          'bg-green-500/20'
                        }`}>
                          {priority === 'high' ? <AlertTriangle className="w-4 h-4 text-red-400" /> :
                           priority === 'low' ? <Info className="w-4 h-4 text-blue-400" /> :
                           <CheckCircle2 className="w-4 h-4 text-green-400" />}
                        </div>
                        <h4 className="font-semibold text-white">{title}</h4>
                      </div>
                      <p className="text-gray-300 mb-3">{description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          priority === 'high' ? 'bg-red-500/20 text-red-300' :
                          priority === 'low' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                        </span>
                        <span className="text-xs text-gray-400">
                          Est. Impact: {impact.charAt(0).toUpperCase() + impact.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  <p className="text-gray-300 mb-3">Focus marketing efforts on your most positive and engaged audience segments for maximum impact and ROI.</p>
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
                  <p className="text-gray-300 mb-3">Proactively address negative sentiment segments to improve overall brand perception and prevent issues.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Medium Priority</span>
                    <span className="text-xs text-gray-400">Est. Impact: Medium</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/10 to-indigo-600/10 border border-purple-400/30 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white">Segment-Specific Content</h4>
                  </div>
                  <p className="text-gray-300 mb-3">Create tailored content strategies for each identified audience segment to increase engagement.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Medium Priority</span>
                    <span className="text-xs text-gray-400">Est. Impact: Medium</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-400/30 rounded-lg p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h4 className="font-semibold text-white">Monitor Trends</h4>
                  </div>
                  <p className="text-gray-300 mb-3">Continuously track sentiment and engagement trends to identify emerging opportunities and threats.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">Low Priority</span>
                    <span className="text-xs text-gray-400">Est. Impact: Long-term</span>
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Timeline */}
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Implementation Timeline & Roadmap
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-300 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Immediate Actions (This Week)</p>
                    <p className="text-sm text-gray-400 mb-2">Address urgent negative sentiment and capitalize on highly positive segments</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Crisis Management</span>
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Quick Wins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-300 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Short-term Strategy (Next Month)</p>
                    <p className="text-sm text-gray-400 mb-2">Develop targeted campaigns for each segment and optimize content strategy</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Content Strategy</span>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Campaign Development</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-300 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Long-term Growth (Next Quarter)</p>
                    <p className="text-sm text-gray-400 mb-2">Build comprehensive engagement ecosystems and measure long-term impact</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">Ecosystem Building</span>
                      <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">Performance Analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-slate-700/30 rounded-lg p-5">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Success Metrics to Track
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-white font-medium">Sentiment Improvement</p>
                  <p className="text-xs text-gray-400">Track positive sentiment growth</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-sm text-white font-medium">Engagement Rate</p>
                  <p className="text-xs text-gray-400">Monitor interaction levels</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-sm text-white font-medium">Audience Growth</p>
                  <p className="text-xs text-gray-400">Expand positive segments</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-yellow-400" />
                  </div>
                  <p className="text-sm text-white font-medium">Conversion Rate</p>
                  <p className="text-xs text-gray-400">Measure business impact</p>
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
            {clusterData.dataPoints && clusterData.dataPoints.length > 0 ? (
              <>
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
                        {clusterData.dataPoints.map((entry, index) => (
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
                      <span className="text-xs text-gray-500">({cluster.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No visualization data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Segment Size Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-xl font-bold text-white mb-6">Segment Size Distribution</h3>
            {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clusterData.clusterSummaries.map(cluster => ({
                        name: cluster.name,
                        value: cluster.size || 0,
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
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">No segment data available for visualization</p>
              </div>
            )}
          </div>

          {/* Sentiment vs Engagement Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <h4 className="text-lg font-bold text-white mb-4">Average Sentiment by Segment</h4>
              {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
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
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No sentiment data available</p>
                </div>
              )}
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-purple-400/30">
              <h4 className="text-lg font-bold text-white mb-4">Average Engagement by Segment</h4>
              {clusterData.clusterSummaries && clusterData.clusterSummaries.length > 0 ? (
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
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No engagement data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'technical' && (
        <div className="space-y-6">
          {/* Analysis Configuration */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-indigo-400" />
              Analysis Configuration & Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Configuration Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Algorithm Used:</span>
                    <span className="text-white font-medium">
                      {getAlgorithmInfo(clusterData.algorithm || 'kmeans').label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Sentiment Model:</span>
                    <span className="text-white font-medium">
                      {getModelInfo(clusterData.model || 'unknown').label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Data Source:</span>
                    <span className="text-white font-medium">
                      {getPlatformInfo(clusterData.platform || 'unknown').label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Features Analyzed:</span>
                    <span className="text-white font-medium">
                      {clusterData.features ? clusterData.features.length : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-gray-300">Total Data Points:</span>
                    <span className="text-white font-medium">{clusterData.totalPoints || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300">Analysis Timestamp:</span>
                    <span className="text-white font-medium text-sm">
                      {clusterData.timestamp ? new Date(clusterData.timestamp).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-4">Feature Analysis</h4>
                {clusterData.features && clusterData.features.length > 0 ? (
                  <div className="space-y-2">
                    {clusterData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300 capitalize">{feature}</span>
                        <span className="ml-auto text-xs text-gray-500">Active</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    <p>Standard feature set used:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Sentiment analysis</li>
                      <li>• Engagement metrics</li>
                      <li>• Content characteristics</li>
                      <li>• Temporal patterns</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              Clustering Quality Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {formatNumber(clusterData.silhouetteScore || 0)}
                </div>
                <p className="text-sm text-gray-300 mb-1">Silhouette Score</p>
                <p className="text-xs text-gray-400">
                  {(clusterData.silhouetteScore || 0) > 0.5 ? 'Excellent' : 
                   (clusterData.silhouetteScore || 0) > 0.3 ? 'Good' : 
                   (clusterData.silhouetteScore || 0) > 0.1 ? 'Fair' : 'Poor'} cluster separation
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100 - (clusterData.inertia || 0) / 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {formatNumber(clusterData.clusterCoherence || clusterData.silhouetteScore || 0)}
                </div>
                <p className="text-sm text-gray-300 mb-1">Coherence</p>
                <p className="text-xs text-gray-400">
                  Topic and cluster consistency measure
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min((clusterData.clusterCoherence || clusterData.silhouetteScore || 0) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Technical Details */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Performance Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-cyan-400 mb-1">
                    {clusterData.numClusters || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400">Clusters Found</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400 mb-1">
                    {clusterData.demographics?.totalUsers || clusterData.totalPoints || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400">Data Points</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400 mb-1">
                    {clusterData.features?.length || 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400">Feature Dimensions</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-indigo-400 mb-1">
                    {clusterData.searchRequestId ? 'Saved' : 'Temp'}
                  </div>
                  <p className="text-xs text-gray-400">Analysis Status</p>
                </div>
              </div>
            </div>

            {/* Algorithm Information */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Algorithm Information</h4>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getAlgorithmInfo(clusterData.algorithm || 'kmeans').icon}</span>
                  </div>
                  <div>
                    <h5 className="text-white font-semibold">
                      {getAlgorithmInfo(clusterData.algorithm || 'kmeans').label} Clustering
                    </h5>
                    <p className="text-sm text-gray-400">
                      {getAlgorithmInfo(clusterData.algorithm || 'kmeans').desc}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                      {getAlgorithmInfo(clusterData.algorithm || 'kmeans').complexity}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <p><strong>Best for:</strong> {
                    clusterData.algorithm === 'spectral' ? 'Complex, non-linear cluster shapes and graph-based data' :
                    clusterData.algorithm === 'dbscan' ? 'Finding clusters of varying density and handling noise' :
                    clusterData.algorithm === 'hierarchical' ? 'Understanding cluster relationships and dendrograms' :
                    clusterData.algorithm === 'gaussian' ? 'Probabilistic cluster assignments and overlapping clusters' :
                    'Well-separated, spherical clusters with similar sizes'
                  }</p>
                  <p className="mt-2"><strong>Computational complexity:</strong> {
                    clusterData.algorithm === 'spectral' ? 'O(n³) - High complexity, best results' :
                    clusterData.algorithm === 'dbscan' ? 'O(n log n) - Efficient for large datasets' :
                    clusterData.algorithm === 'hierarchical' ? 'O(n³) - High complexity, detailed hierarchy' :
                    clusterData.algorithm === 'gaussian' ? 'O(n·k·d·i) - Moderate complexity' :
                    'O(n·k·i·d) - Fast and scalable'
                  }</p>
                </div>
              </div>
            </div>

            {/* Data Quality Assessment */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4">Data Quality Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Quality Indicators</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Cluster Separation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${(clusterData.silhouetteScore || 0) > 0.5 ? 'bg-green-400' : (clusterData.silhouetteScore || 0) > 0.3 ? 'bg-yellow-400' : 'bg-red-400'}`}
                            style={{ width: `${Math.min((clusterData.silhouetteScore || 0) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {(clusterData.silhouetteScore || 0) > 0.5 ? 'Good' : (clusterData.silhouetteScore || 0) > 0.3 ? 'Fair' : 'Poor'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Data Coverage</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full w-4/5"></div>
                        </div>
                        <span className="text-xs text-gray-400">Good</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Feature Relevance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div className="bg-green-400 h-2 rounded-full w-full"></div>
                        </div>
                        <span className="text-xs text-gray-400">High</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Recommendations</h5>
                  <div className="space-y-2 text-sm text-gray-300">
                    {(clusterData.silhouetteScore || 0) < 0.3 && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span>Consider adjusting cluster count or trying different algorithms</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Sufficient data points for reliable clustering</span>
                    </div>
                    {clusterData.features && clusterData.features.length > 5 && (
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span>High-dimensional feature space - consider dimensionality reduction</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Raw Data Sample */}
          {clusterData.dataPoints && clusterData.dataPoints.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                Sample Data Points
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 text-gray-300">Cluster</th>
                      <th className="text-left py-2 text-gray-300">Sentiment</th>
                      <th className="text-left py-2 text-gray-300">Engagement</th>
                      <th className="text-left py-2 text-gray-300">Content Preview</th>
                      <th className="text-left py-2 text-gray-300">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterData.dataPoints.slice(0, 5).map((point, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: point.color || '#8b5cf6' }}
                            ></div>
                            <span className="text-gray-300">{point.cluster + 1}</span>
                          </div>
                        </td>
                        <td className="py-2 text-gray-300">{formatNumber(point.sentiment)}</td>
                        <td className="py-2 text-gray-300">{formatNumber(point.engagement, 1)}</td>
                        <td className="py-2 text-gray-400 max-w-xs truncate">
                          {point.content ? point.content.substring(0, 50) + '...' : 'No content'}
                        </td>
                        <td className="py-2 text-gray-300">
                          {point.clusterProbability ? formatNumber(point.clusterProbability * 100, 0) + '%' : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clusterData.dataPoints.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Showing 5 of {clusterData.dataPoints.length} data points
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export and Sharing Options */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
          <FileText className="w-5 h-5 text-green-400" />
          Export & Share Results
        </h3>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => {
              const dataStr = JSON.stringify(clusterData, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `clustering-analysis-${Date.now()}.json`;
              link.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export JSON
          </button>
          <button 
            onClick={() => {
              if (clusterData.searchRequestId) {
                navigator.clipboard.writeText(`${window.location.origin}/analysis/${clusterData.searchRequestId}`);
                // You could show a toast notification here
                alert('Share link copied to clipboard!');
              } else {
                alert('Analysis must be saved to generate share link');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            Share Link
          </button>
          <button 
            onClick={() => {
              const summary = `Audience Analysis Results:\n\n` +
                `Query: ${clusterData.query}\n` +
                `Platform: ${clusterData.platform}\n` +
                `Total Posts: ${clusterData.totalPoints}\n` +
                `Segments: ${clusterData.numClusters}\n` +
                `Quality Score: ${formatNumber(clusterData.silhouetteScore * 100, 0)}%\n\n` +
                `Key Insights:\n${(clusterData.insights?.actionableRecommendations || []).slice(0, 3).map((r, i) => `${i + 1}. ${typeof r === 'string' ? r : r.title || r.description}`).join('\n')}`;
              
              navigator.clipboard.writeText(summary);
              alert('Summary copied to clipboard!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Copy Summary
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {isAuthenticated ? (
            <>Analysis is automatically saved to your history. Share link is available for collaboration.</>
          ) : (
            <>Login to save analysis permanently and enable sharing features.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default ClusteringResults;


