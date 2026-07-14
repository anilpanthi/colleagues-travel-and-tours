const CACHE_VERSION = 'colleagues-v4'
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const OFFLINE_URL = '/offline.html'

const APP_SHELL = [
  OFFLINE_URL,
  '/site.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/colleagues-original-logo.svg',
  '/colleagues-white-logo.svg',
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
  if (url.pathname.startsWith('/_next/')) return false

  return !url.pathname.startsWith('/admin') && !url.pathname.startsWith('/api')
}

const isPublicMediaRequest = (request, url) =>
  request.method === 'GET' &&
  url.origin === self.location.origin &&
  url.pathname.startsWith('/api/media/file/')

const cacheMediaRequest = async (request) => {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    if (response.status === 200) {
      try {
        const cache = await caches.open(RUNTIME_CACHE)
        await cache.put(request, response.clone())
      } catch {
        // A cache write failure must not discard a valid network response.
      }
    }

    return response
  } catch {
    return Response.error()
  }
}

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_PUBLIC_MEDIA' || !Array.isArray(event.data.urls)) return

  const requests = event.data.urls
    .filter((value) => typeof value === 'string')
    .map((value) => new URL(value, self.location.origin))
    .filter(
      (url) => url.origin === self.location.origin && url.pathname.startsWith('/api/media/file/'),
    )
    .map((url) => new Request(url.href, { credentials: 'same-origin' }))

  event.waitUntil(Promise.all(requests.map((request) => cacheMediaRequest(request))))
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Video playback relies on partial Range responses, which Cache Storage cannot store.
  if (request.destination === 'video' || request.headers.has('range')) return

  if (isPublicMediaRequest(request, url)) {
    event.respondWith(cacheMediaRequest(request))
    return
  }

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
