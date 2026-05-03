import React from 'react';

const ResultCard = ({ result, onReset }) => {
  const { verdict, confidence, scores, explanation } = result;

  const getVerdictStyle = () => {
    if (verdict === 'REAL') return { bg: '#00f5a0', color: '#0f0f0f' };
    if (verdict === 'SUSPICIOUS') return { bg: '#f5c400', color: '#0f0f0f' };
    if (verdict === 'FAKE') return { bg: '#ff4d4d', color: '#ffffff' };
    return { bg: '#333', color: '#fff' };
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

      <div className="scores-section">
        <div className="score-item">
          <span>Deepfake Score</span>
          <span>{deepfakePercent}%</span>
        </div>
        <div className="score-item">
          <span>AI Generated Score</span>
          <span>{aiGeneratedPercent}%</span>
        </div>
      </div>

      <div className="explanation">
        <p>{explanation}</p>
      </div>

      <button className="scan-another-btn" onClick={onReset}>Scan Another Image</button>

      <style>{`
        .result-card {
          background-color: #1a1a1a;
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .verdict-badge {
          padding: 1rem;
          border-radius: 8px;
          font-size: 2rem;
          font-weight: bold;
          text-align: center;
        }
        .confidence-section h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }
        .progress-bar-bg {
          width: 100%;
          height: 12px;
          background-color: #333;
          border-radius: 6px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          transition: width 1s ease-in-out;
        }
        .scores-section {
          background-color: #242424;
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .score-item {
          display: flex;
          justify-content: space-between;
          font-size: 1rem;
          color: #ccc;
        }
        .explanation {
          font-size: 1.1rem;
          line-height: 1.5;
          text-align: center;
          color: #e0e0e0;
        }
        .scan-another-btn {
          padding: 1rem;
          border: none;
          border-radius: 8px;
          background-color: #333;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .scan-another-btn:hover {
          background-color: #444;
        }
      `}</style>
    </div>
  );
};

export default ResultCard;
