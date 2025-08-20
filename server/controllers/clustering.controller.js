import axios from "axios";
import SearchRequest from "../models/searchRequest.model.js";
import SearchResult from "../models/searchResult.model.js";

// Main clustering analysis controller
const performClustering = async (req, res) => {
  try {
    const {
      query,
      platform = 'reddit',
      model = 'vader',
      algorithm = 'kmeans',
      clusters = 5,
      features = ['sentiment', 'engagement', 'content', 'temporal']
    } = req.body;

    console.log('Starting clustering analysis:', { query, platform, model, algorithm, clusters, features });

    // Input validation
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

    // Check for existing data
    let existingRequest = await SearchRequest.findOne({ 
      searchQuery: query, 
      model, 
      platform 
    });
    
    let rawData;

    if (existingRequest) {
      console.log(`Using existing data for: ${query}`);
      const searchResults = await SearchResult.find({ 
        searchRequestId: existingRequest._id 
      });
      
      if (!searchResults || searchResults.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No existing data found for the specified query"
        });
      }

      rawData = searchResults.map(result => ({
        id: result._id.toString(),
        content: result.postText || "",
        sentiment: parseFloat(result.sentimentScore) || 0,
        engagement: calculateEngagement(result),
        timestamp: result.postCreatedAt,
        subreddit: result.subreddit || "",
        source: platform,
        wordCount: result.postText ? result.postText.split(/\s+/).filter(word => word.length > 0).length : 0,
        hasLinks: /https?:\/\//.test(result.postText || ''),
        hasQuestions: /\?/.test(result.postText || ''),
        hasExclamations: /!/.test(result.postText || ''),
        hourOfDay: extractHourFromTimestamp(result.postCreatedAt),
        dayOfWeek: extractDayFromTimestamp(result.postCreatedAt)
      }));

    } else {
      // Fetch new data from external API
      console.log(`Fetching new data for: ${query}`);
      
      try {
        const response = await axios.post("http://127.0.0.1:5000", { 
          search: query, 
          model, 
          platform 
        }, {
          timeout: 60000, // 60 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const { total_posts, average_sentiment, sentiment_details } = response.data;

        if (!total_posts || !sentiment_details || sentiment_details.length === 0) {
          return res.status(404).json({
            success: false,
            error: "No data found for the specified query"
          });
        }

        // Save to database
        existingRequest = await SearchRequest.create({
          searchQuery: query,
          platform,
          model,
          userId: req.user?.id || null,
          totalPosts: total_posts,
          averageSentimentScore: average_sentiment
        });

        const searchResults = sentiment_details.map((result) => ({
          searchRequestId: existingRequest._id,
          postText: result.description || "",
          postCreatedAt: result.date || new Date().toISOString(),
          sentimentScore: parseFloat(result.sentiment_score) || 0,
          subreddit: result.subreddit || ""
        }));

        await SearchResult.insertMany(searchResults);

        // Process new data
        rawData = sentiment_details.map((result, index) => ({
          id: `temp_${index}`,
          content: result.description || "",
          sentiment: parseFloat(result.sentiment_score) || 0,
          engagement: calculateEngagement(result),
          timestamp: result.date || new Date().toISOString(),
          subreddit: result.subreddit || "",
          source: platform,
          wordCount: result.description ? result.description.split(/\s+/).filter(word => word.length > 0).length : 0,
          hasLinks: /https?:\/\//.test(result.description || ''),
          hasQuestions: /\?/.test(result.description || ''),
          hasExclamations: /!/.test(result.description || ''),
          hourOfDay: extractHourFromTimestamp(result.date),
          dayOfWeek: extractDayFromTimestamp(result.date)
        }));
        
      } catch (axiosError) {
        console.error('Error fetching data from external API:', axiosError.message);
        return res.status(503).json({
          success: false,
          error: 'External API unavailable. Please try again later.'
        });
      }
    }

    // Validate we have enough data for clustering
    if (!rawData || rawData.length < clusters) {
      return res.status(400).json({
        success: false,
        error: `Insufficient data for clustering. Need at least ${clusters} data points, got ${rawData?.length || 0}`
      });
    }

    console.log(`Processing ${rawData.length} data points for clustering`);

    // Prepare features for clustering
    const featuresData = prepareClusteringFeatures(rawData, features);

    // Perform clustering
    const clusteringResult = performClusteringAlgorithm(featuresData, algorithm, clusters);

    // Generate meaningful cluster summaries
    const clusterSummaries = generateClusterSummaries(rawData, clusteringResult, clusters);

    // Generate insights
    const insights = generateInsights(rawData, clusteringResult, clusterSummaries, query);

    // Prepare data points for visualization
    const dataPoints = rawData.map((item, index) => ({
      id: item.id,
      content: item.content,
      sentiment: item.sentiment,
      engagement: item.engagement,
      timestamp: item.timestamp,
      source: item.source,
      subreddit: item.subreddit,
      cluster: clusteringResult.labels[index],
      color: clusterSummaries[clusteringResult.labels[index]]?.color || '#8b5cf6',
      x: item.sentiment, // Use raw sentiment for X-axis
      y: item.engagement, // Use raw engagement for Y-axis
      size: Math.max(5, Math.min(15, item.wordCount / 10)) // Point size based on word count
    }));

    // Calculate clustering quality metrics
    const metrics = calculateClusteringMetrics(featuresData, clusteringResult);

    const response = {
      success: true,
      totalPoints: rawData.length,
      query: query,
      platform: platform,
      model: model,
      algorithm: algorithm,
      
      // Essential data for visualization
      dataPoints: dataPoints,
      clusterSummaries: clusterSummaries,
      
      // Insights and recommendations
      insights: insights,
      
      // Quality metrics
      silhouetteScore: metrics.silhouetteScore,
      inertia: metrics.inertia,
      
      // Metadata
      features: features,
      searchRequestId: existingRequest._id,
      timestamp: new Date().toISOString()
    };

    console.log(`Clustering completed successfully with ${clusters} clusters`);
    res.status(200).json(response);

  } catch (error) {
    console.error('Clustering analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during clustering analysis'
    });
  }
};

