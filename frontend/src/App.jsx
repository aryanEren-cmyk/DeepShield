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

      {error && (
        <div className="error-message" style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '1rem', borderRadius: '8px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
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
    </div>
  )
}

export default App
