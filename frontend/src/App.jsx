import { useState, useEffect } from 'react'
import UploadBox from './components/UploadBox'
import ResultCard from './components/ResultCard'
import LinkResultCard from './components/LinkResultCard'
import HistoryPage from './components/HistoryPage'
import LandingPage from './components/LandingPage'
import { addScan } from './utils/history'
import './App.css'

function App() {
  const [result, setResult] = useState(null);
  const [linkResult, setLinkResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  const handleEnterApp = () => {
    setShowLanding(false);
    window.scrollTo(0, 0);
  };

  const handleResult = (data) => {
    addScan(data);
    setResult(data);
    if (showLanding) {
      setShowLanding(false);
      window.scrollTo(0, 0);
    }
  }

  const handleLinkResult = (data) => {
    // Optionally add link scans to history if supported, otherwise just set state
    // addScan(data); 
    setLinkResult(data);
    if (showLanding) {
      setShowLanding(false);
      window.scrollTo(0, 0);
    }
  }

  const handleError = (message) => {
    setError(message);
  }

  const resetState = () => {
    setResult(null);
    setLinkResult(null);
    setError(null);
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    resetState();
  }

  const goHome = () => {
    setShowLanding(true);
    resetState();
    setShowHistory(false);
  }

  if (showLanding) {
    return (
      <LandingPage 
        onEnterApp={handleEnterApp} 
        onResult={handleResult} 
        onError={handleError}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (
    <div className="app-container fade-in">
      <header className="header">
        <div className="header-content">
          <h1 style={{ cursor: 'pointer' }} onClick={goHome}>
            <span className="back-home-btn" style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>←</span>
            🛡️ DeepShield
          </h1>
          <button className="history-btn" onClick={toggleHistory}>
            {showHistory ? 'Back to Scan' : 'History 🕐'}
          </button>
        </div>
        <p>Detect deepfakes and AI-generated images instantly</p>
      </header>

      {showHistory ? (
        <HistoryPage onBack={toggleHistory} />
      ) : (
        <>
          {!result && !linkResult && !loading && (
            <div className="threat-banner">
              ⚠️ Deepfake fraud caused $200M+ in losses in Q1 2025 alone. Stay protected.
            </div>
          )}

          {!result && !linkResult && !loading && (
            <section className="hero-section">
              <h2>Don't Get Fooled by Deepfakes</h2>
              <p className="subheadline">Upload any image and know the truth in seconds</p>
              <div className="stat-cards">
                <div className="stat-card">
                  <span className="stat-value">8M+</span>
                  <span className="stat-label">Deepfakes online in 2025</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">96%</span>
                  <span className="stat-label">Detection accuracy</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">2s</span>
                  <span className="stat-label">Average scan time</span>
                </div>
              </div>
            </section>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!result && !linkResult && (
            <UploadBox 
              onResult={handleResult} 
              onLinkResult={handleLinkResult}
              onError={handleError}
              loading={loading}
              setLoading={setLoading}
            />
          )}

          {result && !loading && (
            <ResultCard result={result} onReset={resetState} />
          )}

          {linkResult && !loading && (
            <LinkResultCard result={linkResult} onReset={resetState} />
          )}

          {!result && !linkResult && !loading && (
            <section className="how-it-works">
              <h3>How DeepShield Works</h3>
              <div className="steps-container">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <div className="step-icon">📤</div>
                  <h4>Upload or paste URL</h4>
                  <p>Drop any image or paste a link from anywhere on the web</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <div className="step-icon">🔍</div>
                  <h4>AI analyzes it</h4>
                  <p>Our model scans for deepfake artifacts, GAN signatures, and manipulation patterns</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <div className="step-icon">✅</div>
                  <h4>Get instant verdict</h4>
                  <p>Receive a confidence score and clear explanation in under 2 seconds</p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <footer className="footer">
        <p>DeepShield © 2025 — Built to fight misinformation</p>
        <p><a href="https://github.com/aryanEren-cmyk/DeepShield" target="_blank" rel="noreferrer">GitHub Repository</a>
        </p>
        <p className="powered-by">Powered by Sightengine AI</p>
      </footer>
    </div>
  )
}

export default App