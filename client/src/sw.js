import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

import constants from '../../common/constants';

setupRouting();

const urlsToCache = getFiles();
setupPrecaching(urlsToCache);

// Cache google font stylesheets
registerRoute(
  new RegExp('^https:\/\/fonts\.googleapis\.com'),
  new StaleWhileRevalidate({
    cacheName: 'blaze-google-fonts-stylesheets',
  }),
);

// Cache google font files
registerRoute(
  new RegExp('^https:\/\/fonts\.gstatic\.com'),
  new CacheFirst({
    cacheName: 'blaze-google-fonts-webfonts',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds:  60 * 60 * 24 * 365 // An year
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  }),
);

// Cache scripts used from CDNs which don't change often
registerRoute(
  ({ url }) => (
    url.pathname.endsWith('canvas-elements.min.js') ||
    url.pathname.endsWith('webtorrent@0.108.6/webtorrent.min.js')
  ),
  new CacheFirst({
    cacheName: 'blaze-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 15, // 15 days
      }),
    ],
  }),
);

function handleShareTarget(event) {
  event.respondWith(Response.redirect('/app/?share-target'));

  event.waitUntil(async function() {
    await nextMessage(constants.SW_SHARE_READY);
    const client = await self.clients.get(event.resultingClientId);
    const data = await event.request.formData();

    client.postMessage({
      data: data.getAll('files'),
      action: constants.SW_LOAD_FILES
    });
  }());
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) return;

  if (
    url.pathname === '/app/' &&
    url.searchParams.has('share-target') &&
    event.request.method === 'POST'
  ) {
    handleShareTarget(event);
  }
});

/**
 * An implementation of nextMessage for awaiting to received messages
 * taken form squoosh.app
 */
const nextMessageResolveMap = new Map();

function nextMessage(dataVal) {
  return new Promise((resolve) => {
    if (!nextMessageResolveMap.has(dataVal)) {
      nextMessageResolveMap.set(dataVal, []);
    }
    nextMessageResolveMap.get(dataVal)?.push(resolve);
  });
}

self.addEventListener('message', (event) => {
  const resolvers = nextMessageResolveMap.get(event.data);
  if (!resolvers) return;
  nextMessageResolveMap.delete(event.data);
  for (const resolve of resolvers) resolve();
});