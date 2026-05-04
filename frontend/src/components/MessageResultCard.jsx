import React, { useEffect, useState } from 'react';

const MessageResultCard = ({ result, onReset }) => {
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillWidth(result.risk_score);
    }, 100);
    return () => clearTimeout(timer);
  }, [result.risk_score]);

  const getVerdictStyle = () => {
    if (result.verdict === 'SCAM LIKELY') return { color: '#ff4d4d', shadow: '0 0 20px rgba(255,77,77,0.3)', badge: '🚨' };
    if (result.verdict === 'SUSPICIOUS') return { color: '#f5c400', shadow: '0 0 20px rgba(245,196,0,0.3)', badge: '⚠️' };
    return { color: '#00f5a0', shadow: '0 0 20px rgba(0,245,160,0.3)', badge: '✅' };
  };

  const vStyle = getVerdictStyle();

  const getMeterColor = (score) => {
    if (score >= 60) return '#ff4d4d';
    if (score >= 30) return '#f5c400';
    return '#00f5a0';
  };

  const getSignalBackground = (signal) => {
    const s = signal.toLowerCase();
    if (s.includes('urgent')) return 'rgba(245, 196, 0, 0.2)'; // yellow
    if (s.includes('financial')) return 'rgba(255, 77, 77, 0.2)'; // red
    if (s.includes('link')) return 'rgba(88, 166, 255, 0.2)'; // blue
    if (s.includes('impersonation')) return 'rgba(255, 165, 0, 0.2)'; // orange
    return '#333';
  };

  const getSignalColor = (signal) => {
    const s = signal.toLowerCase();
    if (s.includes('urgent')) return '#f5c400';
    if (s.includes('financial')) return '#ff4d4d';
    if (s.includes('link')) return '#58a6ff';
    if (s.includes('impersonation')) return '#ffa500';
    return '#fff';
  };

  const cardTint = result.verdict === 'SCAM LIKELY' ? 'rgba(255, 77, 77, 0.05)' :
                   result.verdict === 'SUSPICIOUS' ? 'rgba(245, 196, 0, 0.05)' :
                   'rgba(0, 245, 160, 0.05)';

  return (
    <div className="result-card fade-in" style={{ borderColor: vStyle.color, boxShadow: vStyle.shadow }}>
      
      <div className="verdict-badge" style={{ backgroundColor: `${vStyle.color}22`, color: vStyle.color }}>
        <span className={result.verdict === 'SCAM LIKELY' ? 'pulse-badge' : ''}>{vStyle.badge}</span> {result.verdict}
      </div>

      <div className="trust-score-section" style={{ backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong>Trust Score</strong>
          <strong style={{ color: getMeterColor(result.risk_score) }}>{result.risk_score}% Risk</strong>
        </div>
        <div className="trust-meter">
          <div 
            className="trust-meter-fill" 
            style={{ width: `${fillWidth}%`, backgroundColor: getMeterColor(result.risk_score) }}
          ></div>
        </div>
      </div>

      <div className="signals-section">
        <h3 style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>Detected Signals</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {result.signals && result.signals.length > 0 ? (
            result.signals.map((signal, idx) => (
              <span 
                key={idx} 
                className="signal-pill" 
                style={{ backgroundColor: getSignalBackground(signal), color: getSignalColor(signal) }}
              >
                {signal}
              </span>
            ))
          ) : (
            <span className="signal-pill" style={{ backgroundColor: 'rgba(0, 245, 160, 0.2)', color: '#00f5a0' }}>
              No suspicious patterns found ✅
            </span>
          )}
        </div>
      </div>

      <div className="explanation-section" style={{ borderLeft: `4px solid ${vStyle.color}`, paddingLeft: '1rem', margin: '1rem 0' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🔍 Why This Is Flagged
        </h3>
        <p style={{ margin: 0, color: '#e0e0e0', lineHeight: 1.5 }}>{result.explanation}</p>
      </div>

      <div className="action-section" style={{ backgroundColor: cardTint, padding: '1rem', borderRadius: '8px', border: `1px solid ${vStyle.color}44` }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: vStyle.color }}>
          {vStyle.badge} What Should You Do?
        </h3>
        <p style={{ margin: 0, color: '#e0e0e0', lineHeight: 1.5 }}>{result.recommended_action}</p>
      </div>

      {result.urls_found && result.urls_found.length > 0 && (
        <div className="urls-section" style={{ backgroundColor: '#242424', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem' }}>Links Found in Message</h3>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#ccc' }}>
            {result.urls_found.map((url, idx) => (
              <li key={idx} style={{ marginBottom: '0.4rem', wordBreak: 'break-all' }}>
                <code style={{ backgroundColor: '#111', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9rem' }}>{url}</code>
              </li>
            ))}
          </ul>
          <p style={{ margin: '0.8rem 0 0 0', fontSize: '0.85rem', color: '#ff4d4d' }}>⚠️ Do not click unknown links</p>
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: '0.5rem' }}>
        <button className="scan-another-btn" onClick={onReset}>
          Analyze Another Message
        </button>
        <button className="share-btn" onClick={onReset} style={{ backgroundColor: 'transparent', border: '1px solid #444', color: '#fff' }}>
          Scan an Image Instead
        </button>
      </div>
    </div>
  );
};

export default MessageResultCard;
