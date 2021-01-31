define(function () {
    'use strict';

    return {
        create: function (config) {
            var point = {
                x: (config === undefined || isNaN(Number(config.x))) ? 0 : Number(config.x),
                y: (config === undefined || isNaN(Number(config.y))) ? 0 : Number(config.y)
            };

            return point;
        }
    };
});
