define([
    'StudioEmma_SpriteAnimation/js/core/state',
    'StudioEmma_SpriteAnimation/js/math/point',
    'StudioEmma_SpriteAnimation/js/math/dimensions'
], function (
    defaultState,
    point,
    dimensions
) {
    'use strict';

    function create(config) {

        var state = (config === undefined || config.state === undefined) ? defaultState.primal() : config.state;
        var fillStyle = (config === undefined || config.fillStyle === undefined) ? state.statemachine.foreground : config.fillStyle;

        var position = point.create(config);
        var size = dimensions.create(config);

        var scrollFactor = point.create({x: 1, y: 1});

        state.events.on('draw', function (e) {
            e.context.save();
            e.context.translate(Math.round(position.x - (state.offset.x * scrollFactor.x)), Math.round(position.y - (state.offset.y * scrollFactor.y)));
            e.context.fillStyle = fillStyle;
            e.context.fillRect(-size.width / 2, -size.height / 2, size.width, size.height);
            e.context.restore();
        });

        return {
            state: state,
            position: position,
            size: size,
            scrollFactor: scrollFactor
        };
    }

    return {
        create: create
    };
});