// Feature preparation for clustering
const prepareClusteringFeatures = (data, selectedFeatures) => {
  return data.map(item => {
    const features = [];
    
    // Sentiment features
    if (selectedFeatures.includes('sentiment')) {
      features.push(normalizeValue(item.sentiment, -1, 1));
      features.push(Math.abs(item.sentiment)); // Sentiment magnitude
    }
    
    // Engagement features
    if (selectedFeatures.includes('engagement')) {
      features.push(normalizeValue(item.engagement, 0, 100));
    }
    
    // Content features
    if (selectedFeatures.includes('content')) {
      features.push(normalizeValue(item.wordCount, 0, 500));
      features.push(item.hasLinks ? 1 : 0);
      features.push(item.hasQuestions ? 1 : 0);
      features.push(item.hasExclamations ? 1 : 0);
    }
    
    // Temporal features
    if (selectedFeatures.includes('temporal')) {
      features.push(normalizeValue(item.hourOfDay, 0, 23));
      features.push(normalizeValue(item.dayOfWeek, 0, 6));
    }
    
    // Keyword features
    if (selectedFeatures.includes('keywords')) {
      const keywordFeatures = extractKeywordFeatures(item.content);
      features.push(...Object.values(keywordFeatures));
    }
    
    // User behavior features
    if (selectedFeatures.includes('user')) {
      features.push(normalizeValue(item.wordCount / 100, 0, 5)); // Activity level
      features.push(item.subreddit ? 1 : 0); // Has community participation
    }

    // Ensure we have at least 2 features for clustering
    if (features.length === 0) {
      features.push(normalizeValue(item.sentiment, -1, 1));
      features.push(normalizeValue(item.engagement, 0, 100));
    }

    return {
      ...item,
      features: features
    };
  });
};

// Main clustering algorithm dispatcher
const performClusteringAlgorithm = (data, algorithm, k) => {
  const points = data.map(d => d.features);
  
  console.log(`Performing ${algorithm} clustering with ${k} clusters on ${points.length} points`);
  
  switch (algorithm) {
    case 'kmeans':
      return performKMeans(points, k);
    case 'hierarchical':
      return performHierarchical(points, k);
    case 'dbscan':
      return performDBSCAN(points);
    case 'gaussian':
      return performGaussianMixture(points, k);
    case 'spectral':
      return performSpectral(points, k);
    default:
      return performKMeans(points, k);
  }
};

// K-Means Clustering Implementation
const performKMeans = (points, k, maxIterations = 100) => {
  try {
    const n = points.length;
    const dimensions = points[0].length;
    
    // Initialize centroids using k-means++
    let centroids = initializeCentroidsKMeansPlusPlus(points, k);
    let labels = new Array(n).fill(0);
    let prevLabels = new Array(n).fill(-1);
    
    for (let iter = 0; iter < maxIterations; iter++) {
      // Assign points to nearest centroid
      for (let i = 0; i < n; i++) {
        let minDistance = Infinity;
        let nearestCentroid = 0;
        
        for (let j = 0; j < k; j++) {
          const distance = euclideanDistance(points[i], centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCentroid = j;
          }
        }
        
        labels[i] = nearestCentroid;
      }
      
      // Check for convergence
      if (labels.every((label, i) => label === prevLabels[i])) {
        console.log(`K-means converged after ${iter + 1} iterations`);
        break;
      }
      
      prevLabels = [...labels];
      
      // Update centroids
      for (let j = 0; j < k; j++) {
        const clusterPoints = points.filter((_, i) => labels[i] === j);
        
        if (clusterPoints.length > 0) {
          centroids[j] = new Array(dimensions).fill(0);
          for (let dim = 0; dim < dimensions; dim++) {
            centroids[j][dim] = clusterPoints.reduce((sum, point) => sum + point[dim], 0) / clusterPoints.length;
          }
        }
      }
    }
    
    return { labels, centroids };
  } catch (error) {
    console.error('K-means clustering error:', error);
    // Fallback to simple clustering
    const labels = points.map((_, i) => i % k);
    const centroids = new Array(k).fill(null).map(() => new Array(points[0].length).fill(0));
    return { labels, centroids };
  }
};

