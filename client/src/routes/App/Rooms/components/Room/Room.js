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

function RoomSecondaryAction({ className, children, onClick, ...props }) {
  return (
    <button
      className={cx('btn thin icon secondary-action', className)}
      onClick={e => {
        e.stopPropagation();
        onClick(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

RoomSecondaryAction.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

RoomSecondaryAction.defaultProps = {
  className: '',
  onClick: () => {},
};

function RoomPeers({ className, localPeers, ...props }) {
  return (
    <ul className={cx('peers secondary-action', className)} {...props}>
      {localPeers.slice(0, 3).map((peer) => <li class="peer" title={peer.name}>{peer.name[0]}</li>)}
      {localPeers.length > 3 && (
        <li class="extra">
          +
          {localPeers.length - 3}
        </li>
      )}
    </ul>
  )
}

RoomPeers.propTypes = {
  className: PropTypes.string,
  localPeers: PropTypes.array,
};

RoomPeers.defaultProps = {
  className: '',
  localPeers: [],
};

export { RoomContainer, RoomName, RoomDescription, RoomSecondaryAction, RoomPeers };
