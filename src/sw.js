import { getFiles, setupPrecaching, setupRouting } from 'preact-cli/sw';
import constants from '../constants';

setupRouting();

// TODO: Improve caching
const urlsToCache = getFiles();
setupPrecaching(urlsToCache);

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