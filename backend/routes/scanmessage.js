const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const { incrementStat } = require('./stats');
const router = express.Router();

const urgencyKeywords = ["urgent", "urgently", "immediately", "asap", "hurry", "right now", "emergency", "help me", "stuck"];
const financialKeywords = ["send money", "transfer", "upi", "bank account", "₹", "rs.", "rupees", "paytm", "gpay", "phonepay", "wallet", "payment", "cash", "fund"];
const impersonationKeywords = ["i am your", "this is your", "your boss", "your friend", "your brother", "your sister", "your mother", "your father", "trust me", "it's me"];

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const lowerMessage = message.toLowerCase();

    // Step 1 - Extract Signals
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex) || [];

    let urgency_detected = false;
    for (let word of urgencyKeywords) {
      if (lowerMessage.includes(word)) { urgency_detected = true; break; }
    }

    let financial_request = false;
    for (let word of financialKeywords) {
      if (lowerMessage.includes(word)) { financial_request = true; break; }
    }

    let impersonation = false;
    for (let word of impersonationKeywords) {
      if (lowerMessage.includes(word)) { impersonation = true; break; }
    }

    // Step 2 - Link Analysis
    let malicious_link_count = 0;
    let suspicious_link_count = 0;

    if (urls.length > 0 && process.env.VIRUSTOTAL_API_KEY) {
      for (let url of urls) {
        const formData = new FormData();
        formData.append('url', url);

        try {
          const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls', formData, {
            headers: {
              'x-apikey': process.env.VIRUSTOTAL_API_KEY,
              ...formData.getHeaders()
            }
          });

          const analysisId = submitResponse.data.data.id;
          await new Promise(resolve => setTimeout(resolve, 3000));

          const analysisResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
            headers: {
              'x-apikey': process.env.VIRUSTOTAL_API_KEY
            }
          });

          const stats = analysisResponse.data.data.attributes.stats;
          if (stats.malicious > 0) malicious_link_count += stats.malicious;
          if (stats.suspicious > 0) suspicious_link_count += stats.suspicious;
        } catch (vtError) {
          console.error("VirusTotal API Error inside scanmessage:", vtError.response?.data || vtError.message);
        }
      }
    }

    // Step 3 - Risk Scoring
    let risk_score = 0;
    let signals = [];

    if (urgency_detected) {
      risk_score += 20;
      signals.push("⚠️ Urgent language detected");
    }
    if (financial_request) {
      risk_score += 25;
      signals.push("💸 Financial request found");
    }
    if (impersonation) {
      risk_score += 25;
      signals.push("👤 Identity impersonation detected");
    }
    if (malicious_link_count > 0) {
      risk_score += 40;
      signals.push("🔗 Malicious link detected");
    }
    if (suspicious_link_count > 0) {
      risk_score += 20;
      signals.push("🔗 Suspicious link found");
    }
    if (urls.length > 0 && malicious_link_count === 0 && suspicious_link_count === 0) {
      risk_score += 10;
      signals.push("🔗 Link present — verify before clicking");
    }

    // cap risk_score at 100
    if (risk_score > 100) risk_score = 100;

    // Step 4 - Verdict Logic
    let verdict = "";
    if (risk_score >= 60) verdict = "SCAM LIKELY";
    else if (risk_score >= 30) verdict = "SUSPICIOUS";
    else verdict = "SAFE";

    // Step 5 - Explanation Logic
    let explanation = "";
    if (verdict === "SCAM LIKELY") {
      explanation = "This message shows multiple common scam patterns. Scammers use urgency, financial requests, and malicious links to pressure victims into quick decisions.";
    } else if (verdict === "SUSPICIOUS") {
      explanation = "This message has some warning signs. Verify the sender's identity before taking any action.";
    } else {
      explanation = "No obvious scam patterns detected. Always stay cautious with unexpected messages.";
    }

    // Step 6 - Recommended Action
    let recommended_action = "";
    if (verdict === "SCAM LIKELY") {
      recommended_action = "Do not click any links or send money. Block the sender immediately and report the message as spam.";
    } else if (verdict === "SUSPICIOUS") {
      recommended_action = "Verify the sender's identity through a different channel. Avoid clicking links or sharing personal information.";
    } else {
      recommended_action = "Message appears safe, but always verify unexpected requests.";
    }

    incrementStat('message');
    if (verdict === 'SCAM LIKELY' || verdict === 'SUSPICIOUS') {
      incrementStat('scam');
    }

    res.json({
      success: true,
      verdict,
      risk_score,
      confidence: risk_score,
      signals,
      urls_found: urls,
      explanation,
      recommended_action
    });

  } catch (error) {
    console.error("Scan Message Error:", error);
    res.status(500).json({ success: false, error: "Failed to scan message." });
  }
});

module.exports = router;
