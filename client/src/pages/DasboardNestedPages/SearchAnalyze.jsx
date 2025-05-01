import { Input, Button } from "@/components"
import axios from "axios"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Radio } from "@/components"

const SearchAnalyze = () => {
  const [option, setOption] = useState([])
  const { register, handleSubmit, watch } = useForm()

  const apiUrl = import.meta.env.VITE_API_URL

  const createSearch = async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/api/v1/search/getSearchRequest`, data, {
        withCredentials: true
      })

      const { total_posts, average_sentiment, sentiment_details } = response.data
      console.log("Python Server Response:", response.data)
      console.log("Total Posts:", total_posts)
      console.log("Average Sentiment:", average_sentiment)
      console.log("Sentiment Details:", sentiment_details)

      setOption({
        search: data.search,
        platform: data.platform,
        model: data.model,
        total_posts,
        average_sentiment,
        sentiment_details
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
            type="text" placeholder="Analyze sentiment—Try 'AI' or 'Bitcoin'!"
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

      


      <p>Platform --&gt; {watch("platform")}</p>
      <p>Model --&gt; {watch("model")}</p>
      
      <br />
      <br />

      <div className="flex justify-center items-center flex-col gap-4 text-white border border-white/15 rounded-lg p-4 text-3xl">
        <h1>Results</h1>
        <p>Search Query: {option.search}</p>
        <p>Platform: {option.platform}</p>
        <p>Model: {option.model}</p>
        <p>Total Posts: {option.total_posts}</p>
        <p>Average Sentiment: {option.average_sentiment}</p>
        {console.log("Sentiment Details:", option.sentiment_details)}
        {/* Map func on sentiment_details */}
        <div>
          {option.sentiment_details && option.sentiment_details.map((post, key) => (
            <div key={key}>
              <p>{post.description}</p>
              <p>{post.sentiment_score}</p>
              <p>--------------------------------\n</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default SearchAnalyze