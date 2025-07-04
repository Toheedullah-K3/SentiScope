import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileText, Smile, Globe, Brain } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

// Components
import { SentimentOverTime, Input, Button, Radio, StatCard } from "@/components";
import { Card } from "@/components/ui/card";

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
    <>
      <h1 className="text-3xl capitalize font-bold">Dashboard</h1>
      <h6 className="text-lime-500 text-sm font-bold">Welcome to your Dashboard</h6>

      <form onSubmit={handleSubmit(createSearch)} className="">
        <div className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto">
          <Input
            stype="text"
            placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!"
            className='outline-none px-4 flex-1'
            {...register('search')}
          />
          <Button type="submit" variant="primary" className="whitespace-nowrap h-10"> Search </Button>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <p className="text-white text-sm">Select Platform</p>
          <Radio {...register("platform")} label="GNews Api" value="gnews" />
          <Radio {...register("platform")} label="Reddit" value="reddit" />
          <Radio {...register("platform")} label="Twitter" value="twitter" />
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <p>Select Model</p>
          <Radio {...register("model")} label="TextBlob" value="textblob" />
          <Radio {...register("model")} label="Vader" value="vader" />
          <Radio {...register("model")} label="GenAI" value="genai" />
        </div>
      </form>

      <br /><br />

      <motion.div
        className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard name='Total Posts' icon={FileText} value={option.total_posts || 0} color='#6366F1' />
        <StatCard name='Sentiment Score' icon={Smile} value={option.average_sentiment || 0} color='#8B5CF6' />
        <StatCard name='Platform' icon={Globe} value={option.platform || "—"} color='#EC4899' />
        <StatCard name='Model' icon={Brain} value={option.model || "—"} color='#10B981' />
      </motion.div>

      <SentimentOverTime
        query={option.search}
        model={option.model}
        platform={option.platform}
      />

      <div className="flex w-full max-w-screen-lg overflow-hidden justify-center items-center flex-col gap-4 text-white border border-white/15 rounded-lg p-4 text-3xl" >
        <h1>Results</h1>
        <p>Search Query: {option.search}</p>
        <p>Platform: {option.platform}</p>
        <p>Model: {option.model}</p>
        <p>Total Posts: {option.total_posts}</p>
        <p>Average Sentiment: {option.average_sentiment}</p>

        <div className="w-full">
          {option.sentiment_details?.map((post, key) => (
            <div key={key} className="text-base mb-2 border-b border-white/10 pb-2">
              <p>{post.description}</p>
              <p className="text-sm text-green-400">Score: {post.sentiment_score}</p>
              <p className="text-sm text-gray-400">Date: {post.date}</p>
              <p className="text-sm text-blue-400">Source: {post.subreddit || "—"}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchAnalyze;
