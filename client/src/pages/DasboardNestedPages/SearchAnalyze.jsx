import axios from "axios"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { FileText, Smile, Globe, Brain } from 'lucide-react';
import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

// My Components
import { SentimentOverTime } from "@/components"
import { Input, Button } from "@/components"
import { Radio } from "@/components"
import { StatCard } from "@/components"


// shadCN components
import { Card } from "@/components/ui/card"


const SearchAnalyze = () => {
  const [option, setOption] = useState([])
  const { register, handleSubmit, watch } = useForm()
  const navigate = useNavigate()
  const location = useLocation()

  const [searchParams] = useSearchParams();
  const search = searchParams.get("query")
  const platform = searchParams.get("platform")
  const model = searchParams.get("model")
  const id = searchParams.get("id")


  const apiUrl = import.meta.env.VITE_API_URL

  // Fetch data again if page is refreshed

  useEffect(() => {
    const fetchDetailsFromId = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${apiUrl}/api/v1/search/getSearchDetailsById`, {
          params: { id },
          withCredentials: true
        });

        const { total_posts, average_sentiment, sentiment_details } = response.data;

        setOption({
          search,
          platform,
          model,
          total_posts,
          average_sentiment,
          sentiment_details,
          id
        });
      } catch (error) {
        console.error("Error loading data on refresh:", error);
      }
    };

    fetchDetailsFromId();
  }, [id, search, platform, model, apiUrl]);


  const createSearch = async (data) => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/search/getSearchRequest`, {
        params: {
          search: data.search,
          model: data.model,
          platform: data.platform
        },
        withCredentials: true
      })

      const { total_posts, average_sentiment, sentiment_details, searchRequestId } = response.data
      console.log("Python Server Response:", response.data)
      console.log("Total Posts:", total_posts)
      console.log("Average Sentiment:", average_sentiment)
      console.log("Sentiment Details:", sentiment_details)
      console.log("SearchRequestId:", searchRequestId)

      navigate(`/dashboard/sentiment-analysis?id=${searchRequestId}`)

      setOption({
        search: data.search,
        platform: data.platform,
        model: data.model,
        total_posts,
        average_sentiment,
        sentiment_details,
        searchRequestId
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <h1 className="text-3xl capitalize font-bold">Dashboard</h1>
      <h6 className="text-lime-500 text-sm font-bold">Welcome to your Dashboard</h6>

      <form
        onSubmit={handleSubmit(createSearch)}
        className=""
      >
        <div className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto">
          <Input
            stype="text" placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!"
            className='outline-none px-4 flex-1'
            {...register('search')}
          />
          <Button type="submit" variant="primary" className="whitespace-nowrap h-10"> Search </Button>
        </div>

        {/* Platforms Options  */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <p className="text-white text-sm">Select Platform</p>
          <Radio
            {...register("platform")}
            label="GNews Api"
            value="gnews"
          />
          <Radio
            {...register("platform")}
            label="Reddit"
            value="reddit"
          />
          <Radio
            {...register("platform")}
            label="Twitter"
            value="twitter"
          />
        </div>

        {/* Models Options  */}

        <div className="flex justify-center items-center gap-4 mt-4">
          <p>Select Model </p>
          <Radio
            {...register("model")}
            label="TextBlob"
            value="textblob"
          />
          <Radio
            {...register("model")}
            label="Vader"
            value="vader"
          />
          <Radio
            {...register("model")}
            label="GenAI"
            value="genai"
          />
        </div>
      </form>


      <br />
      <br />

      {/* <Chart /> */}
      <motion.div
        className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name='Total Posts'
          icon={FileText}
          value={option.total_posts ? option.total_posts : 0}
          color='#6366F1'
        />
        <StatCard
          name='Sentiment Score'
          icon={Smile}
          value={option.average_sentiment ? option.average_sentiment : 0}
          color='#8B5CF6'
        />
        <StatCard
          name='Platform'
          icon={Globe}
          value={watch("platform")?.charAt(0).toUpperCase() + watch("platform")?.slice(1)}
          color='#EC4899'
        />
        <StatCard
          name='Model'
          icon={Brain}
          value={watch("model")?.charAt(0).toUpperCase() + watch("model")?.slice(1)}
          color='#10B981'
        />
      </motion.div>

      <SentimentOverTime 
        query={watch("search")}
        model={watch("model")}
        platform={watch("platform")}
      />


      <div className="flex w-full max-w-screen-lg overflow-hidden justify-center items-center flex-col gap-4 text-white border border-white/15 rounded-lg p-4 text-3xl" >
        <h1>Results</h1>
        <p>Search Query: {option.search}</p>
        <p>Platform: {option.platform}</p>
        <p>Model: {option.model}</p>
        <p>Total Posts: {option.total_posts}</p>
        <p>Average Sentiment: {option.average_sentiment}</p>
        {console.log("Sentiment Details:", option.sentiment_details)}
        {/* Map func on sentiment_details */}
        <div className="w-full">
          {option.sentiment_details && option.sentiment_details.map((post, key) => (
            <div key={key}>
              <p>{post.description}</p>
              <p>{post.sentiment_score}</p>
              <p>{post.date}</p>
              <p>{post.subreddit}</p>
              <p>--------------------------------</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default SearchAnalyze