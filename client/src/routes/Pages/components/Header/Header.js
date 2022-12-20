import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Menu, X, Github } from 'preact-feather';
import { Link } from 'preact-router/match';

import logo from '../../../../assets/images/logo.svg';
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
    <header class="page-header">
      <a class="brand" href="/">
        <img src={logo} alt="Blaze" />
        <Pill>v{pkg.version}</Pill>
      </a>

      <button
        class="btn thin icon mobile-menu"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <nav style={{ display: isMenuOpen ? 'flex' : 'none' }}>
        <Link activeClassName="active" href="/how-it-works">
          How it works
        </Link>
        <a href="https://github.com/blenderskool/blaze">
          GitHub&nbsp;
          <Github size={16} style="margin-bottom: 4px" />
        </a>
        <a href="https://www.buymeacoffee.com/akashhamirwasia">Donate</a>
        <a
          class="ph-desktop"
          href="https://www.producthunt.com/posts/blaze-2?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-blaze-2"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=174403&theme=dark&period=daily"
            alt="Blaze - Fast peer to peer file sharing web app ⚡ | Product Hunt Embed"
            style="width: 250px; height: 54px;"
            width="250px"
            height="54px"
          />
        </a>
      </nav>
    </header>
  );
}

export default Header;
