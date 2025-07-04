import { useMemo } from "react";
import { removeStopwords } from "stopword";

const TopKeywords = ({ sentimentDetails, topN = 15 }) => {
  const keywordData = useMemo(() => {
    const wordCount = {};

    sentimentDetails.forEach(post => {
      let words = post.description
        ?.toLowerCase()
        .replace(/[^\w\s#]/g, "") // remove punctuation except hashtags
        .split(/\s+/) || [];

      // Corrected stopword removal
      words = removeStopwords(words);

      words.forEach(word => {
        if (word.length > 2) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([word, count]) => ({ word, count }));

    return sorted;
  }, [sentimentDetails, topN]);

  if (!keywordData.length) return null;

  return (
    <div className="mt-12 w-full">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">🔥 Top Keywords</h2>

      <div className="flex flex-wrap gap-3">
        {keywordData.map(({ word, count }, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-800 text-sm rounded-full border border-gray-600 text-gray-200 hover:bg-indigo-600 hover:text-white transition"
          >
            #{word} <span className="text-indigo-400 font-bold ml-1">({count})</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopKeywords;
