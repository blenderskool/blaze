import { useEffect, useState } from 'preact/hooks';

function selectData(key, selector) {
  if (typeof window === 'undefined') return;

  return selector(JSON.parse(window.localStorage.getItem(key)));
}

/**
 * Hook to **reactively** query an item stored in the localStorage object.
 * The hook only updates when the result of `selector` method changes.
 * 
 * @param {String} key Key of the localstorage store to be queried
 * @param {Function} selector Selector function to select items from the store
 * @returns Data queried by the `selector` method
 */
function useLocalStorageSelector(key, selector) {
  const [state, setState] = useState(selectData(key, selector));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = () => {
      const selectedData = selectData(key, selector);

      if (state !== selectedData) {
        setState(selectedData);
      }
    };

    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
  }, [key, selector, setState]);

  return state;
}

export default useLocalStorageSelector;