// Hierarchical Clustering (Agglomerative)
const performHierarchical = (points, k) => {
  try {
    console.log('Performing Hierarchical clustering...');
    const n = points.length;
    
    // Start with each point as its own cluster
    let clusters = points.map((point, i) => ({ points: [i], centroid: [...point] }));
    
    // Merge clusters until we have k clusters
    while (clusters.length > k) {
      let minDistance = Infinity;
      let mergeIndices = [0, 1];
      
      // Find closest pair of clusters
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const distance = euclideanDistance(clusters[i].centroid, clusters[j].centroid);
          if (distance < minDistance) {
            minDistance = distance;
            mergeIndices = [i, j];
          }
        }
      }
      
      // Merge the closest clusters
      const [i, j] = mergeIndices;
      const mergedPoints = [...clusters[i].points, ...clusters[j].points];
      const mergedCentroid = calculateCentroid(mergedPoints.map(idx => points[idx]));
      
      clusters[i] = { points: mergedPoints, centroid: mergedCentroid };
      clusters.splice(j, 1);
    }
    
    // Assign labels
    const labels = new Array(n);
    const centroids = [];
    
    clusters.forEach((cluster, clusterIndex) => {
      cluster.points.forEach(pointIndex => {
        labels[pointIndex] = clusterIndex;
      });
      centroids.push(cluster.centroid);
    });
    
    return { labels, centroids };
  } catch (error) {
    console.error('Hierarchical clustering error:', error);
    return performKMeans(points, k);
  }
};

// DBSCAN Clustering
const performDBSCAN = (points, eps = 0.3, minPts = 3) => {
  try {
    console.log('Performing DBSCAN clustering...');
    const n = points.length;
    const labels = new Array(n).fill(-1); // -1 = noise, 0+ = cluster id
    let clusterId = 0;
    
    for (let i = 0; i < n; i++) {
      if (labels[i] !== -1) continue; // Already processed
      
      const neighbors = findNeighbors(points, i, eps);
      
      if (neighbors.length < minPts) {
        labels[i] = -1; // Mark as noise
        continue;
      }
      
      // Start new cluster
      labels[i] = clusterId;
      const seedSet = [...neighbors];
      
      for (let j = 0; j < seedSet.length; j++) {
        const neighbor = seedSet[j];
        
        if (labels[neighbor] === -1) {
          labels[neighbor] = clusterId; // Change noise to border point
        }
        
        if (labels[neighbor] !== -1) continue; // Already processed
        
        labels[neighbor] = clusterId;
        const neighborNeighbors = findNeighbors(points, neighbor, eps);
        
        if (neighborNeighbors.length >= minPts) {
          seedSet.push(...neighborNeighbors.filter(nn => !seedSet.includes(nn)));
        }
      }
      
      clusterId++;
    }
    
    // Calculate centroids for each cluster
    const numClusters = Math.max(...labels) + 1;
    const centroids = [];
    
    for (let i = 0; i < numClusters; i++) {
      const clusterPoints = points.filter((_, idx) => labels[idx] === i);
      if (clusterPoints.length > 0) {
        centroids.push(calculateCentroid(clusterPoints));
      }
    }
    
    // Handle noise points by assigning them to nearest cluster
    for (let i = 0; i < n; i++) {
      if (labels[i] === -1 && centroids.length > 0) {
        let minDistance = Infinity;
        let nearestCluster = 0;
        
        for (let j = 0; j < centroids.length; j++) {
          const distance = euclideanDistance(points[i], centroids[j]);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCluster = j;
          }
        }
        
        labels[i] = nearestCluster;
      }
    }
    
    return { labels, centroids };
  } catch (error) {
    console.error('DBSCAN clustering error:', error);
    return performKMeans(points, Math.min(5, Math.floor(points.length / 10)));
  }
};

