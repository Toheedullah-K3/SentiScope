import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  ComparisonLineChart,
  TopicSharePie,
  StatCard, // Assuming these are still used, though not explicitly in the provided code for this section
  Input, // Assuming these are still used
  Button, // Assuming these are still used
  Radio // Assuming these are still used
} from "@/components";
import { 
  FileText, 
  Smile, 
  GitCompare, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Brain, 
  Sparkles,
  Zap,
  RefreshCw,
  ArrowRight,
  Target,
  Activity,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const ComparePanel = () => {
  const { register, handleSubmit } = useForm();

  const [query1Data, setQuery1Data] = useState(null);
  const [query2Data, setQuery2Data] = useState(null);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [compareComplete, setCompareComplete] = useState(false);

  const fetchSearchData = async ({ search, model, platform }) => {
    const { data } = await axios.get(`${apiUrl}/api/v1/search/getSearchRequest`, {
      params: { search, model, platform },
      withCredentials: true
    });
    return data;
  };

  const fetchChartData = async ({ search, model, platform }) => {
    const { data } = await axios.get(`${apiUrl}/api/v1/search/getSentimentOverTime`, {
      params: { query: search, model, platform },
      withCredentials: true
    });
    return data;
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setCompareComplete(false);

      const q1 = {
        search: formData.query1,
        model: formData.model1,
        platform: formData.platform1
      };
      const q2 = {
        search: formData.query2,
        model: formData.model2,
        platform: formData.platform2
      };

      const [res1, res2] = await Promise.all([
        fetchSearchData(q1),
        fetchSearchData(q2)
      ]);
      setQuery1Data({ ...q1, ...res1 });
      setQuery2Data({ ...q2, ...res2 });

      const [cd1, cd2] = await Promise.all([
        fetchChartData(q1),
        fetchChartData(q2)
      ]);
      setChartData1(cd1);
      setChartData2(cd2);
      setCompareComplete(true);
    } catch (err) {
      console.error("Comparison fetch failed:", err);
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

  const getSentimentColor = (score) => {
    if (score >= 0.6) return "text-green-400";
    if (score >= 0.33 && score < 0.66) return "text-yellow-400";
    if (score > 0 && score < 0.33) return "text-red-400";
    return "text-red-400";
  };

  const getSentimentBg = (score) => {
    if (score >= 0.6) return "from-green-600/20 to-emerald-600/20";
    if (score >= 0.33 && score < 0.66) return "from-yellow-600/20 to-amber-600/20";
    if (score > 0 && score < 0.33) return "from-orange-600/20 to-red-600/20";
    return "from-red-600/20 to-pink-600/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 py-8 max-w-7xl mx-auto"> {/* Adjusted padding for mobile */}
        {/* Header */}
        <div className="mb-8 text-center sm:text-left"> {/* Center on mobile, left on larger */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6"> {/* Stack on mobile, row on larger */}
            <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl">
              <GitCompare className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"> {/* Smaller text on mobile */}
                Sentiment Comparison
              </h1>
              <p className="text-base sm:text-xl text-gray-300 mt-2">Compare sentiment trends between two topics or keywords</p> {/* Smaller text on mobile */}
            </div>
          </div>
        </div>

        {/* Query Forms */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-0"> {/* Changed to flex-col for mobile, flex-row for large screens */}
              {/* Query 1 */}
              <div className="space-y-6 w-full lg:w-[45%]"> {/* Full width on mobile */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">First Query</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Search Query</label>
                    <input
                      {...register("query1", { required: true })}
                      placeholder="e.g., AI, Economy, Bitcoin"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Platform</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted for mobile */}
                      {[
                        { value: "reddit", label: "Reddit", icon: "R", color: "orange" },
                        { value: "twitter", label: "Twitter", icon: "T", color: "blue" },
                        { value: "gnews", label: "GNews", icon: "N", color: "red" }
                      ].map((platform) => (
                        <label key={platform.value} className="relative cursor-pointer">
                          <input
                            {...register("platform1", { required: true })}
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Analysis Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted for mobile */}
                      {[
                        { value: "vader", label: "VADER", icon: Brain, color: "purple" },
                        { value: "textblob", label: "TextBlob", icon: BarChart3, color: "cyan" },
                        { value: "genai", label: "GenAI", icon: Sparkles, color: "pink" }
                      ].map((model) => (
                        <label key={model.value} className="relative cursor-pointer">
                          <input
                            {...register("model1", { required: true })}
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
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center w-full lg:w-[10%] py-6 lg:py-0"> {/* Added padding for mobile VS */}
                <div className="flex flex-row lg:flex-col items-center"> {/* Changed to flex-row for mobile, flex-col for large screens */}
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-0 lg:mb-4"> {/* Smaller on mobile */}
                    <span className="text-white font-bold text-base lg:text-lg">VS</span> {/* Smaller text on mobile */}
                  </div>
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400 rotate-90 lg:rotate-0" /> {/* Rotated on mobile */}
                </div>
              </div>

              {/* Query 2 */}
              <div className="space-y-6 w-full lg:w-[45%]"> {/* Full width on mobile */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">Second Query</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Search Query</label>
                    <input
                      {...register("query2", { required: true })}
                      placeholder="e.g., Inflation, Crypto, Politics"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Platform</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted for mobile */}
                      {[
                        { value: "reddit", label: "Reddit", icon: "R", color: "orange" },
                        { value: "twitter", label: "Twitter", icon: "T", color: "blue" },
                        { value: "gnews", label: "GNews", icon: "N", color: "red" }
                      ].map((platform) => (
                        <label key={platform.value} className="relative cursor-pointer">
                          <input
                            {...register("platform2", { required: true })}
                            type="radio"
                            value={platform.value}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-cyan-600 peer-checked:border-cyan-400 hover:bg-slate-700">
                            <div className={`w-6 h-6 bg-${platform.color}-500 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-2`}>
                              {platform.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white">{platform.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Analysis Model</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3"> {/* Adjusted for mobile */}
                      {[
                        { value: "vader", label: "VADER", icon: Brain, color: "purple" },
                        { value: "textblob", label: "TextBlob", icon: BarChart3, color: "cyan" },
                        { value: "genai", label: "GenAI", icon: Sparkles, color: "pink" }
                      ].map((model) => (
                        <label key={model.value} className="relative cursor-pointer">
                          <input
                            {...register("model2", { required: true })}
                            type="radio"
                            value={model.value}
                            className="sr-only peer"
                          />
                          <div className="bg-slate-700/50 border border-purple-400/30 rounded-lg p-3 text-center transition-all duration-300 peer-checked:bg-cyan-600 peer-checked:border-cyan-400 hover:bg-slate-700">
                            <model.icon className={`w-5 h-5 text-${model.color}-400 mx-auto mb-2`} />
                            <span className="text-sm font-medium text-gray-300 peer-checked:text-white">{model.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 sm:px-12 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
              > {/* Smaller padding and text on mobile */}
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing & Comparing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Start Comparison
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {compareComplete && query1Data && query2Data && (
          <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-2xl p-4 sm:p-6"> {/* Smaller padding on mobile */}
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" /> {/* Smaller icon on mobile */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Comparison Complete!</h3> {/* Smaller text on mobile */}
                  <p className="text-sm sm:text-gray-300">Successfully analyzed and compared both queries. Review the results below.</p> {/* Smaller text on mobile */}
                </div>
              </div>
            </div>

            {/* Comparison Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed to grid-cols-1 for mobile */}
              {/* Query 1 Overview */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{query1Data.search}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Platform</span>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(query1Data.platform)}
                      <span className="text-white capitalize">{query1Data.platform}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Model</span>
                    <div className="flex items-center gap-2">
                      {getModelIcon(query1Data.model)}
                      <span className="text-white">{query1Data.model?.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-r ${getSentimentBg(query1Data.average_sentiment)} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sentiment Score</span>
                      <span className={`text-xl font-bold ${getSentimentColor(query1Data.average_sentiment)}`}>
                        {typeof query1Data.average_sentiment === "number"
                          ? `${query1Data.average_sentiment > 0 ? '+' : ''}${query1Data.average_sentiment.toFixed(2)}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Total Posts</span>
                      <span className="text-xl font-bold text-white">{query1Data.total_posts?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Query 2 Overview */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{query2Data.search}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Platform</span>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(query2Data.platform)}
                      <span className="text-white capitalize">{query2Data.platform}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Model</span>
                    <div className="flex items-center gap-2">
                      {getModelIcon(query2Data.model)}
                      <span className="text-white">{query2Data.model?.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-r ${getSentimentBg(query2Data.average_sentiment)} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sentiment Score</span>
                      <span className={`text-xl font-bold ${getSentimentColor(query2Data.average_sentiment)}`}>
                        {typeof query2Data.average_sentiment === "number"
                          ? `${query2Data.average_sentiment > 0 ? '+' : ''}${query2Data.average_sentiment.toFixed(2)}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Total Posts</span>
                      <span className="text-xl font-bold text-white">{query2Data.total_posts?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Adjusted for mobile */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">Posts (Q1)</span>
                </div>
                <p className="text-2xl font-bold text-white">{query1Data.total_posts?.toLocaleString() || 0}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <span className="text-gray-300">Posts (Q2)</span>
                </div>
                <p className="text-2xl font-bold text-white">{query2Data.total_posts?.toLocaleString() || 0}</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Sentiment (Q1)</span>
                </div>
                <p className={`text-2xl font-bold ${getSentimentColor(query1Data.average_sentiment)}`}>
                  {typeof query1Data.average_sentiment === "number"
                    ? `${query1Data.average_sentiment > 0 ? '+' : ''}${query1Data.average_sentiment.toFixed(2)}`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-400/30 shadow-xl">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                  <span className="text-gray-300">Sentiment (Q2)</span>
                </div>
                <p className={`text-2xl font-bold ${getSentimentColor(query2Data.average_sentiment)}`}>
                  {typeof query2Data.average_sentiment === "number"
                    ? `${query2Data.average_sentiment > 0 ? '+' : ''}${query2Data.average_sentiment.toFixed(2)}`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Sentiment Over Time Comparison</h2>
              </div>
              <ComparisonLineChart
                data1={chartData1}
                data2={chartData2}
                label1={query1Data.search}
                label2={query2Data.search}
              />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Topic Share Distribution</h2>
              </div>
              <TopicSharePie
                sentimentDetails1={query1Data.sentiment_details || []}
                sentimentDetails2={query2Data.sentiment_details || []}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePanel;