import { h } from 'preact';
import { Router, Route } from 'preact-router';

import Pages from './routes/Pages/Pages';
import App from './routes/App/App';

import './global.scss';

export default function Blaze() {

  return (
    <div id="app">
      <Router>
        <Route path="/:*?" component={Pages} />
        <Route path="/app/:*?" component={App} />
      </Router>
    </div>
  );
}