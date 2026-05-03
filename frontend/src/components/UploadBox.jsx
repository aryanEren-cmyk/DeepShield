import React, { useState, useRef } from 'react';
import axios from 'axios';
import Loader from './Loader';

const UploadBox = ({ onResult, onError, loading, setLoading }) => {
  const [mode, setMode] = useState('file'); // 'file' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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

    try {
      const response = await axios.post('http://localhost:5000/api/detect', { imageUrl: targetUrl });
      onResult(response.data);
    } catch (err) {
      onError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = (url) => {
    setMode('url');
    setUrlInput(url);
    handleUrlSubmit(url);
  };

  return (
    <div className="upload-box-container">
      <div className="mode-toggle">
        <button className={mode === 'file' ? 'active' : ''} onClick={() => setMode('file')}>File Upload</button>
        <button className={mode === 'url' ? 'active' : ''} onClick={() => setMode('url')}>Image URL</button>
      </div>

      <div className="upload-content">
        {loading ? (
          <Loader />
        ) : mode === 'file' ? (
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
              onChange={(e) => setUrlInput(e.target.value)} 
              placeholder="Paste image URL here..."
              className="url-input"
            />
            <button className="submit-btn" onClick={() => handleUrlSubmit(null)} disabled={!urlInput}>Scan URL</button>
          </div>
        )}
      </div>

      {!loading && (
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

      <style>{`
        .upload-box-container {
          background-color: #1a1a1a;
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mode-toggle {
          display: flex;
          background-color: #0f0f0f;
          border-radius: 8px;
          overflow: hidden;
        }
        .mode-toggle button {
          flex: 1;
          padding: 1rem;
          border: none;
          background: none;
          color: #a0a0a0;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .mode-toggle button.active {
          background-color: #333;
          color: #fff;
        }
        .drag-drop-area {
          border: 2px dashed #444;
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background-color: #111;
        }
        .drag-drop-area:hover {
          border-color: #00f5a0;
          background-color: rgba(0, 245, 160, 0.05);
        }
        .image-preview {
          max-width: 100%;
          max-height: 250px;
          border-radius: 8px;
        }
        .placeholder p { margin: 0.5rem 0 0 0; }
        .placeholder .subtext { color: #666; font-size: 0.9rem; }
        .url-mode {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .url-input {
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #444;
          background-color: #111;
          color: white;
          font-size: 1rem;
        }
        .url-input:focus {
          outline: none;
          border-color: #00f5a0;
        }
        .submit-btn {
          background-color: #00f5a0;
          color: #0f0f0f;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 1rem;
        }
        .submit-btn:disabled {
          background-color: #333;
          color: #666;
          cursor: not-allowed;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #00e090;
        }
        .quick-test-section {
          margin-top: 1rem;
          border-top: 1px solid #333;
          padding-top: 1rem;
        }
        .quick-test-section p {
          color: #a0a0a0;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .test-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .test-btn {
          background-color: #2a2a2a;
          color: #ddd;
          border: 1px solid #444;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .test-btn:hover {
          background-color: #333;
          border-color: #666;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default UploadBox;
