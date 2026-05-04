import { useEffect } from 'react';

const useShareTarget = (onMessageReceived) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedText = urlParams.get('text');
    const sharedTitle = urlParams.get('title');
    const sharedUrl = urlParams.get('url');

    // Combine all shared content
    const combinedMessage = [sharedTitle, sharedText, sharedUrl]
      .filter(Boolean)
      .join(' ');

    if (combinedMessage.trim()) {
      // Clear the URL params without reload
      window.history.replaceState({}, '', '/');
      // Pass message to app
      onMessageReceived(combinedMessage.trim());
    }
  }, []);
};

export default useShareTarget;
