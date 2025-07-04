import { useMemo } from "react";
import { removeStopwords } from "stopword";
import WordCloud from "react-wordcloud";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const WordCloudChart = ({ sentimentDetails }) => {
  const words = useMemo(() => {
    const wordCount = {};

    sentimentDetails.forEach((post) => {
      const rawWords =
        post.description
          ?.toLowerCase()
          .replace(/[^a-zA-Z0-9#'\- ]+/g, "") // ✅ Keep hashtags, dashes, apostrophes
          .split(/\s+/) || [];

      const filteredWords = removeStopwords(rawWords);

      filteredWords.forEach((word) => {
        if (word.length > 2) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
    });

    return Object.entries(wordCount).map(([text, value]) => ({ text, value }));
  }, [sentimentDetails]);

  if (!words.length) return null;

  const options = {
    fontSizes: [16, 60],
    rotations: 3,
    rotationAngles: [-45, 0, 45],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 800,
    fontFamily: "sans-serif",
    fontWeight: "bold",
  };

  return (
    <div className="mt-12 w-full">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">☁️ Word Cloud</h2>

      <div className="h-[400px] bg-gray-900 border border-gray-700 rounded-lg shadow-inner p-4">
        <WordCloud words={words} options={options} />
      </div>
    </div>
  );
};

export default WordCloudChart;
