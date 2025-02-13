import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from "morgan"


const app = express();

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// Middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())
// Request Updates
app.use(morgan("dev"))



// routes import
import userRouter from './routes/user.route.js'

// routes
app.use('/api/v1/users', userRouter)

export { app }