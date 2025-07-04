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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!query || !model || !platform) return;

    const fetchSentimentOverTime = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/search/getSentimentOverTime`,
          {
            params: { query, model, platform },
            withCredentials: true,
          }
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          setChartData(response.data);
        } else {
          setChartData([]);
          setErrorMsg("No sentiment data available.");
        }
      } catch (error) {
        console.error("Error fetching sentiment over time:", error);
        setChartData([]);
        setErrorMsg("Failed to fetch sentiment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentOverTime();
  }, [query, model, platform]);

  if (!query || !model || !platform) return null;
  
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 w-full p-4"
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
          <div className="text-gray-500 text-sm italic text-center px-2">
            {errorMsg}
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
                dataKey="sentiment"
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
