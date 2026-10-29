// 離線快取：第一次開過就整包存起來，之後沒網路也能用
var C='pq-b2ad84c0c6',F=['./','index.html','manifest.webmanifest','icon-512.png','icon-192.png','icon-maskable-512.png','apple-touch-icon.png','law_map.json'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request)}))});
