import React from 'react';

const LinkResultCard = ({ result, onReset }) => {
  const { verdict, stats, scannedUrl, explanation } = result;

  const getVerdictStyle = () => {
    switch(verdict) {
      case 'SAFE': return { color: '#00f5a0', icon: '✅', label: 'SAFE', badgeClass: 'real-badge' };
      case 'SUSPICIOUS': return { color: '#f5c400', icon: '⚠️', label: 'SUSPICIOUS', badgeClass: 'suspicious-badge' };
      case 'DANGEROUS': return { color: '#ff4d4d', icon: '🚨', label: 'DANGEROUS', pulsing: true, badgeClass: 'fake-badge' };
      default: return { color: '#ccc', icon: '❓', label: 'UNKNOWN', badgeClass: '' };
    }
  };

  const vStyle = getVerdictStyle();

  const getAdvice = () => {
    switch(verdict) {
      case 'SAFE': return "This link appears safe. Always stay cautious when clicking unknown links.";
      case 'SUSPICIOUS': return "Avoid entering any personal information on this site. Do not download anything from it.";
      case 'DANGEROUS': return "Do NOT visit this link. Block the sender and report the message as spam immediately.";
      default: return "";
    }
  };

  const truncateUrl = (url) => {
    return url.length > 40 ? url.substring(0, 37) + '...' : url;
  };

  return (
    <div className={`result-card ${verdict === 'DANGEROUS' ? 'dangerous-card' : ''}`}>
      <div className={`verdict-badge ${vStyle.badgeClass}`} style={{ color: vStyle.color, fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        {vStyle.icon} {vStyle.label}
      </div>
      
      <div className="scanned-url" style={{ wordBreak: 'break-all', marginBottom: '1.5rem', padding: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <strong>Scanned URL:</strong> <br/>
        <span style={{ color: '#00f5a0' }}>{truncateUrl(scannedUrl)}</span>
      </div>

      <p className="explanation" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        {explanation}
      </p>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '1.5rem' }}>
        <div className="stat-box malicious signal-card" style={{ padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #ff4d4d', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#ff4d4d', fontWeight: 'bold' }} className="stat-value">{stats.malicious}</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Malicious</div>
        </div>
        <div className="stat-box suspicious signal-card" style={{ padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f5c400', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#f5c400', fontWeight: 'bold' }} className="stat-value">{stats.suspicious}</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Suspicious</div>
        </div>
        <div className="stat-box harmless signal-card" style={{ padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #00f5a0', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#00f5a0', fontWeight: 'bold' }} className="stat-value">{stats.harmless}</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Harmless</div>
        </div>
        <div className="stat-box signal-card" style={{ padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #888', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: '#888', fontWeight: 'bold' }} className="stat-value">{stats.undetected}</div>
          <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Undetected</div>
        </div>
      </div>

      <div className="advice-section signal-card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', borderLeft: `4px solid ${vStyle.color}` }}>
        <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem' }}>{vStyle.icon} What should I do?</strong>
        <p style={{ margin: 0, color: '#ddd' }}>{getAdvice()}</p>
      </div>

      <div className="action-buttons" style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
        <button className="scan-another-btn" onClick={() => onReset('link')} style={{ padding: '12px', width: '100%', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', color: 'white' }}>Scan Another Link</button>
        <button className="scan-another-btn" onClick={() => onReset('file')} style={{ padding: '12px', width: '100%', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', color: 'white' }}>
          Scan an Image Instead
        </button>
      </div>
    </div>
  );
};

export default LinkResultCard;
