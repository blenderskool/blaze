import { h } from 'preact';
import { Router, Route } from 'preact-router';

import Pages from './routes/Pages/Pages';
import App from './routes/App/App';

import './global.scss';

export default function Blaze() {

  function handleRouteChange() {
    if (typeof window === 'undefined') return;

    window.scrollTo(0, 0);
  }

  return (
    <div id="app">
      <Router onChange={handleRouteChange}>
        <Route path="/:*?" component={Pages} />
        <Route path="/app/:*?" component={App} />
      </Router>
    </div>
  );
}