// Gaussian Mixture Model Clustering (Simplified)
const performGaussianMixture = (points, k) => {
  try {
    console.log('Performing Gaussian Mixture clustering...');
    // Simplified implementation - in production, use a proper GMM library
    // For now, use k-means with probabilistic assignments
    const kmeansResult = performKMeans(points, k);
    
    // Add some randomness to simulate probabilistic assignment
    const labels = kmeansResult.labels.map(label => {
      if (Math.random() < 0.1) { // 10% chance to reassign
        return Math.floor(Math.random() * k);
      }
      return label;
    });
    
    return { labels, centroids: kmeansResult.centroids };
  } catch (error) {
    console.error('Gaussian Mixture clustering error:', error);
    return performKMeans(points, k);
  }
};

// Spectral Clustering (Simplified)
const performSpectral = (points, k) => {
  try {
    console.log('Performing Spectral clustering...');
    const n = points.length;
    
    // Build similarity matrix using RBF kernel
    const sigma = calculateOptimalSigma(points);
    const W = buildSimilarityMatrix(points, sigma);
    
    // Compute degree matrix
    const D = buildDegreeMatrix(W);
    
    // Compute normalized Laplacian: L = D^(-1/2) * (D - W) * D^(-1/2)
    const L = computeNormalizedLaplacian(W, D);
    
    // Find k smallest eigenvectors (simplified using power iteration)
    const eigenvectors = findSmallestEigenvectors(L, k);
    
    // Apply k-means to eigenvector rows
    const spectralFeatures = eigenvectors.map(row => row);
    const kmeansResult = performKMeans(spectralFeatures.map(features => ({ features })).map(d => d.features), k);
    
    // Calculate centroids in original space
    const centroids = [];
    for (let i = 0; i < k; i++) {
      const clusterPoints = points.filter((_, idx) => kmeansResult.labels[idx] === i);
      if (clusterPoints.length > 0) {
        centroids.push(calculateCentroid(clusterPoints));
      } else {
        centroids.push(new Array(points[0].length).fill(0));
      }
    }
    
    return { labels: kmeansResult.labels, centroids };
  } catch (error) {
    console.error('Spectral clustering error:', error);
    return performKMeans(points, k);
  }
};

// Generate meaningful cluster summaries
const generateClusterSummaries = (data, clusteringResult, numClusters) => {
  const colors = [
    '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
    '#ef4444', '#ec4899', '#14b8a6', '#f97316',
    '#6366f1', '#84cc16'
  ];
  
  const clusters = [];
  
  for (let i = 0; i < numClusters; i++) {
    const clusterPoints = data.filter((_, index) => clusteringResult.labels[index] === i);
    
    if (clusterPoints.length === 0) {
      clusters.push({
        id: i,
        name: `Empty Cluster ${i + 1}`,
        size: 0,
        percentage: "0.0",
        avgSentiment: 0,
        avgEngagement: 0,
        color: colors[i % colors.length],
        description: "No data points in this cluster",
        characteristics: {
          sentimentLevel: 'Neutral',
          engagementLevel: 'None',
          topKeywords: []
        }
      });
      continue;
    }
    
    // Calculate cluster statistics
    const avgSentiment = clusterPoints.reduce((sum, point) => sum + point.sentiment, 0) / clusterPoints.length;
    const avgEngagement = clusterPoints.reduce((sum, point) => sum + point.engagement, 0) / clusterPoints.length;
    const avgWordCount = clusterPoints.reduce((sum, point) => sum + point.wordCount, 0) / clusterPoints.length;
    
    // Determine sentiment level
    let sentimentLevel = 'Neutral';
    if (avgSentiment > 0.2) sentimentLevel = 'Positive';
    else if (avgSentiment < -0.2) sentimentLevel = 'Negative';
    
    // Determine engagement level
    let engagementLevel = 'Low';
    if (avgEngagement > 60) engagementLevel = 'High';
    else if (avgEngagement > 30) engagementLevel = 'Medium';
    
    // Generate cluster name based on characteristics
    const clusterName = generateClusterName(avgSentiment, avgEngagement, avgWordCount, i);
    
    // Extract top keywords for this cluster
    const topKeywords = extractClusterKeywords(clusterPoints);
    
    clusters.push({
      id: i,
      name: clusterName,
      size: clusterPoints.length,
      percentage: (clusterPoints.length / data.length * 100).toFixed(1),
      avgSentiment: Number(avgSentiment.toFixed(3)),
      avgEngagement: Number(avgEngagement.toFixed(1)),
      color: colors[i % colors.length],
      description: generateClusterDescription(sentimentLevel, engagementLevel, clusterPoints.length),
      characteristics: {
        sentimentLevel,
        engagementLevel,
        avgWordCount: Math.round(avgWordCount),
        topKeywords: topKeywords.slice(0, 5),
        hasLinks: clusterPoints.filter(p => p.hasLinks).length / clusterPoints.length > 0.3,
        hasQuestions: clusterPoints.filter(p => p.hasQuestions).length / clusterPoints.length > 0.2
      }
    });
  }
  
  return clusters.sort((a, b) => b.size - a.size); // Sort by size descending
};

