function log() {
  console.log.apply(console, arguments);
}

var staticCacheName = 'v1';

if ('serviceWorker' in navigator) {
  if (! navigator.serviceWorker.controller) {
    log('Page not currently controlled by a service worker')
  }

  getCachesAndFiles();

  navigator.serviceWorker.register('sw.js')
    .then(() => {
      console.log('SW registered');
      updateLIStatus();

    });

} else {
  log('Service workers not supported');
}

document.getElementById('update_status').addEventListener('click', ev => {
  getCachesAndFiles();

  updateLIStatus();
});

document.getElementById('cache_3to5').addEventListener('click', ev => {
  let filesToCache = ['article-3.html', 'article-4.html', 'article-5.html'];

  precacheFiles(filesToCache);
});

document.getElementById('clear_cache').addEventListener('click', ev => {
  window.caches.keys()
    .then(cache_key => {
      window.caches.delete(cache_key);
    })
    .then(updateLIStatus);
});

function precacheFiles(files) {
  console.log('precaching: ', files);

  window.caches.open(staticCacheName)
    .then(cache => cache.addAll(files))
    .then(updateLIStatus);
}

function updateLIStatus() {
  // reset all the classes -- just in case
  document.querySelectorAll('#asset_list li').forEach(el => {
    el.classList.remove('cached');
  });

  // add class=cached to the LI if the file is in the cache
  window.caches.open(staticCacheName).then(cache => {
    cache.keys().then(item_keys => {
      let filenames = cacheKeysToFileNames(item_keys);
      filenames.forEach(filename => {
        let li = document.getElementById(filename);
        li && li.classList.add('cached');
      });
    });
  });

  // set the initialized class
  document.getElementById('asset_list').classList.add('initialized');
}

function getCachesAndFiles() {
  window.caches.keys().then(cache_keys => {
    cache_keys.forEach(cache_key => {
      console.log('=== Cache: ', cache_key);
      window.caches.open(cache_key).then(cache => {
        cache.keys().then(item_keys => {
          console.log(cacheKeysToFileNames(item_keys).join(', '));
        });
      });
    });
  });
}

function cacheKeysToFileNames(cache_keys) {
  return cache_keys.map(key => {
    let path = key.url.split('/');
    return path[path.length - 1];
  });
}
