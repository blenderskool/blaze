import { h } from 'preact';

import './Footer.scss';

const Footer = () => (
  <footer>
    <div style="font-weight:100">
        ©2022 - present&nbsp;
        <a href="//github.com/av4/blaze">Blazr</a> - A free share now adaptation of <a href="//blaze.vercel.com" target="_blank">Blaze</a>
        <br />
        <sup>
          <a href="//github.com/blenderskool/blaze/blob/master/LICENSE" target="_blank" style="color:#888;font-weight:100">MIT License</a>
        </sup>
    </div>
  </footer>
);

export default Footer;
