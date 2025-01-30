import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware to enable CORS and parse JSON requests
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('I Am Running a Server');
});

app.get('/dummy', (req, res) => {
  res.send('Dummy Data Running');
});

// Route to handle form submission (POST request)
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  console.log('Received data:', { name, email });

  res.json({ message: 'Form submitted successfully!', receivedData: { name, email } });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
