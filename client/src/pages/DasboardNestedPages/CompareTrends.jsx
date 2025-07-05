import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  ComparisonLineChart,
  TopicSharePie,
  StatCard,
  Input,
  Button,
  Radio
} from "@/components";
import { FileText, Smile } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const ComparePanel = () => {
  const { register, handleSubmit } = useForm();

  const [query1Data, setQuery1Data] = useState(null);
  const [query2Data, setQuery2Data] = useState(null);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);

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
    } catch (err) {
      console.error("Comparison fetch failed:", err);
    }
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">⚔️ Compare Two Queries</h1>
      <p className="text-sm text-gray-400 mb-6">Compare trends, sentiment scores, and topic shares between two topics or keywords.</p>

      {/* Query Forms */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Query 1 */}
        <div className="border border-gray-700 bg-gray-900/40 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-2">🔹 Query 1</h3>
          <Input {...register("query1")} placeholder="e.g. AI, Economy" />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">Platform</p>
            <div className="flex gap-4">
              <Radio {...register("platform1")} label="Reddit" value="reddit" />
              <Radio {...register("platform1")} label="GNews" value="gnews" />
              <Radio {...register("platform1")} label="Twitter" value="twitter" />
            </div>
            <p className="text-sm text-gray-400">Model</p>
            <div className="flex gap-4">
              <Radio {...register("model1")} label="VADER" value="vader" />
              <Radio {...register("model1")} label="TextBlob" value="textblob" />
              <Radio {...register("model1")} label="GenAI" value="genai" />
            </div>
          </div>
        </div>

        {/* Query 2 */}
        <div className="border border-gray-700 bg-gray-900/40 rounded-lg p-5">
          <h3 className="text-white font-semibold mb-2">🔸 Query 2</h3>
          <Input {...register("query2")} placeholder="e.g. Bitcoin, Inflation" />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">Platform</p>
            <div className="flex gap-4">
              <Radio {...register("platform2")} label="Reddit" value="reddit" />
              <Radio {...register("platform2")} label="GNews" value="gnews" />
              <Radio {...register("platform2")} label="Twitter" value="twitter" />
            </div>
            <p className="text-sm text-gray-400">Model</p>
            <div className="flex gap-4">
              <Radio {...register("model2")} label="VADER" value="vader" />
              <Radio {...register("model2")} label="TextBlob" value="textblob" />
              <Radio {...register("model2")} label="GenAI" value="genai" />
            </div>
          </div>
        </div>

        <div className="col-span-2 mt-2 text-center">
          <Button type="submit" variant="primary" className="w-full md:w-auto">Compare</Button>
        </div>
      </form>

      {/* Results */}
      {query1Data && query2Data && (
        <>
          {/* Stat Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard name='Total Posts (Q1)' icon={FileText} value={query1Data.total_posts || 0} color='#6366F1' />
            <StatCard name='Total Posts (Q2)' icon={FileText} value={query2Data.total_posts || 0} color='#6366F1' />
            <StatCard name='Sentiment (Q1)' icon={Smile} value={query1Data.average_sentiment || 0} color='#10B981' />
            <StatCard name='Sentiment (Q2)' icon={Smile} value={query2Data.average_sentiment || 0} color='#EC4899' />
          </div>

          {/* Charts */}
          <div className="bg-gray-800 bg-opacity-50 rounded-xl shadow-md border border-gray-700 mb-8 p-4">
            <h2 className="text-lg font-medium text-white mb-4">📈 Sentiment Over Time Comparison</h2>
            <ComparisonLineChart
              data1={chartData1}
              data2={chartData2}
              label1={query1Data.search}
              label2={query2Data.search}
            />
          </div>

          <div className="grid gap-6">
            <TopicSharePie
              sentimentDetails1={query1Data.sentiment_details || []}
              sentimentDetails2={query2Data.sentiment_details || []}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePanel;
