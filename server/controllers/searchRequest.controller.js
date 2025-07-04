import axios from "axios";
import SearchRequest from "../models/searchRequest.model.js";
import SearchResult from "../models/searchResult.model.js";

const getSearchRequest = async (req, res) => {
  const { search, model, platform } = req.query;

  if (!(search && model && platform)) {
    return res.status(400).json({ error: "Missing query, model, or platform" });
  }

  const existingRequest = await SearchRequest.findOne({ searchQuery: search, model, platform });

  if (existingRequest) {
    const searchResults = await SearchResult.find({ searchRequestId: existingRequest._id });

    return res.status(200).json({
      message: "Search request already exists",
      total_posts: existingRequest.totalPosts,
      average_sentiment: existingRequest.averageSentimentScore,
      sentiment_details: searchResults.map((result) => ({
        description: result.postText,
        sentiment_score: result.sentimentScore,
        date: result.postCreatedAt,
        subreddit: result.subreddit || "N/A"
      })),
      searchRequestId: existingRequest._id
    });
  }

  try {
    const response = await axios.post("http://127.0.0.1:5000", { search, model, platform });
    const { total_posts, average_sentiment, sentiment_details } = response.data;

    if (!total_posts || sentiment_details.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const searchRequest = await SearchRequest.create({
      searchQuery: search,
      platform,
      model,
      userId: req.user?.id || null,
      totalPosts: total_posts,
      averageSentimentScore: average_sentiment
    });

    await SearchResult.insertMany(
      sentiment_details.map((result) => ({
        searchRequestId: searchRequest._id,
        postText: result.description || "",
        postCreatedAt: result.date || "",
        sentimentScore: result.sentiment_score,
        subreddit: result.subreddit || ""
      }))
    );

    return res.status(200).json({
      total_posts,
      average_sentiment,
      model,
      platform,
      sentiment_details,
      searchRequestId: searchRequest._id
    });

  } catch (error) {
    console.error("Error calling Python server:", error);
    return res.status(500).json({ error: "Failed to connect to Python server" });
  }
};

const getSearchRequestById = async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing 'id' parameter in query" });

  try {
    const searchRequest = await SearchRequest.findById(id);
    if (!searchRequest) {
      return res.status(404).json({ error: "Search request with this ID not found" });
    }

    const searchResults = await SearchResult.find({ searchRequestId: id });

    return res.status(200).json({
      message: "SearchRequestById fetched successfully!",
      search: searchRequest.searchQuery,
      platform: searchRequest.platform,
      model: searchRequest.model,
      total_posts: searchRequest.totalPosts,
      average_sentiment: searchRequest.averageSentimentScore,
      sentiment_details: searchResults.map((result) => ({
        description: result.postText,
        sentiment_score: result.sentimentScore,
        date: result.postCreatedAt,
        subreddit: result.subreddit || "N/A"
      }))
    });
  } catch (error) {
    console.error("Error fetching search by ID:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



const getSentimentOverTime = async (req, res) => {
  const { query, model, platform } = req.query;

  if (!(query && model && platform)) {
    return res.status(400).json({ error: "Missing query, model, or platform" });
  }

  try {
    const searchRequest = await SearchRequest.findOne({ searchQuery: query, model, platform });
    if (!searchRequest) return res.status(404).json({ error: "Search request not found" });

    const searchResults = await SearchResult.find({ searchRequestId: searchRequest._id });
    if (searchResults.length === 0) return res.status(404).json({ error: "No search results found" });

    searchResults.sort((a, b) => new Date(a.postCreatedAt) - new Date(b.postCreatedAt));

    const totalPosts = searchResults.length;
    const bins = 10;
    const binSize = Math.ceil(totalPosts / bins);
    const chartData = [];

    for (let i = 0; i < bins; i++) {
      const bin = searchResults.slice(i * binSize, (i + 1) * binSize);
      if (bin.length === 0) continue;

      const avgSentiment = bin.reduce((sum, post) => sum + post.sentimentScore, 0) / bin.length;
      const startDate = new Date(bin[0].postCreatedAt).toLocaleDateString();
      const endDate = new Date(bin[bin.length - 1].postCreatedAt).toLocaleDateString();

      chartData.push({
        name: `${startDate} - ${endDate}`,
        sentiment: avgSentiment.toFixed(2),
        posts: bin.length
      });
    }

    return res.status(200).json(chartData);
  } catch (error) {
    console.error("Error generating sentiment chart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getSearchRequest,
  getSearchRequestById,
  getSentimentOverTime
};
