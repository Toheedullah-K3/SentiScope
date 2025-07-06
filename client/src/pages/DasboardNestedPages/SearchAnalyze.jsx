// top imports unchanged
import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileText, Smile, Globe, Brain, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

// components unchanged
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
    try {
      const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequest`, {
        params: {
          search: data.search,
          model: data.model,
          platform: data.platform
        },
        withCredentials: true
      });

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
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl">
              Analyze
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Platform:</span>
              <Radio {...register("platform")} label="GNews" value="gnews" />
              <Radio {...register("platform")} label="Reddit" value="reddit" />
              <Radio {...register("platform")} label="Twitter" value="twitter" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-300">Model:</span>
              <Radio {...register("model")} label="TextBlob" value="textblob" />
              <Radio {...register("model")} label="VADER" value="vader" />
              <Radio {...register("model")} label="GenAI" value="genai" />
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
