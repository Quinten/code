(function () {

    var modules = {};
    var callbacks = [];

    window.define = function (...args) {
        document.querySelectorAll('script').forEach(function (script) {
            if (script.getAttribute('data-requireloading')) {
                script.setAttribute('data-requireloading', false);
                var path = script.getAttribute('data-requiremodule');
                console.log('define', path);
                //modules[path] = arguments[1]();
                if (typeof args[0] === 'function') {
                    modules[path] = args[0]();
                } else if (Array.isArray(args[0])) {
                    var module = args[1];
                    require(args[0], function (...args) {
                    modules[path] = module(...args);
                    });
                }
            }
        });
    };

    window.require = function () {
        if (Array.isArray(arguments[0])) {
            arguments[0].forEach(function (path) {
                if (modules[path] !== undefined) {
                    return;
                }
                var script   = document.createElement('script');
                script.onload = function (e) {
                    console.log(e);
                };
                script.setAttribute('data-requiremodule', path);
                script.setAttribute('data-requireloading', true);
                script.src = path + '.js';
            document.body.appendChild(script);
                modules[path] = false;
            });
        }
    };

})();
