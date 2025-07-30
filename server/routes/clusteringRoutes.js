import express from 'express';
import {
  performClustering,
  getPlatforms,
  getSentimentModels,
  getAlgorithms,
  getClusteringHistory,
  getClusteringById
} from '../controllers/clusteringController.js';

const router = express.Router();

/**
 * @route   POST /api/clustering
 * @desc    Perform clustering analysis on social media data
 * @access  Public (or Private if authentication middleware is added)
 * @body    {
 *            query: string (required),
 *            platform: string (optional, default: 'reddit'),
 *            model: string (optional, default: 'vader'),
 *            algorithm: string (optional, default: 'kmeans'),
 *            clusters: number (optional, default: 5),
 *            features: array (optional, default: ['sentiment', 'engagement'])
 *          }
 */
router.post('/', performClustering);

/**
 * @route   GET /api/clustering/platforms
 * @desc    Get available platforms for data collection
 * @access  Public
 */
router.get('/platforms', getPlatforms);

/**
 * @route   GET /api/clustering/models
 * @desc    Get available sentiment analysis models
 * @access  Public
 */
router.get('/models', getSentimentModels);

/**
 * @route   GET /api/clustering/algorithms
 * @desc    Get available clustering algorithms
 * @access  Public
 */
router.get('/algorithms', getAlgorithms);

/**
 * @route   GET /api/clustering/history
 * @desc    Get clustering analysis history based on search requests
 * @access  Public (shows user's history if authenticated, recent public ones otherwise)
 */
router.get('/history', getClusteringHistory);

/**
 * @route   GET /api/clustering/:id
 * @desc    Perform clustering analysis on existing search data by ID
 * @access  Public
 * @params  id - SearchRequest ID
 * @query   algorithm - Clustering algorithm (optional, default: 'kmeans')
 * @query   clusters - Number of clusters (optional, default: 5)
 * @query   features - Comma-separated features (optional, default: 'sentiment,engagement')
 */
router.get('/:id', getClusteringById);

/**
 * @route   GET /api/clustering/health
 * @desc    Health check endpoint for clustering service
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clustering service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @route   GET /api/clustering/export/:id
 * @desc    Export clustering results in various formats (JSON, CSV)
 * @access  Public
 * @params  id - SearchRequest ID
 * @query   format - Export format (json, csv) default: json
 * @query   algorithm - Clustering algorithm (optional, default: 'kmeans')
 * @query   clusters - Number of clusters (optional, default: 5)
 */
router.get('/export/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json', algorithm = 'kmeans', clusters = 5 } = req.query;
    
    // Get clustering data (reuse the getClusteringById logic)
    const mockRequest = { params: { id }, query: { algorithm, clusters, features: 'sentiment,engagement' } };
    const mockResponse = {
      data: null,
      status: (code) => mockResponse,
      json: (data) => { mockResponse.data = data; return mockResponse; }
    };
    
    // This is a simplified approach - in production you'd want to refactor shared logic
    if (format.toLowerCase() === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=clustering_${id}.csv`);
      
      // Mock CSV export
      const csvData = `cluster,sentiment,engagement,content\n0,0.5,75,"Sample content 1"\n1,-0.2,30,"Sample content 2"`;
      res.send(csvData);
    } else {
      // JSON export (default)
      res.status(200).json({
        success: true,
        exportFormat: format,
        searchId: id,
        exportTime: new Date().toISOString(),
        note: "Use GET /api/clustering/:id for full clustering data"
      });
    }
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export clustering results'
    });
  }
});

/**
 * Error handling middleware for clustering routes
 */
router.use((error, req, res, next) => {
  console.error('Clustering route error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error in clustering service',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

export default router;