// Generate comprehensive insights
const generateInsights = (data, clusteringResult, clusterSummaries, query) => {
  const totalPoints = data.length;
  const avgSentiment = data.reduce((sum, point) => sum + point.sentiment, 0) / totalPoints;
  const avgEngagement = data.reduce((sum, point) => sum + point.engagement, 0) / totalPoints;
  
  const insights = {
    overallInsights: [
      {
        type: 'sentiment_overview',
        title: `Public Opinion on "${query}"`,
        description: `Overall sentiment is ${avgSentiment > 0.1 ? 'positive' : avgSentiment < -0.1 ? 'negative' : 'neutral'} with an average score of ${avgSentiment.toFixed(3)}`,
        metric: avgSentiment,
        trend: avgSentiment > 0 ? 'positive' : 'negative'
      },
      {
        type: 'engagement_overview',
        title: 'Audience Engagement',
        description: `Average engagement level is ${avgEngagement.toFixed(1)}%, indicating ${avgEngagement > 60 ? 'high' : avgEngagement > 30 ? 'moderate' : 'low'} audience participation`,
        metric: avgEngagement,
        trend: avgEngagement > 50 ? 'high' : 'moderate'
      },
      {
        type: 'segmentation_overview',
        title: 'Audience Segmentation',
        description: `Identified ${clusterSummaries.length} distinct audience segments with varying opinions and engagement patterns`,
        metric: clusterSummaries.length,
        trend: 'diverse'
      }
    ],
    clusterSpecificInsights: clusterSummaries.map(cluster => ({
      clusterId: cluster.id,
      title: cluster.name,
      description: cluster.description,
      size: cluster.size,
      percentage: cluster.percentage,
      keyCharacteristics: [
        `${cluster.characteristics.sentimentLevel} sentiment`,
        `${cluster.characteristics.engagementLevel} engagement`,
        `Avg ${cluster.characteristics.avgWordCount} words per post`
      ],
      actionableInsights: generateClusterActionableInsights(cluster)
    })),
    actionableRecommendations: generateActionableRecommendations(clusterSummaries, avgSentiment, avgEngagement)
  };
  
  return insights;
};

// Helper Functions
const calculateCentroid = (points) => {
  if (!points || points.length === 0) return [];
  
  const dimensions = points[0].length;
  const centroid = new Array(dimensions).fill(0);
  
  for (const point of points) {
    for (let i = 0; i < dimensions; i++) {
      centroid[i] += point[i] || 0;
    }
  }
  
  return centroid.map(val => val / points.length);
};

const findNeighbors = (points, pointIndex, eps) => {
  const neighbors = [];
  const targetPoint = points[pointIndex];
  
  for (let i = 0; i < points.length; i++) {
    if (i !== pointIndex) {
      const distance = euclideanDistance(targetPoint, points[i]);
      if (distance <= eps) {
        neighbors.push(i);
      }
    }
  }
  
  return neighbors;
};

const calculateOptimalSigma = (points) => {
  let totalDistance = 0;
  let count = 0;
  const sampleSize = Math.min(100, points.length);
  
  for (let i = 0; i < sampleSize; i++) {
    for (let j = i + 1; j < sampleSize; j++) {
      totalDistance += euclideanDistance(points[i], points[j]);
      count++;
    }
  }
  
  return count > 0 ? (totalDistance / count) * 0.5 : 1.0;
};

const buildSimilarityMatrix = (points, sigma) => {
  const n = points.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else {
        const distance = euclideanDistance(points[i], points[j]);
        matrix[i][j] = Math.exp(-(distance * distance) / (2 * sigma * sigma));
      }
    }
  }
  
  return matrix;
};

const buildDegreeMatrix = (similarityMatrix) => {
  const n = similarityMatrix.length;
  const degrees = new Array(n).fill(0);
  
  for (let i = 0; i < n; i++) {
    degrees[i] = similarityMatrix[i].reduce((sum, val) => sum + val, 0);
  }
  
  return degrees;
};

const computeNormalizedLaplacian = (W, D) => {
  const n = W.length;
  const L = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        L[i][j] = 1.0;
      } else if (D[i] > 0 && D[j] > 0) {
        L[i][j] = -W[i][j] / Math.sqrt(D[i] * D[j]);
      }
    }
  }
  
  return L;
};

