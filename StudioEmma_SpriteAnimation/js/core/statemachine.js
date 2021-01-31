define([
    'StudioEmma_SpriteAnimation/js/math/dimensions'
], function (
    dimensions
) {
    'use strict';

    var prime;

    function create(config) {

        var parent = (config === undefined || config.parent === undefined) ? 'body' : config.parent;
        var width = (config === undefined || isNaN(Number(config.width))) ? 320 : Number(config.width);
        var height = (config === undefined || isNaN(Number(config.height))) ? 180 : Number(config.height);
        var resizable = (config === undefined || config.resizable === true || config.resizable === undefined) ? true : false;
        var zoom = (config === undefined || isNaN(Number(config.zoom))) ? 'auto' : Number(config.zoom);
        var pixelArt = (config === undefined || config.pixelArt === false || config.pixelArt === undefined) ? false : true;
        var overlay = (config === undefined || config.overlay === false || config.overlay === undefined) ? false : true;
        var background = (config === undefined || config.background === undefined) ? 'transparent' : config.background;
        var foreground = (config === undefined || config.foreground === undefined) ? '#000000' : config.foreground;

        var size = dimensions.create(config);

        var states = [];
        var currentState;

        var targetWidth;
        var targetHeight;
        var actualZoom = zoom;
        var resizeTOID = 0;
        var totalTime = 0;

        // the canvas
        var parentElement = document.querySelector(parent);
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        if (pixelArt) {
            canvas.style.imageRendering = 'pixelated';
        }
        if (overlay) {
            canvas.style.position = 'fixed';
            canvas.style.top = 0;
            canvas.style.left = 0;
            canvas.style.zIndex = 2147483647;
        }
        canvas.style.display = 'block';
        parentElement.appendChild(canvas);

        function setSize(width, height, zoom) {
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = (width * zoom) + 'px';
            canvas.style.height = (height * zoom) + 'px';
            size.width = width;
            size.height = height;

            if (currentState !== undefined && currentState.events !== undefined && typeof currentState.events.emit === 'function') {
                currentState.events.emit('resize', {width: width, height: height, zoom: zoom});
            }
        }

        function onWindowResize() {
            var w = (parent === 'body') ? window.innerWidth : parentElement.clientWidth;
            var h = (parent === 'body') ? window.innerHeight : parenElement.clientHeight;
            actualZoom = zoom;
            if (zoom === 'auto') {
                var wZoom = Math.max(1, Math.floor(w / ((targetWidth !== undefined) ? targetWidth : w)));
                var hZoom = Math.max(1, Math.floor(h / ((targetHeight !== undefined) ? targetHeight : h)));
                actualZoom = Math.min(wZoom, hZoom);
            }
            w = Math.ceil(w / actualZoom);
            h = Math.ceil(h / actualZoom);
            setSize(w, h, actualZoom);
        }

        if (resizable) {
            if (zoom === 'auto') {
                if (width) {
                    targetWidth = width;
                }
                if (height) {
                    targetHeight = height;
                }
            }
            window.addEventListener('resize', function () {
                clearTimeout(resizeTOID);
                resizeTOID = setTimeout(onWindowResize, 500);
            });
            onWindowResize();

            if (parent === 'body') {
                document.body.style.margin = '0';
                document.body.style.overflow = 'hidden';
            }

        } else {
            if (zoom === 'auto') {
                zoom = 1;
            }
            setSize(width, height, zoom);
        }

        // bring focus to the window in an iframe
        window.addEventListener('load', function () {
            window.focus();
            document.body.addEventListener('click', function (e) {
                window.focus();
            }, false);
        });

        // state machine

        function addState(state) {
            states.push(state);
            if (currentState === undefined) {
                currentState = state;
                if (currentState.events !== undefined && typeof currentState.events.emit === 'function') {
                    currentState.events.emit('start', {time: totalTime});
                    currentState.events.emit('resize', {width: canvas.width, height: canvas.height, zoom: actualZoom});
                }
            }
        }

        function switchState(name) {
            if (currentState !== undefined && currentState.name === name) {
                return;
            }
            if (currentState !== undefined && currentState.events !== undefined && typeof currentState.events.emit === 'function') {
                currentState.events.emit('stop', {time: totalTime});
            }
            currentState = states.find(function (state) {
                return state.name === name;
            });
            if (currentState.events !== undefined && typeof currentState.events.emit === 'function') {
                currentState.events.emit('start', {time: totalTime});
                currentState.events.emit('resize', {width: canvas.width, height: canvas.height, zoom: actualZoom});
            }
        }

        function onFrame(time) {

            var delta = time - totalTime;
            totalTime = time;
            if (delta > 200) {
                delta = 200;
            }
            // clear or draw background
            if (background === 'transparent') {
                context.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                context.save();
                context.fillStyle = background;
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.restore();
            }
            if (currentState !== undefined && currentState.events !== undefined && typeof currentState.events.emit === 'function') {
                currentState.events.emit('step', {time: time, delta: delta});
                currentState.events.emit('draw', {time: time, delta: delta, context: context});
                currentState.events.emit('process', {time: time, delta: delta, context: context});
            }
            window.requestAnimationFrame(onFrame);
        }
        window.requestAnimationFrame(onFrame);

        var statemachine = {
            size: size,
            addState: addState,
            switchState: switchState,
            background: background,
            foreground: foreground
        };

        if (prime === undefined) {
            prime = statemachine;
        }

        return statemachine;
    }

    function primal() {
        if (prime === undefined) {
            create({overlay: true});
        }
        return prime;
    }

    return {
        create: create,
        primal: primal
    };
});
