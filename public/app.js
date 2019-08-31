import App from './App.svelte';

const app = new App({
	target: document.body,
});

/**
 * Register service worker in the /app scope
 */
if (navigator.serviceWorker) {

  navigator.serviceWorker.register('/sw.js', { scope: '/app' })
  .then(() => {
    console.log('SW registered');
  });

}

export default app;