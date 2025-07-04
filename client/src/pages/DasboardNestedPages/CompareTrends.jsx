import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input, Button, Radio } from "@/components";
import StatCard from "@/components/StatCard";
import ComparisonLineChart from "@/components/ComparisonLineChart";
import { FileText, Smile, Globe, Brain } from "lucide-react";

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
      <h1 className="text-3xl font-bold text-white mb-4">⚔️ Compare Two Queries</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
        {/* Query 1 */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Query 1</h3>
          <Input {...register("query1")} placeholder="Enter first query" />
          <div className="flex gap-4 mt-2">
            <Radio {...register("platform1")} label="Reddit" value="reddit" />
            <Radio {...register("platform1")} label="GNews" value="gnews" />
            <Radio {...register("platform1")} label="Twitter" value="twitter" />
          </div>
          <div className="flex gap-4 mt-2">
            <Radio {...register("model1")} label="VADER" value="vader" />
            <Radio {...register("model1")} label="TextBlob" value="textblob" />
            <Radio {...register("model1")} label="GenAI" value="genai" />
          </div>
        </div>

        {/* Query 2 */}
        <div className="border border-gray-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Query 2</h3>
          <Input {...register("query2")} placeholder="Enter second query" />
          <div className="flex gap-4 mt-2">
            <Radio {...register("platform2")} label="Reddit" value="reddit" />
            <Radio {...register("platform2")} label="GNews" value="gnews" />
            <Radio {...register("platform2")} label="Twitter" value="twitter" />
          </div>
          <div className="flex gap-4 mt-2">
            <Radio {...register("model2")} label="VADER" value="vader" />
            <Radio {...register("model2")} label="TextBlob" value="textblob" />
            <Radio {...register("model2")} label="GenAI" value="genai" />
          </div>
        </div>

        <div className="col-span-2 mt-4">
          <Button type="submit" variant="primary">Compare</Button>
        </div>
      </form>

      {(query1Data && query2Data) && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            <StatCard name='Total Posts (Q1)' icon={FileText} value={query1Data.total_posts || 0} color='#6366F1' />
            <StatCard name='Total Posts (Q2)' icon={FileText} value={query2Data.total_posts || 0} color='#6366F1' />
            <StatCard name='Sentiment (Q1)' icon={Smile} value={query1Data.average_sentiment || 0} color='#10B981' />
            <StatCard name='Sentiment (Q2)' icon={Smile} value={query2Data.average_sentiment || 0} color='#EC4899' />
          </div>

          <ComparisonLineChart
            data1={chartData1}
            data2={chartData2}
            label1={query1Data.search}
            label2={query2Data.search}
          />
        </>
      )}
    </div>
  );
};

export default ComparePanel;
