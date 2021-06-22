import { h } from 'preact';
import PropTypes from 'prop-types';

import './Fab.scoped.scss';

function Fab({ children, text, variant, ...props }) {

  return (
    <button class={`fab ${variant}`} ariaLabel={text} {...props}>
      {children}
      <div class="lg-text">{text}</div>
      <slot />
    </button>
  );
}

Fab.propTypes = {
  variant: PropTypes.oneOf(['sm', 'lg', 'auto']),
  text: PropTypes.string,
};

Fab.defaultProps = {
  variant: 'auto',
  text: '',
};

export default Fab;