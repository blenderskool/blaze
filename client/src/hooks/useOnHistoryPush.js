import { useEffect } from 'preact/hooks';

/**
 * Subscribes to history push events
 * @param {Function} cb Callback function called when route is pushed to history
 */
function useOnHistoryPush(cb) {
  useEffect(() => {
    /**
     * TODO: Check the callback order when the hook is used in multiple places,
     * as the function would get overrided multiple times
     */
    const pushState = history.pushState;

    history.pushState = function() {
      cb();
      return pushState.apply(history, arguments);
    };

    return () => {
      history.pushState = pushState;
    }
  }, []);
}

export default useOnHistoryPush;