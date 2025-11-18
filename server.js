import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const currentDateTime = new Date().toLocaleString();
  res.send(`Hello World, it is ${currentDateTime}`);
});

// Only start the server if this file is run directly
//if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
//}

export default app;
