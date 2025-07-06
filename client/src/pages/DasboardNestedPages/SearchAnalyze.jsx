import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileText, Smile, Globe, Brain } from 'lucide-react';
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
        alert("The search data may no longer exist. Please try a new query.");
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
    <div className="overflow-x-hidden w-full px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pt-8">
        <motion.h1
          className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Search & Analyze
        </motion.h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          Discover sentiment insights from live data sources.
        </p>
      </div>

      {/* Search Form */}
      <motion.form
        onSubmit={handleSubmit(createSearch)}
        className="mt-8 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex border border-white/10 rounded-xl bg-white/5 backdrop-blur-md p-4 max-w-2xl mx-auto shadow-lg">
          <Input
            stype="text"
            placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!"
            className="outline-none px-4 flex-1 bg-transparent text-white placeholder:text-gray-400"
            {...register('search')}
          />
          <Button type="submit" variant="primary" className="whitespace-nowrap h-10 ml-4">Search</Button>
        </div>

        <div className="flex justify-center items-center gap-6 flex-wrap text-white">
          <span className="text-sm text-gray-300">Select Platform:</span>
          <Radio {...register("platform")} label="GNews Api" value="gnews" />
          <Radio {...register("platform")} label="Reddit" value="reddit" />
          <Radio {...register("platform")} label="Twitter" value="twitter" />
        </div>

        <div className="flex justify-center items-center gap-6 flex-wrap text-white">
          <span className="text-sm text-gray-300">Select Model:</span>
          <Radio {...register("model")} label="TextBlob" value="textblob" />
          <Radio {...register("model")} label="Vader" value="vader" />
          <Radio {...register("model")} label="GenAI" value="genai" />
        </div>
      </motion.form>

      {/* Empty state */}
      {!option.search && (
        <motion.div
          className="border border-dashed border-white/10 rounded-xl p-6 text-center text-white bg-white/5 backdrop-blur-md shadow-inner mt-12 mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-2">🔍 Ready to Analyze?</h2>
          <p className="text-gray-300 mb-2">
            Enter a keyword, select a platform and model — and we’ll analyze it for you.
          </p>
          <p className="text-gray-400 text-sm">
            Try: <span className="text-lime-400 font-medium">"Bitcoin"</span>, <span className="text-pink-400 font-medium">"AI"</span>, or <span className="text-blue-400 font-medium">"Elections"</span>.
          </p>
        </motion.div>
      )}

      {/* Stat Cards */}
      {option.search && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Posts' icon={FileText} value={option.total_posts || 0} color='#6366F1' />
          <StatCard name='Sentiment Score' icon={Smile} value={option.average_sentiment || 0} color='#8B5CF6' />
          <StatCard name='Platform' icon={Globe} value={option.platform || "—"} color='#EC4899' />
          <StatCard name='Model' icon={Brain} value={option.model || "—"} color='#10B981' />
        </motion.div>
      )}

      {/* Visual Insight Section */}
      {option.search && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <SentimentOverTime query={option.search} model={option.model} platform={option.platform} />
          <SentimentBreakdown sentimentDetails={option.sentiment_details || []} />
          <WordCloudChart sentimentDetails={option.sentiment_details || []} />
          <TopKeywords sentimentDetails={option.sentiment_details || []} />
        </motion.div>
      )}

      {/* Timeline */}
      {option.search && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PostTimeline sentimentDetails={option.sentiment_details || []} />
        </motion.div>
      )}
    </div>
  );
};

export default SearchAnalyze;
