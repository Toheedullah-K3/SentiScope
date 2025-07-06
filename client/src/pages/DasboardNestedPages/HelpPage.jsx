import { useState } from "react";
import { Accordion } from "@/components";
import { LifeBuoy, Search, Mail, Info } from "lucide-react";
import { Input } from "@/components";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How does sentiment analysis work in this app?",
      answer: "We use NLP models like VADER, TextBlob, and GenAI to assign sentiment scores to posts fetched from platforms like Reddit and GNews.",
    },
    {
      question: "What do the Total Posts and Sentiment Score mean?",
      answer: "Total posts show how many posts were analyzed. Sentiment Score is the average sentiment of those posts (ranging from -1 to 1).",
    },
    {
      question: "How can I compare two different topics?",
      answer: "Go to the 'Compare Trends' page and enter two keywords, select models/platforms for each, and compare sentiment side-by-side.",
    },
    {
      question: "Why is my analysis taking too long?",
      answer: "Sometimes external APIs are slow to respond. Try re-running after a while or reduce query complexity.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
        <LifeBuoy className="w-6 h-6 text-cyan-400" />
        Help & Support
      </h1>

      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-semibold mb-1">Search Help Topics</label>
        <div className="flex items-center gap-2 bg-gray-800 rounded-md px-3 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            id="search"
            type="text"
            className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 w-full"
            placeholder="Type a question or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-5 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">FAQs & Guides</h2>
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <Accordion key={idx} title={faq.question}>
              <p className="text-gray-300">{faq.answer}</p>
            </Accordion>
          ))
        ) : (
          <p className="text-gray-400">No help topics matched your query.</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-1">
            <Info className="w-5 h-5" /> App Overview
          </h3>
          <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
            <li>Analyze sentiment of trending topics from multiple platforms.</li>
            <li>Supports multiple models: TextBlob, VADER, and GenAI.</li>
            <li>Compare trends side by side.</li>
            <li>History panel to re-check or rerun saved searches.</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-1">
            <Mail className="w-5 h-5" /> Contact Support
          </h3>
          <p className="text-gray-300 text-sm mb-2">Facing an issue? Need help beyond these FAQs?</p>
          <a
            href="mailto:support@sentiscope.app"
            className="text-sm bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded inline-block mt-2"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
