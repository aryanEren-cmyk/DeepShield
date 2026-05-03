import React from 'react';
import UploadBox from './UploadBox';

const LandingPage = ({ onEnterApp, onResult, onError, loading, setLoading }) => {
  const scrollToDemo = () => {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page fade-in">
      <div className="landing-hero">
        <h1 className="gradient-text">The Truth Behind Every Image</h1>
        <p className="landing-subheadline">
          DeepShield uses advanced AI to detect deepfakes and AI-generated images in seconds — protecting you from misinformation
        </p>
        <div className="landing-cta-buttons">
          <button className="cta-primary" onClick={onEnterApp}>Start Scanning →</button>
          <button className="cta-secondary" onClick={scrollToDemo}>View Demo ↓</button>
        </div>
      </div>

      <section className="landing-section">
        <h2>Why This Matters</h2>
        <div className="problem-cards">
          <div className="problem-card">
            <div className="problem-icon">🗳️</div>
            <h3>Election Manipulation</h3>
            <p>Deepfake videos of politicians are being used to spread false information and influence voters</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">💸</div>
            <h3>Financial Fraud</h3>
            <p>$200M+ lost in Q1 2025 alone to deepfake scams targeting businesses and individuals</p>
          </div>
          <div className="problem-card">
            <div className="problem-icon">👤</div>
            <h3>Identity Theft</h3>
            <p>AI face-swap technology enables criminals to impersonate anyone convincingly</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>How DeepShield Protects You</h2>
        <div className="solution-split">
          <div className="solution-features">
            <ul>
              <li>✓ Detects GAN and diffusion model signatures</li>
              <li>✓ Analyzes facial geometry anomalies</li>
              <li>✓ Works on any image from the web</li>
              <li>✓ Chrome extension for instant verification</li>
              <li>✓ Scan history to track suspicious content</li>
            </ul>
          </div>
          <div className="solution-visual">
            <div className="mock-ui">
              <div className="mock-verdict fake">❌ FAKE</div>
              <div className="mock-confidence">98% confidence</div>
              <div className="mock-bar"><div className="mock-fill" style={{ width: '98%', backgroundColor: '#ff4d4d' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section demo-section" id="demo">
        <h2>See It In Action</h2>
        <UploadBox 
          onResult={onResult}
          onError={onError}
          loading={loading}
          setLoading={setLoading}
        />
      </section>
    </div>
  );
};

export default LandingPage;