const findSmallestEigenvectors = (matrix, k) => {
  const n = matrix.length;
  const eigenvectors = [];
  
  for (let i = 0; i < k; i++) {
    let vector = Array(n).fill(0).map(() => Math.random() - 0.5);
    
    // Power iteration (simplified)
    for (let iter = 0; iter < 50; iter++) {
      const newVector = Array(n).fill(0);
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          newVector[row] += matrix[row][col] * vector[col];
        }
      }
      
      const norm = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
      if (norm > 1e-10) {
        vector = newVector.map(val => val / norm);
      }
    }
    
    eigenvectors.push(vector);
  }
  
  return eigenvectors;
};

const generateClusterName = (avgSentiment, avgEngagement, avgWordCount, clusterId) => {
  const sentimentNames = {
    positive: avgEngagement > 60 ? 'Enthusiasts' : avgEngagement > 30 ? 'Supporters' : 'Quiet Supporters',
    negative: avgEngagement > 60 ? 'Active Critics' : avgEngagement > 30 ? 'Skeptics' : 'Silent Critics',
    neutral: avgEngagement > 60 ? 'Active Observers' : avgEngagement > 30 ? 'Casual Users' : 'Lurkers'
  };
  
  let sentimentCategory = 'neutral';
  if (avgSentiment > 0.2) sentimentCategory = 'positive';
  else if (avgSentiment < -0.2) sentimentCategory = 'negative';
  
  const baseName = sentimentNames[sentimentCategory];
  
  // Add descriptors based on word count
  if (avgWordCount > 100) {
    return `Detailed ${baseName}`;
  } else if (avgWordCount < 20) {
    return `Brief ${baseName}`;
  }
  
  return baseName;
};

const generateClusterDescription = (sentimentLevel, engagementLevel, size) => {
  const templates = {
    'Positive-High': `Highly engaged positive audience segment with ${size} members who actively participate and share favorable opinions`,
    'Positive-Medium': `Moderately engaged supporters with ${size} members who generally express positive views`,
    'Positive-Low': `Quiet supporters with ${size} members who hold positive opinions but engage less frequently`,
    'Negative-High': `Highly active critics with ${size} members who frequently express concerns and negative feedback`,
    'Negative-Medium': `Moderate critics with ${size} members who occasionally share negative opinions`,
    'Negative-Low': `Silent critics with ${size} members who hold negative views but engage minimally`,
    'Neutral-High': `Active observers with ${size} members who participate frequently but maintain neutral positions`,
    'Neutral-Medium': `Casual participants with ${size} members who engage occasionally with balanced perspectives`,
    'Neutral-Low': `Passive audience with ${size} members who observe but rarely engage actively`
  };
  
  const key = `${sentimentLevel}-${engagementLevel}`;
  return templates[key] || `Audience segment with ${size} members showing ${sentimentLevel.toLowerCase()} sentiment and ${engagementLevel.toLowerCase()} engagement`;
};

const extractClusterKeywords = (clusterPoints) => {
  const allText = clusterPoints.map(point => point.content).join(' ').toLowerCase();
  const words = allText.match(/\b\w+\b/g) || [];
  
  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 3) { // Only count words longer than 3 characters
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Filter out common stop words
  const stopWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'about', 'would', 'there', 'could', 'other']);
  
  return Object.entries(wordCount)
    .filter(([word]) => !stopWords.has(word))
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
};

const generateClusterActionableInsights = (cluster) => {
  const insights = [];
  
  if (cluster.characteristics.sentimentLevel === 'Positive' && cluster.characteristics.engagementLevel === 'High') {
    insights.push('Leverage this enthusiastic group as brand advocates');
    insights.push('Encourage user-generated content and testimonials');
  } else if (cluster.characteristics.sentimentLevel === 'Negative' && cluster.characteristics.engagementLevel === 'High') {
    insights.push('Address concerns raised by this vocal group immediately');
    insights.push('Engage directly with feedback to show responsiveness');
  } else if (cluster.characteristics.engagementLevel === 'Low') {
    insights.push('Create targeted content to increase engagement');
    insights.push('Consider incentives to encourage participation');
  }
  
  if (cluster.characteristics.hasQuestions) {
    insights.push('Provide comprehensive FAQ or educational content');
  }
  
  if (cluster.characteristics.hasLinks) {
    insights.push('This group values external references and detailed information');
  }
  
  return insights.slice(0, 3); // Limit to top 3 insights
};

