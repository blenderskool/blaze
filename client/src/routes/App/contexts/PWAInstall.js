import { createContext } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

const PWAInstall = createContext({
  installable: false,
  deferredPrompt: null,
  setInstallable: () => {},
});

function PWAInstallProvider({ children }) {
  const [installable, setInstallable] = useState(false);
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      // Stash the event so it can be triggered later.
      deferredPrompt.current = e;
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <PWAInstall.Provider value={{ installable, deferredPrompt: deferredPrompt.current, setInstallable }}>
      {children}
    </PWAInstall.Provider>
  );
}

export { PWAInstall, PWAInstallProvider };
