import { useState, useMemo } from "react";

const PostTimeline = ({ sentimentDetails }) => {
  const [filter, setFilter] = useState("all");

  const filteredPosts = useMemo(() => {
    if (filter === "positive") return sentimentDetails.filter(p => p.sentiment_score >= 0.66);
    if (filter === "neutral") return sentimentDetails.filter(p => p.sentiment_score > 0.33 && p.sentiment_score < 0.66);
    if (filter === "negative") return sentimentDetails.filter(p => p.sentiment_score <= 0.33);
    return sentimentDetails;
  }, [filter, sentimentDetails]);

  if (!sentimentDetails || sentimentDetails.length === 0) return null;

  const getSentimentLabel = (score) => {
    if (score >= 0.66) return { label: "Positive", color: "text-green-400", emoji: "😊" };
    if (score <= 0.33) return { label: "Negative", color: "text-red-400", emoji: "😠" };
    return { label: "Neutral", color: "text-yellow-400", emoji: "😐" };
  };

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">📜 Post Timeline</h2>

      <div className="flex gap-3 mb-6 flex-wrap">
        {["all", "positive", "neutral", "negative"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2 rounded-full border text-sm font-semibold capitalize transition 
              ${filter === type
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-gray-900 border border-gray-700 max-h-[500px] overflow-y-auto shadow-md">
        {filteredPosts.map((post, index) => {
          const { label, color, emoji } = getSentimentLabel(post.sentiment_score);

          return (
            <div
              key={index}
              className="p-5 border-b border-gray-800 hover:bg-gray-800/50 transition-all"
            >
              <p className="text-gray-100 text-sm mb-2">
                {post.description || <span className="italic text-gray-500">No description</span>}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className={`${color} font-semibold`}>
                  {emoji} {label} ({post.sentiment_score.toFixed(2)})
                </span>
                <span>Date: {new Date(post.date).toLocaleDateString()}</span>
                <span>Source: <span className="text-blue-400">{post.subreddit || "—"}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostTimeline;
