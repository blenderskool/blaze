import { h } from 'preact';

import './Footer.scss';

const Footer = () => (
  <footer>
    <div style="font-weight:100">
        <a href="//github.com/av4/blaze">Blazr</a> ©<span id="cpyear">2022</span> - <a href="//github.com/av4/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
        <br />
        <span style="font-size:smaller">A free share now adaptation of <a href="//blaze.vercel.com" target="_blank">Blaze</a> 
        - <a href="//github.com/blenderskool/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
        </span>
    </div>
    <script>
      document.getElementById('cpyear').innerText = ('2022 - ' + (new Date).getFullYear()).replace('2022 - 2022', '2022');
    </script>
  </footer>
);

export default Footer;
