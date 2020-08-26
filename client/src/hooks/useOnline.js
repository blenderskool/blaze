import { useState, useEffect } from 'preact/hooks';

/**
 * Subscribes to navigator.onLine to detect network status
 * @returns {Boolean} Whether device is online
 */
function useOnline() {
  const [isOnline, setOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNetworkStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('offline', handleNetworkStatus);
    window.addEventListener('online', handleNetworkStatus);

    return () => {
      window.removeEventListener('online', handleNetworkStatus);
      window.removeEventListener('offline', handleNetworkStatus);
    };
  }, []);
  
  return isOnline;
}

export default useOnline;
