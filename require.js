(function () {

    var modules = {};
    var callbacks = [];
    var pathQueue = [];

    function resolve(path) {
        modules[path] = false;
        var script   = document.createElement('script');
        script.setAttribute('data-requiremodule', path);
        script.setAttribute('data-requireloading', true);
        script.src = path + '.js';
        document.body.appendChild(script);
    }

    function processCallbacks() {
        var callback = callbacks.pop();
        if (callback === undefined) {
            return;
        }
        var args = [];
        callback.paths.forEach(function (path) {
            args.push(modules[path]);
        });
        callback.callback(...args);
        processPathQueue();
    }

    function processPathQueue() {
        var path = pathQueue.pop();
        if (path === undefined) {
            processCallbacks();
            return;
        }
        if (modules[path] === undefined) {
            resolve(path);
            return;
        }
        processCallbacks();
    }

    window.define = function (...args) {
        document.querySelectorAll('script').forEach(function (script) {
            if (script.getAttribute('data-requireloading') === 'true') {
                script.setAttribute('data-requireloading', false);
                var path = script.getAttribute('data-requiremodule');
                if (typeof args[0] === 'function') {
                    modules[path] = args[0]();
                    processCallbacks();
                } else if (Array.isArray(args[0])) {
                    var module = args[1];
                    require(args[0], function (...args) {
                        modules[path] = module(...args);
                    });
                }
            }
        });
    };

    window.require = function (...args) {
        if (Array.isArray(args[0])) {
            args[0].forEach(function (path) {
                pathQueue.push(path);
            });
            callbacks.push({
                paths: args[0],
                callback: args[1]
            });
            processPathQueue();
        }
    };

})();
