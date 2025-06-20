import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

const SentimentOverTime = ({ query, model, platform }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentimentOverTime = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/search/getSentimentOverTime`,
          {
            params: {
              query,
              model,
              platform,
            },
            withCredentials: true,
          }
        );
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching sentiment over time:", error);
        setChartData([]); // fallback to avoid chart crash
      } finally {
        setLoading(false);
      }
    };

    if (query && model && platform) {
      fetchSentimentOverTime();
    }else {
      setLoading(false);
      setChartData([]); 
    }
  }, [query, model, platform]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 w-[50%] p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Sentiment Over Time
      </h2>

      <div className="h-80 flex items-center justify-center">
        {loading ? (
          <div className="text-gray-400">Loading chart...</div>
        ) : chartData.length === 0 ? (
          <div className="text-gray-500 text-sm italic">
            No sentiment data available for this query and platform.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#485563" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default SentimentOverTime;
