import axios from "axios";
import SearchRequest from "../models/searchRequest.model.js";
import SearchResult from "../models/searchResult.model.js";


const performClustering = async (req, res) => {
  try {
    const {
      query,
      platform = 'reddit',
      model = 'vader',
      algorithm = 'kmeans',
      clusters = 5,
      features = ['sentiment', 'engagement']
    } = req.body;

    
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    if (clusters < 2 || clusters > 10) {
      return res.status(400).json({
        success: false,
        error: 'Number of clusters must be between 2 and 10'
      });
    }

    // Check if we already have sentiment data for this query
    let existingRequest = await SearchRequest.findOne({ searchQuery: query, model, platform });
    let sentimentData;

    if (existingRequest) {
      // Get existing sentiment results
      const searchResults = await SearchResult.find({ searchRequestId: existingRequest._id });
      sentimentData = searchResults.map((result) => ({
        content: result.postText,
        sentiment: result.sentimentScore,
        engagement: Math.random() * 100, // Mock engagement data - replace with actual
        timestamp: result.postCreatedAt,
        subreddit: result.subreddit,
        source: platform
      }));
    } else {
      // Fetch new data from Python server
      console.log(`Fetching new data from Python server for query: ${query}`);
      
      try {
        const response = await axios.post("http://127.0.0.1:5000", { search: query, model, platform });
        const { total_posts, average_sentiment, sentiment_details } = response.data;

        if (!total_posts || sentiment_details.length === 0) {
          return res.status(404).json({
            success: false,
            error: "No data found for the specified query"
          });
        }

        // Save to database
        const searchRequest = await SearchRequest.create({
          searchQuery: query,
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

        // Prepare sentiment data for clustering
        sentimentData = sentiment_details.map((result) => ({
          content: result.description || "",
          sentiment: result.sentiment_score,
          engagement: Math.random() * 100, // Mock engagement - replace with actual
          timestamp: result.date,
          subreddit: result.subreddit,
          source: platform
        }));

        existingRequest = searchRequest;
      } catch (error) {
        console.error("Error calling Python server:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to fetch data from sentiment analysis service"
        });
      }
    }

    // Perform clustering analysis
    console.log(`Performing ${algorithm} clustering with ${clusters} clusters`);
    
    // Prepare features for clustering
    const featuresData = prepareFeatures(sentimentData, features);

    // Perform clustering based on selected algorithm
    let clusteringResult;
    try {
      clusteringResult = await performClusteringAlgorithm(featuresData, algorithm, clusters);
    } catch (error) {
      console.error("Clustering algorithm error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to perform clustering analysis"
      });
    }

    // Process and format results
    const processedResults = processClusteringResults(sentimentData, clusteringResult, algorithm);

    // Generate cluster summaries
    const clusterSummaries = generateClusterSummaries(processedResults.dataPoints, clusters);

    // Calculate clustering metrics
    const metrics = calculateClusteringMetrics(featuresData, clusteringResult.labels, clusteringResult.centroids);

    const response = {
      success: true,
      algorithm: algorithm,
      totalPoints: sentimentData.length,
      numClusters: clusterSummaries.length,
      dataPoints: processedResults.dataPoints,
      clusterSummaries: clusterSummaries,
      silhouetteScore: metrics.silhouetteScore,
      inertia: metrics.inertia,
      features: features,
      query: query,
      platform: platform,
      model: model,
      searchRequestId: existingRequest._id,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Clustering analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during clustering analysis'
    });
  }
};

/**
 * Get available platforms
 * GET /api/clustering/platforms
 */
const getPlatforms = async (req, res) => {
  try {
    const platforms = [
      {
        id: 'reddit',
        name: 'Reddit',
        description: 'Social news aggregation platform',
        icon: 'R',
        color: 'orange'
      },
      {
        id: 'twitter',
        name: 'Twitter',
        description: 'Microblogging social network',
        icon: 'T',
        color: 'blue'
      },
      {
        id: 'gnews',
        name: 'Google News',
        description: 'News aggregation service',
        icon: 'N',
        color: 'red'
      }
    ];

    res.status(200).json({
      success: true,
      platforms: platforms
    });
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available platforms'
    });
  }
};

/**
 * Get available sentiment models
 * GET /api/clustering/models
 */
