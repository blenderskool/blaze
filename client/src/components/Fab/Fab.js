import { h } from 'preact';
import PropTypes from 'prop-types';
import cx from 'classnames';

import './Fab.scoped.scss';

function Fab({ children, text, variant, className, ...props }) {

  return (
    <button className={cx('btn fab', variant, className)} ariaLabel={text} {...props}>
      {children}
      <div class="lg-text">{text}</div>
      <slot />
    </button>
  );
}

Fab.propTypes = {
  variant: PropTypes.oneOf(['sm', 'lg', 'auto']),
  text: PropTypes.string,
  className: PropTypes.string,
};

Fab.defaultProps = {
  variant: 'auto',
  text: '',
  className: '',
};

export default Fab;