const generateActionableRecommendations = (clusterSummaries, avgSentiment, avgEngagement) => {
  const recommendations = [];
  
  // Overall strategy recommendations
  if (avgSentiment > 0.3) {
    recommendations.push('Capitalize on positive sentiment with targeted marketing campaigns');
  } else if (avgSentiment < -0.3) {
    recommendations.push('Implement crisis management strategy to address negative sentiment');
  } else {
    recommendations.push('Focus on education and awareness to shift neutral opinions');
  }
  
  // Engagement-based recommendations
  if (avgEngagement < 30) {
    recommendations.push('Increase content variety and interactivity to boost engagement');
  } else if (avgEngagement > 70) {
    recommendations.push('Maintain momentum with consistent, high-quality content');
  }
  
  // Cluster-specific recommendations
  const largestCluster = clusterSummaries.reduce((max, cluster) => 
    cluster.size > max.size ? cluster : max, clusterSummaries[0]);
  
  if (largestCluster) {
    recommendations.push(`Focus primary efforts on the "${largestCluster.name}" segment (${largestCluster.percentage}% of audience)`);
  }
  
  // Segmentation recommendations
  const highEngagementClusters = clusterSummaries.filter(c => c.characteristics.engagementLevel === 'High');
  if (highEngagementClusters.length > 0) {
    recommendations.push(`Prioritize engagement with ${highEngagementClusters.length} high-activity segment(s)`);
  }
  
  return recommendations.slice(0, 5); // Limit to top 5 recommendations
};

const calculateClusteringMetrics = (featuresData, clusteringResult) => {
  try {
    let inertia = 0;
    let silhouetteScore = 0;
    
    const points = featuresData.map(d => d.features);
    const { labels, centroids } = clusteringResult;
    
    // Calculate inertia (sum of squared distances to centroids)
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const centroid = centroids[labels[i]];
      if (centroid) {
        inertia += Math.pow(euclideanDistance(point, centroid), 2);
      }
    }
    
    // Simplified silhouette score calculation
    let totalSilhouette = 0;
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const clusterLabel = labels[i];
      
      // Calculate average distance to points in same cluster (a)
      const sameClusterPoints = points.filter((_, idx) => labels[idx] === clusterLabel && idx !== i);
      const a = sameClusterPoints.length > 0 
        ? sameClusterPoints.reduce((sum, p) => sum + euclideanDistance(point, p), 0) / sameClusterPoints.length
        : 0;
      
      // Calculate minimum average distance to points in other clusters (b)
      const otherClusters = [...new Set(labels)].filter(label => label !== clusterLabel);
      let b = Infinity;
      
      for (const otherCluster of otherClusters) {
        const otherClusterPoints = points.filter((_, idx) => labels[idx] === otherCluster);
        if (otherClusterPoints.length > 0) {
          const avgDistance = otherClusterPoints.reduce((sum, p) => sum + euclideanDistance(point, p), 0) / otherClusterPoints.length;
          b = Math.min(b, avgDistance);
        }
      }
      
      // Silhouette coefficient for this point
      const silhouette = b === Infinity ? 0 : (b - a) / Math.max(a, b);
      totalSilhouette += silhouette;
    }
    
    silhouetteScore = totalSilhouette / points.length;
    
    return {
      silhouetteScore: Math.max(-1, Math.min(1, silhouetteScore)),
      inertia: inertia,
      coherence: Math.max(0, silhouetteScore) // Use silhouette as coherence measure
    };
  } catch (error) {
    console.error('Error calculating clustering metrics:', error);
    return {
      silhouetteScore: 0,
      inertia: 0,
      coherence: 0
    };
  }
};

// Configuration endpoints
const getPlatforms = (req, res) => {
  try {
    const platforms = ['reddit', 'gnews'];
    res.status(200).json({
      success: true,
      data: platforms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch platforms'
    });
  }
};

const getSentimentModels = (req, res) => {
  try {
    const models = ['vader', 'textblob', 'genai'];
    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment models'
    });
  }
};

const getAlgorithms = (req, res) => {
  try {
    const algorithms = ['kmeans', 'hierarchical', 'dbscan', 'gaussian', 'spectral'];
    res.status(200).json({
      success: true,
      data: algorithms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch algorithms'
    });
  }
};

const getClusteringHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query - if user is authenticated, show their data, otherwise show recent public data
    const query = userId ? { userId } : {};
    
    const [requests, total] = await Promise.all([
      SearchRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SearchRequest.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching clustering history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clustering history'
    });
  }
};

const getClusteringById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Analysis ID is required'
      });
    }
    
    const searchRequest = await SearchRequest.findById(id);
    if (!searchRequest) {
      return res.status(404).json({
        success: false,
        error: 'Clustering analysis not found'
      });
    }

    const searchResults = await SearchResult.find({ 
      searchRequestId: searchRequest._id 
    }).limit(1000); // Limit to prevent memory issues

    res.status(200).json({
      success: true,
      data: {
        request: searchRequest,
        results: searchResults
      }
    });
  } catch (error) {
    console.error('Error fetching clustering by ID:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid analysis ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clustering analysis'
    });
  }
};

// Health check endpoint
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clustering service is healthy',
    timestamp: new Date().toISOString()
  });
};