const getSentimentModels = async (req, res) => {
  try {
    const models = [
      {
        id: 'vader',
        name: 'VADER',
        description: 'Valence Aware Dictionary and sEntiment Reasoner',
        type: 'lexicon-based',
        accuracy: 'high'
      },
      {
        id: 'textblob',
        name: 'TextBlob',
        description: 'Simple API for diving into common NLP tasks',
        type: 'lexicon-based',
        accuracy: 'medium'
      },
      {
        id: 'genai',
        name: 'GenAI',
        description: 'Generative AI powered sentiment analysis',
        type: 'transformer-based',
        accuracy: 'very-high'
      }
    ];

    res.status(200).json({
      success: true,
      models: models
    });
  } catch (error) {
    console.error('Error fetching sentiment models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available sentiment models'
    });
  }
};

/**
 * Get available clustering algorithms
 * GET /api/clustering/algorithms
 */
const getAlgorithms = async (req, res) => {
  try {
    const algorithms = [
      {
        id: 'kmeans',
        name: 'K-Means',
        description: 'Centroid-based clustering algorithm',
        type: 'partitional',
        complexity: 'O(n*k*i*d)'
      },
      {
        id: 'hierarchical',
        name: 'Hierarchical',
        description: 'Tree-based clustering algorithm',
        type: 'hierarchical',
        complexity: 'O(n³)'
      },
      {
        id: 'dbscan',
        name: 'DBSCAN',
        description: 'Density-based spatial clustering',
        type: 'density-based',
        complexity: 'O(n log n)'
      },
      {
        id: 'gaussian',
        name: 'Gaussian Mixture',
        description: 'Probability-based clustering using EM algorithm',
        type: 'probabilistic',
        complexity: 'O(n*k*i*d)'
      }
    ];

    res.status(200).json({
      success: true,
      algorithms: algorithms
    });
  } catch (error) {
    console.error('Error fetching algorithms:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available algorithms'
    });
  }
};

/**
 * Get clustering history based on search requests
 * GET /api/clustering/history
 */
const getClusteringHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Build query - if user is authenticated, show their history, otherwise show recent public ones
    const query = userId ? { userId } : { userId: null };
    
    const searchRequests = await SearchRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .select('searchQuery platform model totalPosts averageSentimentScore createdAt');

    const history = searchRequests.map(request => ({
      id: request._id,
      query: request.searchQuery,
      platform: request.platform,
      model: request.model,
      totalPosts: request.totalPosts,
      avgSentiment: request.averageSentimentScore,
      timestamp: request.createdAt,
      status: 'completed'
    }));

    res.status(200).json({
      success: true,
      history: history
    });
  } catch (error) {
    console.error('Error fetching clustering history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clustering history'
    });
  }
};

/**
 * Get clustering analysis for existing search by ID
 * GET /api/clustering/:id
 */
