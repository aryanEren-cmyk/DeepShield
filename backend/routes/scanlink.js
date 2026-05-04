const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const { incrementStat } = require('./stats');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || url.trim() === "") {
      return res.status(400).json({ success: false, error: "URL is required" });
    }

    // DEMO MODE - hardcoded for presentation
    if (url === 'http://demo-test.deepshield.com') {
      incrementStat('link');
      incrementStat('scam');
      return res.json({
        success: true,
        verdict: "SUSPICIOUS",
        stats: { malicious: 2, suspicious: 5, undetected: 60, harmless: 10 },
        scannedUrl: url,
        explanation: "This link shows suspicious signals across multiple security engines. Proceed with caution and avoid entering personal information."
      });
    }

    if (url === 'http://danger-test.deepshield.com') {
      incrementStat('link');
      incrementStat('scam');
      return res.json({
        success: true,
        verdict: "DANGEROUS",
        stats: { malicious: 8, suspicious: 3, undetected: 45, harmless: 5 },
        scannedUrl: url,
        explanation: "This link was flagged as malicious by multiple security engines. Do not visit this URL."
      });
    }

    // Step 1: Submit URL to VirusTotal
    const formData = new FormData();
    formData.append('url', url);

    const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls', formData, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY,
        ...formData.getHeaders()
      }
    });

    const analysisId = submitResponse.data.data.id;

    // Wait 3 seconds for analysis to complete
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Step 2: Get analysis results
    const analysisResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY
      }
    });

    const stats = analysisResponse.data.data.attributes.stats;

    // Verdict Logic
    let verdict = "SAFE";
    if (stats.malicious > 3) {
      verdict = "DANGEROUS";
    } else if (stats.malicious > 0 || stats.suspicious > 2) {
      verdict = "SUSPICIOUS";
    } else {
      verdict = "SAFE";
    }

    // Explanation Logic
    let explanation = "";
    if (verdict === "DANGEROUS") {
      explanation = "This link was flagged as malicious by multiple security engines. Do not visit this URL.";
    } else if (verdict === "SUSPICIOUS") {
      explanation = "This link shows some suspicious signals. Proceed with caution and avoid entering personal information.";
    } else if (verdict === "SAFE") {
      explanation = "This link appears safe with no malicious signals detected across security scanners.";
    }

    incrementStat('link');
    if (verdict === 'DANGEROUS' || verdict === 'SUSPICIOUS') {
      incrementStat('scam');
    }

    res.json({
      success: true,
      verdict,
      stats,
      scannedUrl: url,
      explanation
    });

  } catch (error) {
    console.error("VirusTotal API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.error?.message || "Failed to scan link. Please try again." 
    });
  }
});

module.exports = router;