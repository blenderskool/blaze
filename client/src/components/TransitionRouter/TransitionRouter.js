import { h } from 'preact';
import { SwitchTransition } from 'react-transition-group';
import cx from 'classnames';
import Router from 'preact-router';

class TransitionRouter extends Router {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      animType: 'enter',
    };
  }

  handleRouteChange(location) {
    const nextDepth = location.url.split('/').length;
    const prevDepth = (location.previous ?? '').split('/').length;
    
    if (nextDepth > prevDepth) {
      this.setState({ animType: 'enter' });
    } else if (nextDepth < prevDepth) {
      this.setState({ animType: 'exit' })
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(location);
    }
  }

  render(props, state) {
    return (
      <div className={cx('h-full', `page-${state.animType}`)}>
        <SwitchTransition>
          {super.render({
            onChange: this.handleRouteChange.bind(this),
            ...props
            }, state)}
        </SwitchTransition>
      </div>
    );
  }
}

export default TransitionRouter;
