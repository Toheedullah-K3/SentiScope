import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();

// Configure CORS
app.use(cors({ 
    origin: 'http://localhost:5173',
    credentials: true
    }));

// Middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())

// routes import
import userRouter from './routes/user.route.js'
import searchRequestRouter from './routes/searchRequest.routes.js'
import clusteringRouter from './routes/clusteringRoutes.js'  

// routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/search', searchRequestRouter)
app.use('/api/clustering', clusteringRouter)


// Add a test route to verify server is working
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for debugging
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        availableRoutes: [
            'GET/POST /api/v1/users/*',
            'GET/POST /api/v1/search/*',
            'GET/POST /api/clustering/*'
        ]
    });
});

export { app }