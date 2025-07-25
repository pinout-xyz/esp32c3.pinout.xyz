var CACHE = "network-or-cache";

self.addEventListener("install", function (evt) {
  console.log("The service worker is being installed.");

  evt.waitUntil(precache());
});

self.addEventListener("fetch", function (evt) {
  console.log("The service worker is serving the asset.");

  evt.respondWith(
    fromNetwork(evt.request, 400).catch(function () {
      return fromCache(evt.request);
    })
  );
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
    ".",
      "pinout-logo.png",
      "esp32-c5-devkit-1-underside.svg",
      "esp32-c5-devkit-1.svg",
      "pipipi-icon-48.png",
      "pipipi-icon-192.png",
      "pipipi-icon-512.png",
      "index.html",
      "register_serviceworker.js",
      "sw.js",
      "pinout.css",
      "pinout.js"
    ]);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
