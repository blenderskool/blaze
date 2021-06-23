import { h } from 'preact';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { X } from 'preact-feather';

import './Room.scoped.scss';

function RoomContainer({ as, className, highlighted, ...props }) {
  const Tag = as;
  return <Tag className={cx('room', { highlighted }, className)} {...props} />;
}

RoomContainer.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
  highlighted: PropTypes.bool,
};

RoomContainer.defaultProps = {
  as: 'div',
  className: '',
  highlighted: false,
};

function RoomName({ as, className, ...props }) {
  const Tag = as;
  return <Tag className={cx('room-name', className)} {...props} />;
}

RoomName.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
};

RoomName.defaultProps = {
  as: 'div',
  className: '',
};


function RoomDescription({ as, className, ...props }) {
  const Tag = as;
  return <Tag className={cx('room-description', className)} {...props} />;
}

RoomDescription.propTypes = {
  as: PropTypes.string,
  className: PropTypes.string,
};

RoomDescription.defaultProps = {
  as: 'div',
  className: '',
};

function RoomDeleteButton({ className, ...props }) {
  return (
    <button className={cx('btn thin icon remove-room', className)} aria-label="Remove room" {...props}>
      <X />
    </button>
  );
}

RoomDeleteButton.propTypes = {
  className: PropTypes.string,
};

RoomDeleteButton.defaultProps = {
  className: '',
};

export { RoomContainer, RoomName, RoomDescription, RoomDeleteButton };
