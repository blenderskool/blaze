import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Menu, X, Github } from 'preact-feather';
import { Link } from 'preact-router/match';

import Pill from '../../../../components/Pill/Pill';
import { useOnHistoryPush } from '../../../../hooks';

import './Header.scss';
import pkg from '../../../../../package.json';

function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useOnHistoryPush(() => setMenuOpen(false));

  return (
    <header class="page-header" style="position:absolute;top:0px">
      <a class="brand" href="/">
        <svg width="116" height="45" viewBox="0 0 116 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M22.9605 2.76095C23.4669 3.09213 23.6792 3.73258 23.4722 4.30457L18.6418 17.6498L28.2691 18.1004C28.7823 18.1245 29.2329 18.4527 29.4171 18.9367C29.6013 19.4207 29.4842 19.9689 29.1187 20.3333L5.95621 43.4333C5.51475 43.8736 4.82565 43.9356 4.314 43.581C3.80235 43.2264 3.61229 42.5552 3.86106 41.9814L11.3706 24.6603L2.55617 24.4415C2.03534 24.4286 1.57298 24.1018 1.38305 23.6123C1.19311 23.1227 1.31265 22.566 1.68634 22.1997L21.3551 2.92012C21.7879 2.49581 22.454 2.42977 22.9605 2.76095ZM5.69874 21.9074L13.36 22.0975C13.7909 22.1082 14.1882 22.3347 14.4197 22.7016C14.6512 23.0685 14.6864 23.5276 14.5137 23.9261L8.93702 36.789L25.199 20.5709L16.762 20.1759C16.3505 20.1567 15.9728 19.9409 15.7446 19.5949C15.5165 19.249 15.4652 18.8141 15.6065 18.4237L19.1004 8.77087L5.69874 21.9074Z" fill="#3BE8B0" />
          <path d="M25.3623 3.85665C25.3623 5.5873 23.9719 6.99027 22.2567 6.99027C20.5415 6.99027 19.1511 5.5873 19.1511 3.85665C19.1511 2.12599 20.5415 0.723022 22.2567 0.723022C23.9719 0.723022 25.3623 2.12599 25.3623 3.85665Z" fill="#3BE8B0" />
          <path d="M6.21117 22.3973C6.21117 24.1279 4.82076 25.5309 3.10559 25.5309C1.39042 25.5309 0 24.1279 0 22.3973C0 20.6666 1.39042 19.2636 3.10559 19.2636C4.82076 19.2636 6.21117 20.6666 6.21117 22.3973Z" fill="#3BE8B0" />
          <path d="M8.79916 41.7213C8.79916 43.4519 7.40875 44.8549 5.69358 44.8549C3.97841 44.8549 2.58799 43.4519 2.58799 41.7213C2.58799 39.9906 3.97841 38.5877 5.69358 38.5877C7.40875 38.5877 8.79916 39.9906 8.79916 41.7213Z" fill="#3BE8B0" />
          <path d="M30.7971 19.2636C30.7971 20.9943 29.4067 22.3973 27.6915 22.3973C25.9763 22.3973 24.5859 20.9943 24.5859 19.2636C24.5859 17.533 25.9763 16.13 27.6915 16.13C29.4067 16.13 30.7971 17.533 30.7971 19.2636Z" fill="#3BE8B0" />
        </svg>
        Blazr
      </a>
      
      <button class="thin icon mobile-menu" onClick={toggleMenu} aria-label="Toggle Menu">
         {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <nav style={{ display: isMenuOpen ? 'flex' : 'none' }}>
        <Link activeClassName="active" href="/how-it-works">How it works</Link>
      </nav>
    </header>
  );
}

export default Header;
