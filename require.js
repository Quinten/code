(function () {

    var modules = {};

    window.define = function () {
        console.log(typeof arguments[0]);
        console.log(typeof arguments[1]);
    };

    window.require = function () {
        console.log(arguments[0]);
        console.log(typeof arguments[0]);
        console.log(typeof arguments[1]);
        if (Array.isArray(arguments[0])) {
            arguments[0].forEach(function (path) {
                if (modules[path] !== undefined) {
                    return;
                }
                var script   = document.createElement('script');
                script.onload = function (e) {
                    console.log(e);
                };
                script.src   = path + '.js';
                script.setAttribute('data-requiremodule', path);
                document.body.appendChild(script);
                modules[path] = false;
            });
        }
    };

})();
