import React, { useState, useEffect } from 'react';

const WhatsappSimulator = ({ initialMessage = "", onAnalyze, result = null, readOnly = false, onMessageChange = null, loading = false }) => {
  const [message, setMessage] = useState(initialMessage);
  const [inputValue, setInputValue] = useState("");
  const [isSent, setIsSent] = useState(!!initialMessage);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      setInputValue("");
      setIsSent(true);
    } else {
      setMessage("");
      setInputValue("");
      setIsSent(false);
    }
  }, [initialMessage]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessage(inputValue);
      setInputValue("");
      setIsSent(true);
      if (onMessageChange) {
        onMessageChange();
      }
    }
  };

  const getResultStyles = () => {
    if (!result) return {};
    const verdict = result.verdict || '';
    if (verdict === 'SCAM LIKELY') {
      return { bg: 'rgba(255, 77, 77, 0.15)', border: '#ff4d4d', color: '#ff4d4d', icon: '❌ SCAM LIKELY' };
    }
    if (verdict === 'SUSPICIOUS') {
      return { bg: 'rgba(245, 196, 0, 0.15)', border: '#f5c400', color: '#f5c400', icon: '⚠️ SUSPICIOUS' };
    }
    return { bg: 'rgba(0, 245, 160, 0.15)', border: '#00f5a0', color: '#00f5a0', icon: '✅ SAFE' };
  };

  const resStyle = getResultStyles();

  return (
    <div className="whatsapp-simulator">
      <div className="whatsapp-header">
        <span style={{color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>←</span>
        <div style={{width: '36px', height: '36px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'}}>
           👤
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{color: 'white', fontWeight: 'bold', fontSize: '1rem'}}>Unknown Contact</span>
          <span style={{color: '#d1d7db', fontSize: '0.8rem'}}>online</span>
        </div>
        <div style={{marginLeft: 'auto', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center'}}>⋮</div>
      </div>
      
      <div className="whatsapp-body">
        {isSent && message && (
          <div className="whatsapp-bubble">
            <div className="forwarded-label">
              <span style={{fontSize: '12px', transform: 'scaleX(-1)', display: 'inline-block'}}>➦</span> Forwarded
            </div>
            <div style={{color: '#e9edef', fontSize: '0.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
              {message}
            </div>
            <div className="bubble-time">
              10:42 AM <span style={{color: '#8696a0'}}>✓</span>
            </div>
            
            {result && (
              <div style={{
                marginTop: '10px', 
                padding: '10px', 
                borderRadius: '8px', 
                background: resStyle.bg,
                border: `1px solid ${resStyle.border}`
              }}>
                <div style={{fontWeight: 'bold', color: resStyle.color, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                   {resStyle.icon}
                </div>
                <div style={{fontSize: '0.8rem', color: '#e9edef', marginTop: '6px', lineHeight: '1.4'}}>
                   {result.explanation || "Analyzed by DeepShield"}
                </div>
              </div>
            )}
          </div>
        )}
        
        {!result && isSent && message && onAnalyze && (
          <button className="analyze-btn" onClick={() => onAnalyze(message)} disabled={loading}>
            {loading ? '⏳ Analyzing...' : '🛡️ Analyze with DeepShield'}
          </button>
        )}
      </div>

      {!readOnly && (
        <div style={{
          background: '#202c33', 
          padding: '10px', 
          display: 'flex', 
          gap: '10px',
          alignItems: 'center'
        }}>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or paste a message..." 
            style={{
              flex: 1, 
              background: '#2a3942', 
              border: 'none', 
              color: 'white', 
              padding: '10px 15px', 
              borderRadius: '20px',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            style={{
              background: inputValue.trim() ? '#00a884' : '#2a3942', 
              border: 'none', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              color: inputValue.trim() ? 'white' : '#8696a0',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'background 0.2s'
            }}
          >
            ➤
          </button>
        </div>
      )}
    </div>
  );
};

export default WhatsappSimulator;
