import { Router } from "express";
import { 
    performClustering,
    getPlatforms,
    getSentimentModels,
    getAlgorithms,
    getClusteringHistory,
    getClusteringById
} from "../controllers/clustering.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Main clustering analysis route - requires authentication for user-specific data
router.route('/analyze').post(VerifyJWT, performClustering);

// Get available configuration options - public routes
router.route('/platforms').get(getPlatforms);
router.route('/models').get(getSentimentModels);
router.route('/algorithms').get(getAlgorithms);

// User-specific clustering history - requires authentication
router.route('/history').get(VerifyJWT, getClusteringHistory);

// Get specific clustering analysis by ID - can be public for sharing results
router.route('/analysis/:id').get(getClusteringById);

// Alternative routes with more descriptive names
router.route('/perform-analysis').post(VerifyJWT, performClustering);
router.route('/user-history').get(VerifyJWT, getClusteringHistory);
router.route('/config/platforms').get(getPlatforms);
router.route('/config/sentiment-models').get(getSentimentModels);
router.route('/config/clustering-algorithms').get(getAlgorithms);

export default router;