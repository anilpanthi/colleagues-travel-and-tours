const CACHE_VERSION = 'colleagues-v1'
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const OFFLINE_URL = '/offline.html'

const APP_SHELL = [
  OFFLINE_URL,
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

const isCacheableFrontendRequest = (request, url) => {
  if (request.method !== 'GET' || url.origin !== self.location.origin) return false

  return !url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (!isCacheableFrontendRequest(request, url)) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            event.waitUntil(caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)))
          }

          return response
        })
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE_URL)),
    )
    return
  }

  if (['image', 'font', 'style', 'script'].includes(request.destination)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkResponse = fetch(request)
          .then((response) => {
            if (response.ok) {
              const copy = response.clone()
              event.waitUntil(caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)))
            }

            return response
          })
          .catch(() => cachedResponse)

        return cachedResponse || networkResponse
      }),
    )
  }
})
