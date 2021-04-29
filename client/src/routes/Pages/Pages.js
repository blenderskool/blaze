import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './Home/Home';
import Working from './Working/Working';
import FourOFour, { RedirectToFourOFour } from './FourOFour/FourOFour';

import './Pages.scss';

export default function Pages() {

  return (
    <div class="page-container">
      <Header />
      <Router>
        <Home path="/" />
        <Working path="/how-it-works" />
        <FourOFour path="/404" />
        <RedirectToFourOFour default />
      </Router>
      <Footer />
    </div>
  );
}
