const staticCacheName = 'blaze-static-v4';

self.addEventListener('install', event => {

  /**
   * Caching the required resources
   */
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {

      return cache.addAll([
        'app',
        'css/styles.css',
        'css/font.css',
        'js/app.js',
        'images/noise.png',
        // Icon Fonts
        'fonts/icomoon.eot#iefix',
        'fonts/icomoon.svg#icomoon',
        'fonts/icomoon.ttf',
        'fonts/icomoon.woff',
        // Fonts
        'https://fonts.googleapis.com/css?family=Rubik:400,500',
        'https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nFrXyw023e1Ik.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nDrXyw023e1Ik.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nPrXyw023e1Ik.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nBrXyw023e.woff2',

        'https://fonts.gstatic.com/s/rubik/v8/iJWHBXyIfDnIV7EyjmmZ8WD07oB-98o.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWHBXyIfDnIV7Eyjmmf8WD07oB-98o.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWHBXyIfDnIV7EyjmmT8WD07oB-98o.woff2',
        'https://fonts.gstatic.com/s/rubik/v8/iJWHBXyIfDnIV7Eyjmmd8WD07oB-.woff2',
        // Libraries
        'https://unpkg.com/navigo@6.0.2/lib/navigo.min.js',
      ]);

    })
  );

});

self.addEventListener('activate', event => {

  /**
   * Remove old caches
   */
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames
        .filter(cacheName => cacheName.startsWith('blaze-static') && cacheName !== staticCacheName)
        .map(cacheName => caches.delete(cacheName))
      )
    )
  );

});


self.addEventListener('fetch', event => {

  event.respondWith(

    // Checks if request is there in cache.
    caches.match(event.request).then(res => {
      if (res) return res;

      // If request was not found in cache, fetch it from the network
      return fetch(event.request);
    })

  );

});
