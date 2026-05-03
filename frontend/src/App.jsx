import { useState } from 'react'
import UploadBox from './components/UploadBox'
import ResultCard from './components/ResultCard'
import './App.css'

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResult = (data) => {
    setResult(data);
  }

  const handleError = (message) => {
    setError(message);
  }

  const resetState = () => {
    setResult(null);
    setError(null);
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🛡️ DeepShield</h1>
        <p>Detect deepfakes and AI-generated images instantly</p>
      </header>

      {/* Task 4C: Threat Awareness Banner */}
      {!result && !loading && (
        <div className="threat-banner">
          ⚠️ Deepfake fraud caused $200M+ in losses in Q1 2025 alone. Stay protected.
        </div>
      )}

      {/* Task 4A: Landing Hero Section */}
      {!result && !loading && (
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

      {!result && (
        <UploadBox 
          onResult={handleResult} 
          onError={handleError}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      {result && !loading && (
        <ResultCard result={result} onReset={resetState} />
      )}

      {/* Task 4B: How It Works Section */}
      {!result && !loading && (
        <section className="how-it-works">
          <h3>How DeepShield Works</h3>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-icon">📤</div>
              <h4>Upload or paste URL</h4>
              <p>Drop any image or paste a link from anywhere on the web</p>
            </div>
            <div className="step-card">
              <div className="step-icon">🔍</div>
              <h4>AI analyzes it</h4>
              <p>Our model scans for deepfake artifacts, GAN signatures, and manipulation patterns</p>
            </div>
            <div className="step-card">
              <div className="step-icon">✅</div>
              <h4>Get instant verdict</h4>
              <p>Receive a confidence score and clear explanation in under 2 seconds</p>
            </div>
          </div>
        </section>
      )}

      {/* Task 4D: Footer */}
      <footer className="footer">
        <p>DeepShield © 2025 — Built to fight misinformation</p>
        <p><a href="https://github.com/placeholder" target="_blank" rel="noreferrer">GitHub Repository</a></p>
        <p className="powered-by">Powered by Sightengine AI</p>
      </footer>
    </div>
  )
}

export default App
