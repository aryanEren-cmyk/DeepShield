const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

// Configure multer for memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const file = req.file;

    if (!imageUrl && !file) {
      return res.status(400).json({
        success: false,
        error: "Please provide either an image URL or upload an image file."
      });
    }

    let response;

    if (imageUrl) {
      // MODE 1 - Image URL
      response = await axios.get('https://api.sightengine.com/1.0/check.json', {
        params: {
          url: imageUrl,
          models: 'deepfake,genai',
          api_user: process.env.SIGHTENGINE_API_USER,
          api_secret: process.env.SIGHTENGINE_API_SECRET,
        }
      });
    } else if (file) {
      // MODE 2 - File Upload
      const FormData = require('form-data');
      const form = new FormData();
      form.append('media', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });
      form.append('models', 'deepfake,genai');
      form.append('api_user', process.env.SIGHTENGINE_API_USER);
      form.append('api_secret', process.env.SIGHTENGINE_API_SECRET);

      response = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
        headers: form.getHeaders()
      });
    }

    const data = response.data;

    // Handle Sightengine API level errors
    if (data.status !== 'success') {
      return res.status(400).json({
        success: false,
        error: data.error?.message || "Failed to analyze the image."
      });
    }

    // Extract scores
    const deepfakeScore = data.type?.deepfake || 0;
    const aiGeneratedScore = data.type?.ai_generated || 0;
    const maxScore = Math.max(deepfakeScore, aiGeneratedScore);

    // Determine verdict and explanation
    let verdict = "REAL";
    let explanation = "This image appears to be authentic with no signs of manipulation.";

    if (maxScore > 0.6) {
      verdict = "FAKE";
      explanation = "This image shows strong signs of AI manipulation or deepfake generation.";
    } else if (maxScore > 0.3) {
      verdict = "SUSPICIOUS";
      explanation = "This image has some signs of manipulation. Verify before trusting.";
    }

    const signals = [];

    if (deepfakeScore > 0.3) {
      signals.push({
        type: "deepfake",
        severity: deepfakeScore > 0.6 ? "high" : "medium",
        label: "Face manipulation detected",
        description: "Facial geometry shows signs of AI-based swapping or regeneration"
      });
    }

    if (aiGeneratedScore > 0.3) {
      signals.push({
        type: "ai_generated", 
        severity: aiGeneratedScore > 0.6 ? "high" : "medium",
        label: "AI generation signature found",
        description: "Pixel patterns consistent with diffusion models like Stable Diffusion or Midjourney"
      });
    }

    if (maxScore <= 0.3) {
      signals.push({
        type: "authentic",
        severity: "none",
        label: "Natural image patterns",
        description: "Lighting, texture and pixel distribution appear consistent with a real photograph"
      });
    }

    // Return the formatted response
    return res.json({
      success: true,
      verdict,
      confidence: maxScore,
      scores: {
        deepfake: deepfakeScore,
        ai_generated: aiGeneratedScore
      },
      explanation,
      signals
    });

  } catch (error) {
    console.error("Sightengine API Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || error.message || "An internal server error occurred while processing the image."
    });
  }
});

module.exports = router;
