import { h } from 'preact';
import { CSSTransition } from 'react-transition-group';

function TransitionRoute({ children, ...props }) {
  return (
    <CSSTransition classNames="page-transition" timeout={100}{...props}>
      {children}
    </CSSTransition>
  )
}

export default TransitionRoute;