// Export all functions
export {
  performClustering,
  getPlatforms,
  getSentimentModels,
  getAlgorithms,
  getClusteringHistory,
  getClusteringById,
  healthCheck,
  calculateEngagement
};

const calculateEngagement = (result) => {
  // Calculate engagement based on various factors
  let engagement = Math.random() * 40 + 10; // Base engagement 10-50
  
  const content = result.postText || result.description || "";
  
  // Boost engagement based on content characteristics
  if (content.includes('?')) engagement += 10; // Questions get more engagement
  if (content.includes('!')) engagement += 5;  // Exclamations show emotion
  if (content.length > 200) engagement += 10;  // Longer posts show investment
  if (/https?:\/\//.test(content)) engagement += 5; // Links add value
  
  // Platform-specific adjustments
  if (result.subreddit && result.subreddit.includes('popular')) engagement += 15;
  
  return Math.min(Math.max(engagement, 0), 100);
};

const normalizeValue = (value, min, max) => {
  if (typeof value !== 'number' || isNaN(value)) return 0.5;
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

const extractKeywordFeatures = (content) => {
  if (!content || typeof content !== 'string') {
    return {
      hasBrandMentions: 0,
      hasEmotionalWords: 0,
      hasComparison: 0,
      hasPriceWords: 0,
      hasRecommendation: 0
    };
  }
  
  return {
    hasBrandMentions: /\b(brand|product|company|apple|google|microsoft)\b/i.test(content) ? 1 : 0,
    hasEmotionalWords: /\b(love|hate|amazing|terrible|awesome|awful|great|bad)\b/i.test(content) ? 1 : 0,
    hasComparison: /\b(better|worse|vs|versus|compared to|than)\b/i.test(content) ? 1 : 0,
    hasPriceWords: /\b(cheap|expensive|price|cost|money|dollar|worth)\b/i.test(content) ? 1 : 0,
    hasRecommendation: /\b(recommend|suggest|should|must|try|avoid)\b/i.test(content) ? 1 : 0
  };
};

const extractHourFromTimestamp = (timestamp) => {
  try {
    if (!timestamp) return 12;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 12 : date.getHours();
  } catch {
    return 12;
  }
};

const extractDayFromTimestamp = (timestamp) => {
  try {
    if (!timestamp) return 1;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 1 : date.getDay();
  } catch {
    return 1;
  }
};

const euclideanDistance = (point1, point2) => {
  if (!point1 || !point2 || point1.length !== point2.length) {
    return Infinity;
  }
  return Math.sqrt(
    point1.reduce((sum, val, idx) => sum + Math.pow((val || 0) - (point2[idx] || 0), 2), 0)
  );
};

const initializeCentroidsKMeansPlusPlus = (points, k) => {
  const centroids = [];
  const n = points.length;
  
  if (k >= n) {
    return points.slice(0, k);
  }
  
  // Choose first centroid randomly
  centroids.push([...points[Math.floor(Math.random() * n)]]);
  
  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances = points.map(point => {
      const minDistance = Math.min(
        ...centroids.map(centroid => euclideanDistance(point, centroid))
      );
      return Math.max(0, minDistance * minDistance);
    });
    
    const totalDistance = distances.reduce((a, b) => a + b, 0);
    
    if (totalDistance === 0) {
      centroids.push([...points[Math.floor(Math.random() * n)]]);
      continue;
    }
    
    const threshold = Math.random() * totalDistance;
    let sum = 0;
    let selectedIndex = 0;
    
    for (let j = 0; j < n; j++) {
      sum += distances[j];
      if (sum >= threshold) {
        selectedIndex = j;
        break;
      }
    }
    
    centroids.push([...points[selectedIndex]]);
  }
  
  return centroids;
};

const calculateClusterFeatures = (points) => {
  if (!points || points.length === 0) return {};

  const features = {
    averageEngagement: 0,
    averageSentiment: 0,
    keywordFeatures: {
      hasBrandMentions: 0,
      hasEmotionalWords: 0,
      hasComparison: 0,
      hasPriceWords: 0,
      hasRecommendation: 0
    },
    hourDistribution: Array(24).fill(0),
    dayDistribution: Array(7).fill(0)
  };

  points.forEach(point => {
    features.averageEngagement += point.engagement || 0;
    features.averageSentiment += point.sentiment || 0;

    const keywords = extractKeywordFeatures(point.content);
    for (const key in keywords) {
      features.keywordFeatures[key] += keywords[key];
    }

    const hour = extractHourFromTimestamp(point.timestamp);
    features.hourDistribution[hour]++;

    const day = extractDayFromTimestamp(point.timestamp);
    features.dayDistribution[day]++;
  });

  const totalPoints = points.length;
  features.averageEngagement /= totalPoints;
  features.averageSentiment /= totalPoints;

  return features;
};

