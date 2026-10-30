// 離線快取＋自動更新：有網路一律先拿最新版（網路優先），沒網路才用快取；新版裝好立刻接管
var C='pqn-3e7db5aac1',F=['./','index.html','manifest.webmanifest','icon-512.png','icon-192.png','icon-maskable-512.png','apple-touch-icon.png','law_map.json'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F.map(function(u){return new Request(u,{cache:'reload'})}))}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){
  // 舊版（快取優先）的頁面不會自己重整：從舊快取升上來時，替開著的頁面重整一次
  var legacy=ks.some(function(k){return k.indexOf('pq-')===0});
  return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)})).then(function(){return self.clients.claim()}).then(function(){
    if(!legacy)return;
    return self.clients.matchAll({type:'window'}).then(function(cs){cs.forEach(function(c){if(c.navigate)c.navigate(c.url).catch(function(){})})});
  });
}))});
self.addEventListener('fetch',function(e){
  var q=e.request;if(q.method!=='GET'||new URL(q.url).origin!==location.origin)return;
  e.respondWith(fetch(q,{cache:'no-cache'}).then(function(r){
    if(r&&r.ok&&r.type==='basic'){var k=r.clone();caches.open(C).then(function(c){c.put(q,k)})}
    return r;
  }).catch(function(){return caches.match(q,{ignoreSearch:true}).then(function(r){return r||(q.mode==='navigate'?caches.match('index.html'):undefined)||Response.error()})}));
});
