import { useState, useEffect } from 'react';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-content">
        <span>🛡️ Install DeepShield</span>
        <p>Add to homescreen to scan WhatsApp messages directly</p>
      </div>
      <div className="install-banner-actions">
        <button onClick={handleInstall} className="install-btn">Install</button>
        <button onClick={() => setShowBanner(false)} className="dismiss-btn">✕</button>
      </div>
    </div>
  );
};

export default InstallBanner;
