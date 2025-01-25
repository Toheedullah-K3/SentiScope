import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('I Am Running a Server');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