const getClusteringById = async (req, res) => {
  try {
    const { id } = req.params;
    const { algorithm = 'kmeans', clusters = 5, features = ['sentiment', 'engagement'] } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing search ID parameter"
      });
    }

    // Get existing search request
    const searchRequest = await SearchRequest.findById(id);
    if (!searchRequest) {
      return res.status(404).json({
        success: false,
        error: "Search request not found"
      });
    }

    // Get search results
    const searchResults = await SearchResult.find({ searchRequestId: id });
    if (searchResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No search results found for clustering"
      });
    }

    // Prepare data for clustering
    const sentimentData = searchResults.map((result) => ({
      content: result.postText,
      sentiment: result.sentimentScore,
      engagement: Math.random() * 100, // Mock engagement - replace with actual
      timestamp: result.postCreatedAt,
      subreddit: result.subreddit,
      source: searchRequest.platform
    }));

    // Perform clustering
    const featuresData = prepareFeatures(sentimentData, features.split(','));
    const clusteringResult = await performClusteringAlgorithm(featuresData, algorithm, parseInt(clusters));
    const processedResults = processClusteringResults(sentimentData, clusteringResult, algorithm);
    const clusterSummaries = generateClusterSummaries(processedResults.dataPoints, parseInt(clusters));
    const metrics = calculateClusteringMetrics(featuresData, clusteringResult.labels, clusteringResult.centroids);

    const response = {
      success: true,
      algorithm: algorithm,
      totalPoints: sentimentData.length,
      numClusters: clusterSummaries.length,
      dataPoints: processedResults.dataPoints,
      clusterSummaries: clusterSummaries,
      silhouetteScore: metrics.silhouetteScore,
      inertia: metrics.inertia,
      features: features.split(','),
      query: searchRequest.searchQuery,
      platform: searchRequest.platform,
      model: searchRequest.model,
      searchRequestId: id,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching clustering by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Helper Functions

/**
 * Prepare features for clustering
 */
const prepareFeatures = (data, selectedFeatures) => {
  return data.map(item => {
    const features = {};
    
    if (selectedFeatures.includes('sentiment')) {
      features.sentiment = item.sentiment || 0;
    }
    
    if (selectedFeatures.includes('engagement')) {
      features.engagement = item.engagement || 0;
    }
    
    if (selectedFeatures.includes('length')) {
      features.length = item.content ? item.content.length : 0;
    }
    
    if (selectedFeatures.includes('keywords')) {
      features.keywordDensity = calculateKeywordDensity(item.content);
    }
    
    if (selectedFeatures.includes('temporal')) {
      features.temporal = extractTemporalFeatures(item.timestamp);
    }
    
    if (selectedFeatures.includes('user')) {
      features.userScore = Math.random(); // Mock user score
    }

    return {
      ...item,
      features: Object.values(features),
      x: features.sentiment || 0,
      y: features.engagement || 0
    };
  });
};

/**
 * Perform clustering algorithm (simplified implementation)
 */
const performClusteringAlgorithm = async (featuresData, algorithm, clusters) => {
  // This is a simplified implementation
  // In production, you'd use proper ML libraries like scikit-learn via Python or ml-js
  
  const labels = featuresData.map(() => Math.floor(Math.random() * clusters));
  const centroids = Array.from({ length: clusters }, () => ({
    x: Math.random() * 2 - 1, // Random between -1 and 1
    y: Math.random() * 100    // Random between 0 and 100
  }));

  return {
    labels: labels,
    centroids: centroids,
    algorithm: algorithm
  };
};

/**
 * Process clustering results
 */
const processClusteringResults = (originalData, clusteringResult, algorithm) => {
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  const dataPoints = originalData.map((item, index) => ({
    id: index,
    content: item.content,
    sentiment: item.sentiment,
    engagement: item.engagement,
    cluster: clusteringResult.labels[index],
    x: item.sentiment || 0,
    y: item.engagement || 0,
    timestamp: item.timestamp,
    subreddit: item.subreddit,
    source: item.source,
    color: colors[clusteringResult.labels[index] % colors.length]
  }));

  return {
    dataPoints: dataPoints,
    centroids: clusteringResult.centroids
  };
};

/**
 * Generate cluster summaries
 */
const generateClusterSummaries = (dataPoints, numClusters) => {
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const clusters = [];

  for (let i = 0; i < numClusters; i++) {
    const clusterPoints = dataPoints.filter(point => point.cluster === i);
    
    if (clusterPoints.length === 0) continue;
    
    const avgSentiment = clusterPoints.reduce((sum, point) => sum + point.sentiment, 0) / clusterPoints.length;
    const avgEngagement = clusterPoints.reduce((sum, point) => sum + point.engagement, 0) / clusterPoints.length;
    
    // Extract keywords from cluster content
    const keywords = extractClusterKeywords(clusterPoints);
    
    // Generate cluster description
    const description = generateClusterDescription(avgSentiment, avgEngagement);
    
    clusters.push({
      id: i,
      name: `Cluster ${i + 1}`,
      size: clusterPoints.length,
      avgSentiment: avgSentiment,
      avgEngagement: avgEngagement,
      description: description,
      keywords: keywords.slice(0, 5),
      color: colors[i % colors.length]
    });
  }
  
  return clusters;
};

/**
 * Calculate clustering metrics
 */
const calculateClusteringMetrics = (featuresData, labels, centroids) => {
  // Simplified metrics calculation
  const silhouetteScore = Math.random() * 0.5 + 0.3; // Mock value between 0.3 and 0.8
  const inertia = Math.random() * 1000 + 100; // Mock value
  
  return {
    silhouetteScore: silhouetteScore,
    inertia: inertia
  };
};

/**
 * Helper utility functions
 */
const calculateKeywordDensity = (content) => {
  if (!content) return 0;
  const words = content.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
};

const extractTemporalFeatures = (timestamp) => {
  if (!timestamp) return 0;
  const date = new Date(timestamp);
  return date.getHours() + (date.getDay() * 24);
};

const extractClusterKeywords = (clusterPoints) => {
  const allText = clusterPoints.map(point => point.content).join(' ').toLowerCase();
  const words = allText.split(/\s+/).filter(word => word.length > 3);
  const wordCount = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

const generateClusterDescription = (sentiment, engagement) => {
  if (sentiment > 0.3 && engagement > 50) return "Highly Positive & Engaged";
  if (sentiment > 0.3 && engagement <= 50) return "Positive but Low Engagement";
  if (sentiment < -0.3 && engagement > 50) return "Negative but Engaged";
  if (sentiment < -0.3 && engagement <= 50) return "Negative & Low Engagement";
  return "Neutral Sentiment";
};

export {
  performClustering,
  getPlatforms,
  getSentimentModels,
  getAlgorithms,
  getClusteringHistory,
  getClusteringById
};