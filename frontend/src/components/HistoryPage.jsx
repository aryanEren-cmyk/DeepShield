import React, { useState, useEffect } from 'react';
import { getHistory, clearHistory, deleteScan } from '../utils/history';

const HistoryPage = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire scan history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteScan(id);
    setHistory(getHistory());
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (history.length === 0) {
    return (
      <div className="history-page empty-state">
        <div className="empty-icon">🕐</div>
        <h2>No scans yet</h2>
        <p>Start scanning images to build your history</p>
        <button className="scan-first-btn" onClick={onBack}>Scan your first image</button>
      </div>
    );
  }

  const fakeCount = history.filter(s => s.verdict === 'FAKE').length;
  const suspiciousCount = history.filter(s => s.verdict === 'SUSPICIOUS').length;
  const realCount = history.filter(s => s.verdict === 'REAL').length;

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h2>Scan History</h2>
          <p className="scan-count">{history.length} scans total</p>
        </div>
        <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
      </div>

      <div className="history-stats">
        <div className="stat-item">
          <span className="stat-number fake-text">{fakeCount}</span>
          <span className="stat-label">FAKE</span>
        </div>
        <div className="stat-item">
          <span className="stat-number suspicious-text">{suspiciousCount}</span>
          <span className="stat-label">SUSPICIOUS</span>
        </div>
        <div className="stat-item">
          <span className="stat-number real-text">{realCount}</span>
          <span className="stat-label">REAL</span>
        </div>
      </div>

      <div className="history-grid">
        {history.map((scan) => {
          const isExpanded = expandedId === scan.id;
          const date = new Date(scan.timestamp);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const confidencePercent = Math.round(scan.confidence * 100);

          return (
            <div key={scan.id} className={`history-card ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(scan.id)}>
              <button className="delete-scan-btn" onClick={(e) => handleDelete(scan.id, e)}>🗑️</button>
              
              <div className="card-top">
                <div className="history-preview">
                  {scan.imagePreview ? (
                    <img src={scan.imagePreview} alt="Scanned" />
                  ) : (
                    <div className="placeholder-preview">🖼️</div>
                  )}
                </div>
                
                <div className="card-info">
                  <div className={`history-badge ${scan.verdict.toLowerCase()}`}>
                    {scan.verdict === 'REAL' && '✅ REAL'}
                    {scan.verdict === 'SUSPICIOUS' && '⚠️ SUSPICIOUS'}
                    {scan.verdict === 'FAKE' && '❌ FAKE'}
                  </div>
                  <div className="history-confidence">{confidencePercent}% confidence</div>
                  <div className="history-date">{formattedDate}</div>
                </div>
              </div>

              {isExpanded && (
                <div className="history-details">
                  <div className="scores-row">
                    <div>Deepfake: {Math.round(scan.scores?.deepfake * 100)}%</div>
                    <div>AI Generated: {Math.round(scan.scores?.ai_generated * 100)}%</div>
                  </div>
                  <p className="history-explanation">{scan.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPage;
