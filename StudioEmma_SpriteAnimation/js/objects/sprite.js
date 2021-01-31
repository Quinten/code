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

        var position = point.create(config);
        var size = dimensions.create(config);

        var scrollFactor = point.create({x: 1, y: 1});

        var name = (config === undefined || config.name === undefined) ? 'http://www.aeromoov.test/media/attribute/swatch/swatch_thumb/60x60/i/n/instanttravelcot_white_sands.png' : config.name;
        var frame = (config === undefined || config.frames === undefined) ? 0 : config.frame;
        var frames = [];
        var animations = {};
        var _animation;
        var img;

        var sprite = {
            name: name,
            size: size,
            position: position,
            scrollFactor: scrollFactor,
            state: state
        };

        sprite.addAnimation = function (config) {
            var name = (config === undefined || config.name === undefined) ? 'idle' : config.name;
            var frames = (config === undefined || config.frames === undefined) ? [0] : config.frames;
            var fps = (config === undefined || config.fps === undefined) ? 12 : config.fps;
            var loop = (config === undefined || config.loop === undefined) ? -1 : config.loop;
            var time = 0;
            var rate = 1000 / fps;
            var loopLength = rate * frames.length;
            var maxTime = loopLength * (loop + 1);
            animations[name] = {
                frames: frames,
                fps: fps,
                loop: loop,
                time: time,
                maxTime: maxTime,
                loopLength: loopLength
            };
            return sprite;
        };

        sprite.setAnimation = function (newAnimation) {
            if (newAnimation === _animation) {
                return;
            }
            _animation = newAnimation;
            if (_animation && animations[_animation] !== undefined) {
                animations[_animation].time = 0;
            }
        };

        function tickAnimation(delta) {
            var animation = animations[_animation];
            frame = Math.floor((animation.time % animation.loopLength) / animation.loopLength * animation.frames.length);
            animation.time += delta;
            if (animation.maxTime > 0) {
                if (animation.time > animation.maxTime) {
                    _animation = undefined;
                    //sprite.events.emit('animationstopped');
                }
            }
        }

        var imgLoaded = false;
        function onImageLoaded() {
            var x = 0;
            var y = 0;
            frames = [];
            while (y < img.height) {
                x = 0;
                while (x < img.width) {
                    frames.push({x: x, y: y});
                    x += size.width;
                }
                y += size.height;
            }
            imgLoaded = true;
        }

        function loadImage() {
            imgLoaded = false;
            img = new Image();
            img.onload = onImageLoaded;
            img.src = name;
        }

        state.events.on('draw', function (e) {
            e.context.save();
            e.context.translate(Math.round(position.x - (state.offset.x * scrollFactor.x)), Math.round(position.y - (state.offset.y * scrollFactor.y)));
            if (_animation !== undefined && animations[_animation]) {
                tickAnimation(e.delta);
            }
            if (!imgLoaded) {
                if (img === undefined) {
                    loadImage();
                }
                return;
            }
            if (frames[frame]) {
                e.context.drawImage(img, frames[frame].x, frames[frame].y, size.width, size.height, -(size.width / 2), -(size.height / 2), size.width, size.height);
            }
            e.context.restore();
        });

        return sprite;
    }

    return {
        create: create
    };
});
