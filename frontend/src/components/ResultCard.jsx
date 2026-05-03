import React, { useState } from 'react';

const ResultCard = ({ result, onReset }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { verdict, confidence, scores, explanation } = result;

  const getVerdictStyle = () => {
    if (verdict === 'REAL') return { bg: '#00f5a0', color: '#0f0f0f' };
    if (verdict === 'SUSPICIOUS') return { bg: '#f5c400', color: '#0f0f0f' };
    if (verdict === 'FAKE') return { bg: '#ff4d4d', color: '#ffffff' };
    return { bg: '#333', color: '#fff' };
  };

  const getMeaningText = () => {
    if (verdict === 'REAL') {
      return "This image shows no signs of AI manipulation. The pixel patterns, lighting, and facial geometry appear consistent with a genuine photograph.";
    }
    if (verdict === 'SUSPICIOUS') {
      return "Some anomalies were detected. This could be a heavily edited photo or a lower-quality AI generation. Exercise caution before sharing.";
    }
    return "Strong indicators of AI generation or deepfake manipulation were detected. This image was likely created or heavily altered by AI. Do not trust this image.";
  };

  const handleShare = () => {
    const text = `I scanned an image with DeepShield and got: ${verdict} (${Math.round(confidence * 100)}% confidence). Check your images at DeepShield.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const style = getVerdictStyle();
  const confidencePercent = Math.round(confidence * 100);
  const deepfakePercent = Math.round((scores?.deepfake || 0) * 100);
  const aiGeneratedPercent = Math.round((scores?.ai_generated || 0) * 100);

  return (
    <div className="result-card">
      <div className="verdict-badge" style={{ backgroundColor: style.bg, color: style.color }}>
        {verdict === 'REAL' && '✅ REAL'}
        {verdict === 'SUSPICIOUS' && '⚠️ SUSPICIOUS'}
        {verdict === 'FAKE' && '❌ FAKE'}
      </div>
      
      <div className="confidence-section">
        <h3>{confidencePercent}% confidence</h3>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${confidencePercent}%`, backgroundColor: style.bg }}
          ></div>
        </div>
      </div>

      <div className="scores-breakdown">
        <h4>Detailed Analysis</h4>
        <div className="score-row">
          <div className="score-label">
            <span>Deepfake Probability</span>
            <span>{deepfakePercent}%</span>
          </div>
          <div className="progress-bar-bg small">
            <div className="progress-bar-fill" style={{ width: `${deepfakePercent}%`, backgroundColor: deepfakePercent > 60 ? '#ff4d4d' : deepfakePercent > 30 ? '#f5c400' : '#00f5a0' }}></div>
          </div>
        </div>
        <div className="score-row">
          <div className="score-label">
            <span>AI Generated Probability</span>
            <span>{aiGeneratedPercent}%</span>
          </div>
          <div className="progress-bar-bg small">
            <div className="progress-bar-fill" style={{ width: `${aiGeneratedPercent}%`, backgroundColor: aiGeneratedPercent > 60 ? '#ff4d4d' : aiGeneratedPercent > 30 ? '#f5c400' : '#00f5a0' }}></div>
          </div>
        </div>
      </div>

      <div className="explanation">
        <p>{explanation}</p>
      </div>

      <div className="meaning-section">
        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          What does this mean? {expanded ? '▲' : '▼'}
        </button>
        {expanded && (
          <div className="meaning-content">
            <p>{getMeaningText()}</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="scan-another-btn" onClick={onReset}>Scan Another</button>
        <button className="share-btn" onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Result 🔗'}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
