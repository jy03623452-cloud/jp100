const CACHE = "jp100-001c6ea825";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png", "a0.json", "a1.json", "a2.json", "a3.json", "a4.json", "a5.json", "a6.json", "a7.json", "a8.json", "a9.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
    .then(() => self.clients.matchAll({ includeUncontrolled: true })).then(cs => cs.forEach(c => c.postMessage("cached"))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("jp100-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => hit ||
    (e.request.mode === "navigate" ? c.match("./") : null)).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok) c.put(e.request, res.clone()); return res; }))));
});
