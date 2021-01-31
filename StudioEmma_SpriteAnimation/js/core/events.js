define(function () {
    'use strict';

    return {
        create: function () {
            var listeners = {};

            function on(type, callback) {
                if (listeners[type] === undefined) {
                    listeners[type] = [];
                }
                listeners[type].push(
                    callback
                );
            }

            function once(type, callback) {
                var disposableCallback = function (e) {
                    callback(e);
                    off(type, disposableCallback);
                };
                on(type, disposableCallback);
            }

            function off(type, callback) {
                if (type === undefined) {
                    listeners = {};
                    return;
                }
                if (listeners[type] === undefined) {
                    return;
                }
                if (callback === undefined) {
                    listeners[type] = [];
                    return;
                }
                listeners[type].splice(listeners[type].indexOf(callback), 1);
            }

            function emit(type, e) {
                if (listeners[type] === undefined) {
                    return;
                }
                listeners[type].forEach(function (callback) {
                    callback(e);
                });
            }

            return {
                on: on,
                once: once,
                off: off,
                emit: emit
            };
        }
    };
});
