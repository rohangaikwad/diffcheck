console.log("diffchecker worker init");
self.addEventListener( 'install', event => {
    event.waitUntil(
        caches.open('diff-checker-v0.0.4').then(cache => cache.addAll([
            'shell.html',
            'css/style.min.css',
            'js/main.js',
            'js/monaco-editor-package/min/vs/loader.js',
            'js/monaco-editor-package/min/vs/basic-languages/css/css.js',
            'js/monaco-editor-package/min/vs/basic-languages/html/html.js',
            'js/monaco-editor-package/min/vs/basic-languages/javascript/javascript.js',
            'js/monaco-editor-package/min/vs/basic-languages/scss/scss.js',
            'js/monaco-editor-package/min/vs/basic-languages/typescript/typescript.js',
            'js/monaco-editor-package/min/vs/language/css/cssMode.js',
            'js/monaco-editor-package/min/vs/language/css/cssWorker.js',
            'js/monaco-editor-package/min/vs/language/html/htmlMode.js',
            'js/monaco-editor-package/min/vs/language/html/htmlWorker.js',
            'js/monaco-editor-package/min/vs/language/json/jsonMode.js',
            'js/monaco-editor-package/min/vs/language/json/jsonWorker.js',
            'js/monaco-editor-package/min/vs/language/typescript/tsMode.js',
            'js/monaco-editor-package/min/vs/language/typescript/tsWorker.js',
            'js/monaco-editor-package/min/vs/editor/editor.main.js',
            'js/monaco-editor-package/min/vs/editor/editor.main.css',
            'js/monaco-editor-package/min/vs/editor/editor.main.nls.js',
            'js/monaco-editor-package/min/vs/base/worker/workerMain.js',
            'favicon.ico'
        ]))
    );
});

// cache management
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['diff-checker-v0.0.4'];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

});

self.addEventListener( 'fetch', event => {
    const url = new URL (event.request.url);

    if (url.origin == location.origin && url.pathname == '/diffchecker/'){
        event.respondWith(caches.match('shell.html'));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});