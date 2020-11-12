import { h } from 'preact';

import './Footer.scss';

const Footer = () => (
  <footer>
    <div>
      <a href="https://bit.ly/36uX8oU" aria-label="DigitalOcean" target="_blank" rel="noreferrer">
        <img class="digital-ocean" src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_white.svg" alt="Powered by DigitalOcean"/>
      </a>
    </div>

    <div>
      <span>
        © 2018 - 2020&nbsp;
        <a href="https://github.com/blenderskool" target="_blank" rel="noreferrer">
          Akash Hamirwasia
        </a>
        .&nbsp;
      </span>
      <span>
        Released under the
        <a href="https://github.com/blenderskool/blaze/blob/master/LICENSE" target="_blank" rel="noreferrer"> MIT License</a>
      </span>
      <div>
        Designed & Developed in 🇮🇳
      </div>
    </div>
  </footer>
);

export default Footer;
