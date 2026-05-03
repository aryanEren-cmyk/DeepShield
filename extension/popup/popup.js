document.addEventListener('DOMContentLoaded', () => {
  const stateIdle = document.getElementById('state-idle');
  const stateLoading = document.getElementById('state-loading');
  const stateResult = document.getElementById('state-result');
  const stateError = document.getElementById('state-error');

  const scannedImagePreview = document.getElementById('scanned-image-preview');
  const verdictBadge = document.getElementById('verdict-badge');
  const confidenceText = document.getElementById('confidence-text');
  const explanationText = document.getElementById('explanation-text');
  const errorMessage = document.getElementById('error-message');

  const scanAnotherBtn = document.getElementById('scan-another-btn');
  const errorResetBtn = document.getElementById('error-reset-btn');

  function showState(stateElement) {
    [stateIdle, stateLoading, stateResult, stateError].forEach(el => {
      el.classList.remove('active');
      el.classList.add('hidden');
    });
    stateElement.classList.remove('hidden');
    stateElement.classList.add('active');
  }

  function resetToIdle() {
    scannedImagePreview.src = "";
    showState(stateIdle);
  }

  scanAnotherBtn.addEventListener('click', resetToIdle);
  errorResetBtn.addEventListener('click', resetToIdle);

  // Check for pending URL
  chrome.storage.local.get(['pendingImageUrl'], (result) => {
    if (result.pendingImageUrl) {
      const imageUrl = result.pendingImageUrl;
      
      // Clear from storage immediately
      chrome.storage.local.remove(['pendingImageUrl']);
      
      // Set image preview
      scannedImagePreview.src = imageUrl;

      // Show loading
      showState(stateLoading);

      // Send POST request to backend
      fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: imageUrl })
      })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || "Failed to scan image");
        }

        // Populate result
        verdictBadge.textContent = data.verdict === 'REAL' ? '✅ REAL' : 
                                  data.verdict === 'SUSPICIOUS' ? '⚠️ SUSPICIOUS' : '❌ FAKE';
        
        verdictBadge.className = 'verdict-badge';
        if (data.verdict === 'REAL') verdictBadge.classList.add('real');
        else if (data.verdict === 'SUSPICIOUS') verdictBadge.classList.add('suspicious');
        else if (data.verdict === 'FAKE') verdictBadge.classList.add('fake');

        confidenceText.textContent = `${Math.round(data.confidence * 100)}% confidence`;
        explanationText.textContent = data.explanation;

        showState(stateResult);
      })
      .catch(error => {
        errorMessage.textContent = error.message;
        showState(stateError);
      });
    } else {
      // No URL, just show idle
      showState(stateIdle);
    }
  });
});
