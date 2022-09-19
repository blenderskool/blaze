import { h } from 'preact';

import './Footer.scss';

const Footer = () => (
  <footer>
    <div style="font-weight:100">
        <a class="sec-clr" href="//github.com/av4/blaze">Blazr</a> ©<span id="cpyear">2022</span> - <a class="sec-clr" href="//github.com/av4/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
        <br />
        <span style="font-size:smaller">
          A share now adaptation of <a class="sec-clr" href="//blaze.now.sh" target="_blank">Blaze</a> - <a class="sec-clr" href="//github.com/blenderskool/blaze/blob/master/LICENSE" target="_blank">MIT License</a>
          <br />
          <sup>Without the advertising and Google Analytics tracking</sup>
        </span><br />
    </div>
    <script>
      let year = (new Date).getFullYear();
      if (year > 2022) document.getElementById('cpyear').innerText = '2022 - ' + year;
    </script>
  </footer>
);

export default Footer;
