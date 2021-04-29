import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import FourOFourVis from '../../../assets/images/illustrations/four-o-four.svg';

import './FourOFour.scss';

const FourOFour = () => (
  <main class="four-o-four">
    <img src={FourOFourVis} />
    <h1>Oops, this connection just broke into numbers!</h1>
    <p>Let's get you back to Blaze to start sharing some files</p>
    <a class="btn" href="/">Go to home</a>
  </main>
);

const RedirectToFourOFour = () => {
  useEffect(() => {
    route('/404', true);
  }, []);

  return null;
}

export { FourOFour as default, RedirectToFourOFour };