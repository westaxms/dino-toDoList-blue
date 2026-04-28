self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("todo-app").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/mobileStyle.css",
        "/newStyle.css",
        "/script.js"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});