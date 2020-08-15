import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './components/Header/Header';
import Home from './Home/Home';

import './Pages.scss';

export default function Pages() {

  return (
    <div class="page-container">
      <Header />
      <Router>
        <Home path="/" />
      </Router>
    </div>
  );
}
