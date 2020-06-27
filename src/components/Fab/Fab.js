import { h } from 'preact';

import './Fab.scss';

function Fab({ children, text, ...props }) {

  return (
    <button class="fab" ariaLabel={text} {...props}>
      {children}
      <div class="lg-text">{text}</div>
      <slot />
    </button>
  );
}

export default Fab;