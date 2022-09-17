import { h } from 'preact';

import './Footer.scss';

const Footer = () => (
  <footer>
    <div style="font-weight:100">
        ©2022 - present&nbsp;
        <a href="//github.com/av4/blaze">Blazr</a> - <a href="//github.com/av4/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
        <br />
        <span style="font-size:smaller">A free share now adaptation of <a href="//blaze.vercel.com" target="_blank">Blaze</a> 
        - <a href="//github.com/blenderskool/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
        </span>
    </div>
  </footer>
);

export default Footer;
