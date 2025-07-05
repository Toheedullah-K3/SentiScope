import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { removeStopwords } from "stopword"; // ✅ Named import (fixes the error)

const COLORS = [
  "#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B",
  "#F43F5E", "#3B82F6", "#A855F7", "#14B8A6", "#EAB308"
];

const TopicSharePie = ({ sentimentDetails1 = [], sentimentDetails2 = [] }) => {
  const processData = (details) => {
    const wordFreq = {};

    details.forEach((item) => {
      const words = item.description
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(Boolean);

      const filtered = removeStopwords(words); // ✅ Named import used here

      filtered.forEach((word) => {
        if (word.length > 2) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
    });

    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  };

  const data1 = useMemo(() => processData(sentimentDetails1), [sentimentDetails1]);
  const data2 = useMemo(() => processData(sentimentDetails2), [sentimentDetails2]);

  return (
    <motion.div
      className="grid md:grid-cols-2 gap-6 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Query 1 Pie Chart */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-4">
        <h2 className="text-lg font-medium mb-4 text-gray-100">🔹 Top Topics – Query 1</h2>
        {data1.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">Not enough data to show topics.</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data1}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {data1.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Query 2 Pie Chart */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-4">
        <h2 className="text-lg font-medium mb-4 text-gray-100">🔹 Top Topics – Query 2</h2>
        {data2.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">Not enough data to show topics.</p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data2}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name }) => name}
                  labelLine={false}
                >
                  {data2.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicSharePie;
