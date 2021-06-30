import { h } from 'preact';
import { memo } from 'preact/compat';
import { ArrowDownCircle, Gift, Grid, PieChart, Settings } from 'preact-feather';
import { Link } from 'preact-router/match';
import { useContext } from 'preact/hooks';
import { PWAInstall } from '../../contexts/PWAInstall';

import './AppLanding.scoped.scss';

const Navigation = memo(function Navigation() {
  return (
    <>
      <Link href="/app/" class="nav-item" activeClassName="active">
        <Grid />
        <span class="label">Rooms</span>
      </Link>
      <Link href="/app/activity" class="nav-item" activeClassName="active">
        <PieChart />
        <span class="label">Activity</span>
      </Link>
      <Link href="/app/settings" class="nav-item" activeClassName="active">
        <Settings />
        <span class="label">Settings</span>
      </Link>
      <Link href="/app/support" class="nav-item" activeClassName="active">
        <Gift />
        <span class="label">Support</span>
      </Link>
    </>
  )
});

function AppLanding({ children, title, subtitle }) {
  const { installable, deferredPrompt, setInstallable } = useContext(PWAInstall);

  const handleInstall = async () => {
    if (typeof window === 'undefined' || !installable || deferredPrompt === null) return;

    setInstallable(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    window.ga('send', 'event', {
      eventCategory: 'pwa-install',
      eventAction: 'promo-shown',
      outcome,
    });
  };

  return (
    <div>
      <header class="app-header">
        <div class="title-nav-wrapper">
          <h1 class="title">{title}</h1>
          <div class="nav">
            {
              installable && (
                <button class="nav-item install" title="Install Blaze" onClick={handleInstall}>
                  <ArrowDownCircle />
                  <span class="label">Install</span>
                </button>
              )
            }
            <Navigation />
          </div>
        </div>
        <p class="subtitle">{subtitle}</p>
      </header>

      {children}

      <div class="tab-links">
        <Navigation />
      </div>
    </div>
  );
};

export default AppLanding;
