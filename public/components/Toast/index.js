import Toast from './Toast.svelte';

let toast = null;

/**
 * Displays a toast with a message for some duration
 * @param {String} message Message to be shown in the Toast
 * @param {Number} duration Max duration for the Toast
 */
export default function useToast(message, duration=4000) {

  // Destroy the old Toast if it is still present
  if (toast !== null) {
    toast.$destroy();
  }

  // Create a new Toast
  toast = new Toast({
    target: document.body,
    intro: true,
    props: {
      message,
      duration
    },
  });

  // Destroy the new Toast after duration
  setTimeout(() => {
    toast.$destroy();
    toast = null;
  }, duration);
}