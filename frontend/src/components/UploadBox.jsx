import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WhatsappSimulator from './WhatsappSimulator';

const UploadBox = ({ onResult, onLinkResult, onMessageResult, onError, loading, setLoading, sharedMessage, onSharedMessageHandled }) => {
  const [mode, setMode] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef(null);

  const [messageUIMode, setMessageUIMode] = useState('text');
  const [localWhatsappResult, setLocalWhatsappResult] = useState(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
      }, 800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (sharedMessage) {
      setMode('message');
      setMessageUIMode('text');
      setMessageInput(sharedMessage);
      onSharedMessageHandled();
      // Auto trigger scan after short delay
      setTimeout(() => {
        handleMessageSubmit(sharedMessage);
      }, 500);
    }
  }, [sharedMessage]);

  const testImages = [
    { label: "Test Real Photo", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gatto_europeo4.jpg/320px-Gatto_europeo4.jpg" },
    { label: "Test AI Generated", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Realistic_image_of_a_cat_%28Flux%29.jpg/320px-Realistic_image_of_a_cat_%28Flux%29.jpg" },
    { label: "Test Deepfake", url: "https://www.op.gg/images/deepfake_sample.jpg" }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        onError("Please select a valid image file.");
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onError(null);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    onError(null);
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const base64String = await fileToBase64(selectedFile);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/detect`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult({ ...response.data, imagePreview: base64String });
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = async (overrideUrl) => {
    const targetUrl = overrideUrl || urlInput;
    if (!targetUrl) return;
    setLoading(true);
    onError(null);
    setPreview(targetUrl);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/detect`, { imageUrl: targetUrl });
      onResult({ ...response.data, imagePreview: targetUrl });
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = (url) => {
    setMode('url');
    setUrlInput(url);
    handleUrlSubmit(url);
  };

  const handleLinkSubmit = async (overrideUrl) => {
    const targetUrl = overrideUrl || linkInput;
    if (!targetUrl) return;
    if (overrideUrl) {
      setMode('link');
      setLinkInput(overrideUrl);
    }
    setLoading(true);
    onError(null);
    setPreview(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/scanlink`, { url: targetUrl });
      if (onLinkResult) onLinkResult(response.data);
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSubmit = async (overrideMessage) => {
    const targetMessage = overrideMessage || messageInput;
    if (!targetMessage) return;
    if (overrideMessage) {
      setMode('message');
      setMessageUIMode('text');
      setMessageInput(overrideMessage);
    }
    setLoading(true);
    onError(null);
    setPreview(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/scanmessage`, { message: targetMessage });
      if (onMessageResult) onMessageResult(response.data);
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsappAnalyze = async (msg) => {
    setWhatsappLoading(true);
    onError(null);
    setLocalWhatsappResult(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/scanmessage`, { message: msg });
      setLocalWhatsappResult(response.data);
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setWhatsappLoading(false);
    }
  };

  const getLoadingStepText = (step) => {
    const steps = {
      message: ['Parsing message...', 'Checking links...', 'Analyzing patterns...'],
      link: ['Submitting URL to security scanners...', 'Analyzing across 70+ engines...', 'Computing threat score...'],
      default: ['Checking for GAN artifacts...', 'Analyzing facial geometry...', 'Computing confidence score...']
    };
    const key = mode === 'message' ? 'message' : mode === 'link' ? 'link' : 'default';
    return steps[key][step - 1];
  };

  const renderLoadingState = () => (
    <div className="enhanced-loading">
      {preview && (
        <div className="loading-preview-container">
          <img src={preview} alt="Scanning..." className="loading-preview" />
          <div className="scan-line"></div>
        </div>
      )}
      <div className="loading-text-container">
        <h3 className="pulsing-text">Analyzing<span>.</span><span>.</span><span>.</span></h3>
        <ul className="loading-steps">
          {[1, 2, 3].map((step) => (
            <li key={step} className={loadingStep >= step ? 'active' : ''}>
              {loadingStep >= step ? '✅' : '⏳'} {getLoadingStepText(step)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="upload-box-container">
      {loading ? (
        renderLoadingState()
      ) : (
        <>
          <div className="mode-toggle">
            <button className={mode === 'file' ? 'active' : ''} onClick={() => setMode('file')}>File Upload</button>
            <button className={mode === 'url' ? 'active' : ''} onClick={() => setMode('url')}>Image URL</button>
            <button className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')}>🔗 Scan Link</button>
            <button className={mode === 'message' ? 'active' : ''} onClick={() => setMode('message')}>💬 Scan Message</button>
          </div>

          <div className="upload-content">
            {mode === 'file' ? (
              <div className="file-mode">
                <div
                  className="drag-drop-area"
                  onClick={() => fileInputRef.current.click()}
                  onTouchStart={() => fileInputRef.current.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="placeholder">
                      <span style={{ fontSize: '3rem' }}>📁</span>
                      <p>Click or drag image to upload</p>
                      <p className="subtext">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <button className="submit-btn" onClick={handleFileSubmit}>Scan File</button>
                )}
              </div>
            ) : mode === 'url' ? (
              <div className="url-mode">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => { setUrlInput(e.target.value); setPreview(e.target.value); }}
                  placeholder="Paste image URL here..."
                  className="url-input"
                />
                {preview && mode === 'url' && urlInput && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="image-preview url-preview"
                    onError={(e) => e.target.style.display = 'none'}
                    onLoad={(e) => e.target.style.display = 'block'}
                  />
                )}
                <button className="submit-btn" onClick={() => handleUrlSubmit(null)} disabled={!urlInput}>Scan URL</button>
              </div>
            ) : mode === 'link' ? (
              <div className="link-mode">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste suspicious link here (WhatsApp, SMS, email...)"
                  className="url-input"
                />
                <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  Works with any URL — WhatsApp forwards, SMS links, email links, social media posts
                </p>
                <button className="submit-btn" onClick={() => handleLinkSubmit(null)} disabled={!linkInput}>Scan Link 🔗</button>
                <div className="quick-test-section" style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                  <p>Quick Test</p>
                  <div className="test-buttons">
                    <button className="test-btn" onClick={() => handleLinkSubmit("https://google.com")}>Test Safe Link</button>
                    <button className="test-btn" onClick={() => handleLinkSubmit("https://bbc.com")}>Test News Site</button>
                    <button className="test-btn" onClick={() => handleLinkSubmit("http://malware.testing.google.test/testing/malware/")}>Test Suspicious</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="message-mode">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
                  <button 
                    className={`demo-tab ${messageUIMode === 'text' ? 'active' : ''}`}
                    onClick={() => setMessageUIMode('text')}
                  >
                    📝 Text Mode
                  </button>
                  <button 
                    className={`demo-tab ${messageUIMode === 'whatsapp' ? 'active' : ''}`}
                    onClick={() => setMessageUIMode('whatsapp')}
                  >
                    💬 WhatsApp Mode
                  </button>
                </div>

                {messageUIMode === 'whatsapp' ? (
                  <WhatsappSimulator 
                    onAnalyze={handleWhatsappAnalyze}
                    result={localWhatsappResult}
                    loading={whatsappLoading}
                    onMessageChange={() => setLocalWhatsappResult(null)}
                  />
                ) : (
                  <>
                    <textarea
                      className="message-textarea"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={'Paste a suspicious message (WhatsApp, SMS, email)\n\nExample:\n"Hey, I lost my wallet. Please send ₹3000 urgently to this UPI: scam@upi. Check: http://bit.ly/fakehelp"'}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', marginBottom: '1rem' }}>
                      DeepShield doesn't just scan files — it understands scams.
                    </p>
                    <button className="submit-btn" onClick={() => handleMessageSubmit(null)} disabled={!messageInput}>
                      Analyze Message 🧠
                    </button>
                    <div className="quick-test-section" style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                      <p>Try a Demo Scam:</p>
                      <div className="test-buttons">
                        <button className="demo-scam-btn" onClick={() => handleMessageSubmit("Congratulations! You have been selected for a work from home job. Earn ₹50,000/month. Registration fee ₹500 only. Pay here: http://fakejobs.xyz/register. Reply ASAP!")}>
                          💼 Fake Job Offer
                        </button>
                        <button className="demo-scam-btn" onClick={() => handleMessageSubmit("Hey bro, I lost my wallet and phone. I am stuck urgently. Please send ₹3000 to this UPI immediately: friend@scam. I'll return tomorrow. Trust me it's me your friend Rahul.")}>
                          🆘 Emergency Friend Scam
                        </button>
                        <button className="demo-scam-btn" onClick={() => handleMessageSubmit("URGENT: Your SBI account will be blocked. Verify your KYC immediately at: http://sbi-verify.fake.com/kyc. Failure to verify in 24 hours will result in permanent account suspension.")}>
                          🏦 Bank Phishing
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {(mode === 'file' || mode === 'url') && (
            <div className="quick-test-section">
              <p>Quick Test</p>
              <div className="test-buttons">
                {testImages.map((img, idx) => (
                  <button key={idx} onClick={() => handleQuickTest(img.url)} className="test-btn">
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UploadBox;