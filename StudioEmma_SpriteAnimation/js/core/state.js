define([
    'StudioEmma_SpriteAnimation/js/core/statemachine',
    'StudioEmma_SpriteAnimation/js/core/events',
    'StudioEmma_SpriteAnimation/js/math/point'
], function (
    defaultStatemachine,
    eventEmitter,
    point
) {
    'use strict';

    var prime;

    function create(config) {

        var name = (config === undefined || config.name === undefined) ? '' + Math.random() : config.name;
        var statemachine = (config === undefined || config.statemachine === undefined) ? defaultStatemachine.primal() : config.statemachine;

        var events = eventEmitter.create();

        var offset = point.create();

        var state = {
            name: name,
            statemachine: statemachine,
            events: events,
            offset: offset
        };

        statemachine.addState(state);

        if (prime === undefined) {
            prime = state;
        }

        return state;
    }

    function primal() {
        if (prime === undefined) {
            create({name: 'primal'});
        }
        return prime;
    }

    return {
        create: create,
        primal: primal
    };
});
