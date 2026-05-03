import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UploadBox = ({ onResult, onError, loading, setLoading }) => {
  const [mode, setMode] = useState('file');
  const [urlInput, setUrlInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef(null);

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

  const handleFileSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    onError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onResult(response.data);
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
    setPreview(targetUrl); // For preview during loading

    try {
      const response = await axios.post('http://localhost:5000/api/detect', { imageUrl: targetUrl });
      onResult(response.data);
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
          <li className={loadingStep >= 1 ? 'active' : ''}>
            {loadingStep >= 1 ? '✅' : '⏳'} Checking for GAN artifacts...
          </li>
          <li className={loadingStep >= 2 ? 'active' : ''}>
            {loadingStep >= 2 ? '✅' : '⏳'} Analyzing facial geometry...
          </li>
          <li className={loadingStep >= 3 ? 'active' : ''}>
            {loadingStep >= 3 ? '✅' : '⏳'} Computing confidence score...
          </li>
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
          </div>

          <div className="upload-content">
            {mode === 'file' ? (
              <div className="file-mode">
                <div 
                  className="drag-drop-area" 
                  onClick={() => fileInputRef.current.click()}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="placeholder">
                      <span style={{fontSize: '3rem'}}>📁</span>
                      <p>Click or drag image to upload</p>
                      <p className="subtext">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{display: 'none'}} 
                  accept="image/jpeg, image/png, image/webp" 
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <button className="submit-btn" onClick={handleFileSubmit}>Scan File</button>
                )}
              </div>
            ) : (
              <div className="url-mode">
                <input 
                  type="text" 
                  value={urlInput} 
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setPreview(e.target.value);
                  }} 
                  placeholder="Paste image URL here..."
                  className="url-input"
                />
                {preview && mode === 'url' && urlInput && (
                   <img src={preview} alt="Preview" className="image-preview url-preview" onError={(e) => e.target.style.display='none'} onLoad={(e) => e.target.style.display='block'}/>
                )}
                <button className="submit-btn" onClick={() => handleUrlSubmit(null)} disabled={!urlInput}>Scan URL</button>
              </div>
            )}
          </div>

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
        </>
      )}
    </div>
  );
};

export default UploadBox;
