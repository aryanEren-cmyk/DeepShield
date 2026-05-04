import { useState, useEffect } from 'react'
import axios from 'axios'
import UploadBox from './components/UploadBox'
import ResultCard from './components/ResultCard'
import LinkResultCard from './components/LinkResultCard'
import MessageResultCard from './components/MessageResultCard'
import HistoryPage from './components/HistoryPage'
import LandingPage from './components/LandingPage'
import WhatsappSimulator from './components/WhatsappSimulator'
import LiveCounter from './components/LiveCounter'
import { addScan } from './utils/history'
import './App.css'

function App() {
  const [result, setResult] = useState(null);
  const [linkResult, setLinkResult] = useState(null);
  const [messageResult, setMessageResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  const [showWhatsappDemo, setShowWhatsappDemo] = useState(false);
  const [demoTab, setDemoTab] = useState('job');
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const demoMessages = {
    job: "Congratulations! You have been selected for a work from home job. Earn ₹50,000/month. Registration fee ₹500 only. Pay here: http://fakejobs.xyz/register. Reply ASAP!",
    friend: "Hey bro, I lost my wallet and phone. I am stuck urgently. Please send ₹3000 to this UPI immediately: friend@scam. I'll return tomorrow. Trust me it's me your friend Rahul.",
    bank: "URGENT: Your SBI account will be blocked. Verify your KYC immediately at: http://sbi-verify.fake.com/kyc. Failure to verify in 24 hours will result in permanent account suspension."
  };

  const handleDemoAnalyze = async (msg) => {
    setDemoLoading(true);
    setError(null);
    setDemoResult(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/scanmessage`, { message: msg });
      setDemoResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setDemoLoading(false);
    }
  };

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
    setLinkResult(data);
    if (showLanding) {
      setShowLanding(false);
      window.scrollTo(0, 0);
    }
  }

  const handleMessageResult = (data) => {
    setMessageResult(data);
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
    setMessageResult(null);
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
          {!result && !linkResult && !messageResult && !loading && (
            <div className="threat-banner">
              ⚠️ Deepfake fraud caused $200M+ in losses in Q1 2025 alone. Stay protected.
            </div>
          )}

          {!result && !linkResult && !messageResult && !loading && (
            <section className="hero-section">
              <h2>Don't Get Fooled by Deepfakes</h2>
              <p className="subheadline">Upload any image and know the truth in seconds</p>
            </section>
          )}

          {!result && !linkResult && !messageResult && !loading && (
            <LiveCounter />
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!result && !linkResult && !messageResult && (
            <UploadBox 
              onResult={handleResult} 
              onLinkResult={handleLinkResult}
              onMessageResult={handleMessageResult}
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

          {messageResult && !loading && (
            <MessageResultCard result={messageResult} onReset={resetState} />
          )}

          {!result && !linkResult && !messageResult && !loading && (
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
        <p className="powered-by">Powered by Sightengine AI</p>
      </footer>

      {/* Floating WhatsApp Demo Button */}
      <button className="whatsapp-float-btn" onClick={() => setShowWhatsappDemo(true)}>
        💬 Try WhatsApp Demo
      </button>

      {/* WhatsApp Modal */}
      {showWhatsappDemo && (
        <div className="whatsapp-modal-overlay" onClick={() => setShowWhatsappDemo(false)}>
          <div className="whatsapp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="whatsapp-modal-header">
              <h3 style={{ margin: 0, color: 'white' }}>See How DeepShield Protects You</h3>
              <button className="modal-close-btn" onClick={() => setShowWhatsappDemo(false)}>&times;</button>
            </div>

            <div className="demo-tabs">
              <button
                className={`demo-tab ${demoTab === 'job' ? 'active' : ''}`}
                onClick={() => { setDemoTab('job'); setDemoResult(null); }}
              >
                💼 Fake Job Offer
              </button>
              <button
                className={`demo-tab ${demoTab === 'friend' ? 'active' : ''}`}
                onClick={() => { setDemoTab('friend'); setDemoResult(null); }}
              >
                🆘 Friend Scam
              </button>
              <button
                className={`demo-tab ${demoTab === 'bank' ? 'active' : ''}`}
                onClick={() => { setDemoTab('bank'); setDemoResult(null); }}
              >
                🏦 Bank Phishing
              </button>
            </div>

            <WhatsappSimulator
              initialMessage={demoMessages[demoTab]}
              onAnalyze={handleDemoAnalyze}
              result={demoResult}
              loading={demoLoading}
              readOnly={true}
              onMessageChange={() => setDemoResult(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App