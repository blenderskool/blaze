import { h } from 'preact';
import FourOFourVis from '../../../assets/images/illustrations/four-o-four.svg';

import './FourOFour.scss';

const FourOFour = () => (
  <main class="four-o-four">
    <img src={FourOFourVis} />
    <h1>Oops, this connection just broke into numbers!</h1>
    <p>Lets get you back to Blaze to start sharing some files</p>
    <a class="btn" href="/">Go to home</a>
  </main>
);

export default FourOFour;