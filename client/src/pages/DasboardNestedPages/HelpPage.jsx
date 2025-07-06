import React from 'react';

const HelpPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-200">
      <h1 className="text-3xl font-bold mb-6">🆘 Help & Guidance</h1>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">What is SentiScope?</h2>
        <p className="text-gray-400">
          SentiScope is a sentiment analysis tool that gathers and analyzes public posts from Reddit, news platforms, and pre-uploaded datasets to give you insight into public opinion on any topic.
        </p>
      </section>

      {/* How To Use */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">How to Use the Dashboard</h2>
        <ul className="list-disc pl-6 text-gray-400 space-y-2">
          <li>
            <strong>Sentiment Analysis:</strong> Enter a keyword, select platform (e.g. Reddit, GNews) and model (TextBlob, Vader, or GenAI), and hit search.
          </li>
          <li>
            <strong>Compare Trends:</strong> Select two different queries to compare their sentiment trends side-by-side.
          </li>
          <li>
            <strong>Saved Analysis:</strong> View your past searches, rerun them, or delete them.
          </li>
        </ul>
      </section>

      {/* Chart Explanations */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">What Do the Charts Show?</h2>
        <ul className="list-disc pl-6 text-gray-400 space-y-2">
          <li>
            <strong>Sentiment Over Time:</strong> Shows how sentiment changes across dates.
          </li>
          <li>
            <strong>Breakdown:</strong> Shows percentages of positive, negative, and neutral posts.
          </li>
          <li>
            <strong>Top Keywords:</strong> Displays most-used terms in the sentiment data.
          </li>
          <li>
            <strong>Word Cloud:</strong> A visual summary of frequently occurring words.
          </li>
          <li>
            <strong>Post Timeline:</strong> Chronologically ordered posts from the dataset.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Frequently Asked Questions</h2>
        <div className="space-y-4 text-gray-400">
          <div>
            <strong>Q: What if the data seems outdated?</strong>
            <p>A: Try rerunning the query using the 🔁 rerun icon in Saved Analysis.</p>
          </div>
          <div>
            <strong>Q: How is sentiment calculated?</strong>
            <p>A: It depends on the model you choose. Vader is better for social media. TextBlob is simple. GenAI uses advanced LLMs.</p>
          </div>
          <div>
            <strong>Q: Why does it take a few seconds to load?</strong>
            <p>A: Data is fetched live from APIs and then analyzed in real time.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Need More Help?</h2>
        <p className="text-gray-400">
          Reach out via the contact page or email us at <a href="mailto:support@sentiscope.ai" className="text-lime-400 underline">support@sentiscope.ai</a>
        </p>
      </section>
    </div>
  );
};

export default HelpPage;
