import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';



const app = express();

// Configure CORS
app.use(cors({ origin: 'http://localhost:5173' }));


// Middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(express.json())



app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  console.log('Received data:', { name, email });

  res.json({ message: 'Form submitted successfully!', receivedData: { name, email } });
});


// routes import


// routes


export { app }