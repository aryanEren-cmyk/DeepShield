require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for ALL origins
app.use(express.json()); // Parse JSON request bodies

// Routes
const detectRoute = require('./routes/detect');
const scanlinkRoute = require('./routes/scanlink');
const scanmessageRoute = require('./routes/scanmessage');
const { router: statsRoute } = require('./routes/stats');

app.use('/api/detect', detectRoute);
app.use('/api/scanlink', scanlinkRoute);
app.use('/api/scanmessage', scanmessageRoute);
app.use('/api/stats', statsRoute);

// Test Endpoint (GET /api/health)
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    message: "DeepShield backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`DeepShield backend running on port ${PORT}`);
});
