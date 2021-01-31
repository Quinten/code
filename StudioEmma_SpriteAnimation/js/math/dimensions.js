define(function () {
    'use strict';

    return {
        create: function (config) {
            var dimensions = {
                width: (config === undefined || isNaN(Number(config.width))) ? 32 : Number(config.width),
                height: (config === undefined || isNaN(Number(config.height))) ? 32 : Number(config.height)
            };

            return dimensions;
        }
    };
});
