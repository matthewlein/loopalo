define('controls', function(require) {

    'use strict';

    // ------------------------------------------------------------------------- //
    // Requires
    // ------------------------------------------------------------------------- //

    var $ = require('jquery');
    var _ = require('underscore');
    require('colorpicker');
    require('sortable');
    var canvas = require('canvas');
    var Line = require('Line');

    // ------------------------------------------------------------------------- //
    // Globals
    // ------------------------------------------------------------------------- //

    var globals = require('globals');

    // ------------------------------------------------------------------------- //
    // Controls
    // ------------------------------------------------------------------------- //

    function drawManyLines() {

        var line;

        // draw all the lines
        for (var j = 0; j < globals.doc.lineCount; j++) {
            line = new Line();
            line.drawPath();
        }

        // reset the mode so new groups have events
        modes[globals.doc.mode].off();
        modes[globals.doc.mode].on();

    }


    // ------------------------------------------------------------------------- //
    // Modes
    // ------------------------------------------------------------------------- //

    // starting mode
    // var mode = 'draw';
    // modes holder
    var modes = {};

    //
    // Draw mode
    //
    modes.draw = (function() {

        // draws lines
        var lineInterval;

        function onPressDraw(event) {
            // normalize
            normalizeEvent(event);
            // save X and Y
            pointerX = event._canvasX;
            pointerY = event._canvasY;

            // make line
            var line = new Line({
                x : pointerX,
                y : pointerY
            });
            line.drawPath();

            // add event listeners for move
            canvas.canvas.mousemove(onMoveDraw);

            // start interval/timeout
            lineInterval = setInterval(function(){
                var line = new Line({
                    x : pointerX,
                    y : pointerY
                });
                line.drawPath();
                // console.log('x:', pointerX, 'y:', pointerY);
            }, (1000/6) );
        }

        function onMoveDraw(event) {
            // save the current X and Y
            normalizeEvent(event);
            pointerX = event._canvasX;
            pointerY = event._canvasY;
            // console.log(event, 'x:', pointerX, 'y:', pointerY);
        }

        function onReleaseDraw(event) {
            // clear interval
            clearInterval(lineInterval);
            // remove move listeners
            canvas.canvas.unmousemove(onMoveDraw);
        }

        function bindEvents() {
            canvas.canvas.mousedown(onPressDraw);
            canvas.canvas.mouseup(onReleaseDraw);
        }

        function unbindEvents() {
            canvas.canvas.unmousedown(onPressDraw);
            canvas.canvas.unmouseup(onReleaseDraw);
        }

        function on() {
            bindEvents();
            canvas.$svgWrapper.addClass('mode--draw');
        }
        function off() {
            unbindEvents();
            canvas.$svgWrapper.removeClass('mode--draw');
        }

        // Return
        return {
            on : on,
            off : off
        };

    })();

    //
    // Move mode
    //
    modes.move = (function() {

        var isDragging = false;

        function onGroupOverMove() {

            if (isDragging) { return; }

            var paths = this.selectAll('path');

            $.each(paths, function(index, path) {
                path.attr( 'stroke', path._colorInvert );
            });

        }
        function onGroupOutMove() {

            if (isDragging) { return; }

            var paths = this.selectAll('path');

            $.each(paths, function(index, path) {
                path.attr( 'stroke', path._color );
            });
        }

        function bindEvents() {
            var gs = canvas.canvas.selectAll('g');

            var lastX;
            var lastY;
            var currentX;
            var currentY;

            gs.forEach(function(group) {
                // group hover
                // group.hover(onGroupOverMove, onGroupOutMove, group, group);
                group.mouseover(onGroupOverMove);
                group.mouseout(onGroupOutMove);

                group.drag(
                    function move( dx, dy, x, y ){
                        // set x and y as current
                        currentX = x;
                        currentY = y;
                        // find the change in x, y
                        var diffX = currentX - lastX;
                        var diffY = currentY - lastY;
                        // console.log('dx: ', diffX, 'dy: ', diffY);

                        // make a new matrix
                        var t = new Snap.Matrix();
                        // move by the difference in x and y
                        t.translate(diffX, diffY);

                        // if it had a matrix before, add it to the old
                        if ( !!this._matrix ) {
                            t.add(this._matrix);
                        }
                        // assign the new matrix value
                        this._matrix = t;
                        // make the transformation
                        this.transform( t );

                        // reset x and y
                        lastX = currentX;
                        lastY = currentY;
                    },
                    function start( x, y, event ){
                        lastX = x;
                        lastY = y;
                        isDragging = true;
                        this.unmouseout(onGroupOutMove);
                    },
                    function end(event){
                        isDragging = false;
                        this.mouseout(onGroupOutMove);
                    }
                );
            });
        }

        function unbindEvents() {
            var gs = canvas.canvas.selectAll('g');

            gs.forEach(function(group) {
                // unbind listeners
                group.unmouseover(onGroupOverMove);
                group.unmouseout(onGroupOutMove);
                group.undrag();
            });
        }

        function on() {
            canvas.$svgWrapper.addClass('mode--move');
            bindEvents();
        }
        function off() {
            canvas.$svgWrapper.removeClass('mode--move');
            unbindEvents();
        }

        return {
            on : on,
            off : off
        };

    })();

    //
    // Erase mode
    //
    modes.erase = (function() {

        function onGroupOverErase() {
            var paths = this.selectAll('path');

            $.each(paths, function(index, path) {
                path.attr( 'stroke', path._colorInvert );
            });
        }
        function onGroupOutErase() {
            var paths = this.selectAll('path');

            $.each(paths, function(index, path) {
                path.attr( 'stroke', path._color );
            });
        }
        function onGroupClickErase() {
            this.remove();
        }


        function bindEvents() {
            var gs = canvas.canvas.selectAll('g');

            gs.forEach(function(group) {
                // group hover
                group.hover(onGroupOverErase, onGroupOutErase, group, group);
                group.click(onGroupClickErase);
            });
        }

        function unbindEvents() {
            var gs = canvas.canvas.selectAll('g');

            gs.forEach(function(group) {
                // unbind listeners
                group.unhover(onGroupOverErase, onGroupOutErase);
                group.unclick(onGroupClickErase);
            });
        }

        function on() {
            canvas.$svgWrapper.addClass('mode--erase');
            bindEvents();
        }
        function off() {
            canvas.$svgWrapper.removeClass('mode--erase');
            unbindEvents();
        }

        return {
            on : on,
            off : off
        };

    })();


    function changeMode() {
        var $this = $(this);
        var newMode = $this.data('mode');
        var activeClass = 'button--group--active';

        $modeBtns.removeClass(activeClass);
        $this.addClass(activeClass);

        globals.doc.mode = newMode;
        onModeChange();
    }

    function onModeChange(mode) {

        var mode = globals.doc.mode;

        if (mode === 'draw') {
            // offs
            modes.move.off();
            modes.erase.off();
            // on
            modes.draw.on();
        }
        else if (mode === 'move') {
            // offs
            modes.draw.off();
            modes.erase.off();
            // on
            modes.move.on();
        }
        else if (mode === 'erase') {
            // offs
            modes.move.off();
            modes.draw.off();
            // on
            modes.erase.on();
            // might want to do this at the canvas level and delegate for g
            // so you can DrawManyLines() and still erase without changing modes
        }

    }

    // ------------------------------------------------------------------------- //
    // Events
    // ------------------------------------------------------------------------- //

    var pointerX;
    var pointerY;

    // yoinked from jQuery
    function normalizeEvent(event) {
        var eventDoc;
        var docum;
        var body;

        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && event.clientX != null ) {
            eventDoc = event.target.ownerDocument || document;
            docum = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX + ( docum && docum.scrollLeft || body && body.scrollLeft || 0 ) - ( docum && docum.clientLeft || body && body.clientLeft || 0 );
            event.pageY = event.clientY + ( docum && docum.scrollTop  || body && body.scrollTop  || 0 ) - ( docum && docum.clientTop  || body && body.clientTop  || 0 );
        }

        // add an _canvasX and _canvasY that are relative to the canvas
        var canvasLeft = canvas.svgWrapper.getBoundingClientRect().left;
        var canvasTop = canvas.svgWrapper.getBoundingClientRect().top;

        event._canvasX = event.pageX - canvasLeft;
        event._canvasY = event.pageY - canvasTop;

        return event;
    }





    // ------------------------------------------------------------------------- //
    // GUI creation
    // ------------------------------------------------------------------------- //

    var $modeBtns;
    var $bgColorPicker;

    function controller() {

        // menu button
        var $menu = $('#menu');
        var $menuBtn = $('#menu-button');
        $menuBtn.on('click', function() {
            $menuBtn.toggleClass('button--active');
            $menu.toggleClass('menu--open');
        });

        // Maybe move onModeChange into here?

        // mode buttons
        $modeBtns = $('[data-mode]');
        $modeBtns.on('mousedown', changeMode);

        // curve size field
        var $curveSizeInput = $('#curve-size');
        $curveSizeInput.val(globals.settings.tileSize);
        $curveSizeInput.on('change', function() {
            var $this = $(this);
            var val = $this.val();

            globals.settings.tileSize = Number(val);
            canvas.setTileSizes();
        });

        // line length field
        var $lineLengthInput = $('#line-length');
        $lineLengthInput.val(globals.settings.lineLength);
        $lineLengthInput.on('change', function() {
            var $this = $(this);
            var val = $this.val();

            globals.settings.lineLength = val;
        });

        // draw many lines button
        var $drawManyBtn = $('#draw-many');
        $drawManyBtn.on('click', drawManyLines);

        // line count field
        var $lineCountInput = $('#line-count');
        $lineCountInput.val(globals.doc.lineCount);
        $lineCountInput.on('change', function() {
            var $this = $(this);
            var val = $this.val();

            globals.doc.lineCount = val;
        });

        // opacity slider field
        var $opacityRange = $('#line-opacity');
        var $opacityInput = $('#line-opacity-input');
        $opacityRange.val(globals.settings.opacity);
        $opacityInput.val(globals.settings.opacity);
        $opacityRange.on('input change', function() {
            var $this = $(this);
            var val = $this.val();
            $opacityInput.val(val);
            globals.settings.opacity = val;
        });
        $opacityInput.on('change', function() {
            var $this = $(this);
            var val = $this.val();
            $opacityRange.val(val);
            globals.settings.opacity = val;
        });



        // clear canvas
        var $clearCanvasBtn = $('#clear-canvas');
        $clearCanvasBtn.on('click', canvas.clearCanvas);

        // add stroke button
        var $addStrokeBtn = $('#add-stroke');
        $addStrokeBtn.on('click', addStroke);

        // shift up/down for 10 increment
        $('.controller').on('keydown','input[type="number"]', function(event) {

            var $this = $(this);

            var key = event.which;
            // shift key jump by 10
            var step = Number(this.step) || 1;
            var increment = event.shiftKey ? ( step * 10 ) : step;
            // to make sure its not below min or above max
            var min = Number( $this.attr('min') );
            var max = Number( $this.attr('max') );

            if (key === 38 || key === 40) {
                // only prevent on these keys
                event.preventDefault();
                // if key is up, positive, otherwise its down and go negative
                increment = (key === 38) ? increment : -(increment);
                var num = Number( $this.val() ) + increment;

                if ( !!$this.attr('min') && num < min) {
                    num = min;
                } else if ( !!$this.attr('max') && num > max ) {
                    num = max;
                }
                $this.val( num );
            }

            // trigger change to update settings
            $this.trigger('change');

        });




        //
        // Color Pickers
        //

        // wrapper for the picker
        var $bgColorPickerHolder = $('#bg-color-colorpicker');
        // hide it
        $bgColorPickerHolder.hide();
        // the input
        var $bgColorInput = $('#bg-color');
        // make the picker widget
        $bgColorPicker = $.farbtastic( $bgColorPickerHolder, function(color) {
            // set the bg color and text color (based on how dark it is)
            $bgColorInput.css({
                backgroundColor : color,
                color : this.hsl[2] > 0.5 ? '#000' : '#fff'
            });
            // set the input value to the color
            $bgColorInput.val(color);
            // set the settings bg color to color
            globals.doc.bgColor = color;
            // set the bg shape's bg color
            canvas.bgRect.attr({
                fill : color
            });
        });
        // set the picker color to the bg color
        $bgColorPicker.setColor(globals.doc.bgColor);
        // on focus/blur show and hide
        $bgColorInput.on('focus', function() {
            $bgColorPickerHolder.show();
        }).on('blur', function() {
            $bgColorPickerHolder.hide();
        });


        // make strokes
        _.each(globals.settings.strokes, function(stroke, index) {
            makeStrokeHTML(stroke);
        });

        // draggable
        makeStrokesSortable();
        // events
        $strokeList.on('sortupdate', rebuildStrokeSettings);

    }


    //
    // Strokes
    //

    var $strokeList = $('#strokes-list');

    // remakes the strokes array
    function rebuildStrokeSettings() {

        globals.settings.strokes = [];

        $strokeList.children('.stroke').each(function(index) {
            var $this = $(this);
            var color = $this.find('[data-stroke-color]').data('strokeColor');
            var width = $this.find('[data-stroke-width]').data('strokeWidth');
            var cap = $this.find('[data-stroke-cap]').data('strokeCap');

            // casting
            width = Number(width);

            globals.settings.strokes[index] = {
                color : color,
                width : width,
                cap : cap
            };

        });
    }

    function makeStrokesSortable() {
        $strokeList.sortable('destroy');
        $strokeList.sortable();
    }



    var strokeTemplate = [
        '<li class="stroke">',
            // '<div class="stroke__handle"></div>',
            '<div class="colorpicker-holder" data-color-picker></div>',
            '<input type="text" class="stroke-color input--color" value="{{color}}" data-stroke-color="{{color}}">',
            '<input type="number" class="stroke-width" value="{{width}}" data-stroke-width="{{width}}">',
            '<select name="" id="" class="stroke-cap" data-stroke-cap="{{cap}}">',
                '<option value="round">Round</option>',
                '<option value="square">Square</option>',
                '<option value="butt">Butt</option>',
            '</select>',
            '<button class="stroke-delete" data-stroke-delete><i class="icon icon--solo icon--close"></i></button>',
        '</li>'
    // join with newline or no??? hmmm
    ].join('\n');

    function addStroke() {

        var maxWidthStroke = _.max( globals.settings.strokes, function(stroke) {
            return stroke.width;
        });

        var maxWidth = maxWidthStroke.width;

        var newStrokeIndex = globals.settings.strokes.length;

        globals.settings.strokes.push({
            color : '#000000',
            width : maxWidth + 5,
            cap : 'round'
        });

        var newStroke = globals.settings.strokes[newStrokeIndex];

        makeStrokeHTML(newStroke);
        makeStrokesSortable();

    }

    function makeStrokeHTML(stroke) {

        var width = stroke.width;
        var color = stroke.color;
        var cap = stroke.cap;

        // replace placeholders
        var strokeHTML = strokeTemplate.replace(new RegExp('{{color}}', 'g' ) , color)
                                       .replace(new RegExp('{{width}}', 'g' ), width)
                                       .replace(new RegExp('{{cap}}', 'g' ), cap);

        // make the HTML findable
        var $strokeHTML = $(strokeHTML);
        // select the correct option
        $strokeHTML.find('option[value="' + cap + '"]').prop('selected', true);


        // wrapper for the picker
        var $colorPickerHolder = $strokeHTML.find('[data-color-picker]');
        // hide it
        $colorPickerHolder.hide();
        // find the input
        var $colorInput = $strokeHTML.find('[data-stroke-color]');
        // make the picker widget
        var $colorPicker = $.farbtastic( $colorPickerHolder, function(color) {
            // set the bg color and text color (based on how dark it is)
            $colorInput.css({
                backgroundColor : color,
                color : this.hsl[2] > 0.5 ? '#000' : '#fff'
            });
            // set the input value to the color
            $colorInput.val(color);
            $colorInput.trigger('change');
        });
        // set the picker color to the stroke color
        $colorPicker.setColor(color);
        // on focus/blur show and hide
        $colorInput.on('focus', function() {
            $colorPickerHolder.show();
        }).on('blur', function() {
            $colorPickerHolder.hide();
        });

        // delete button
        var $deleteStroke = $strokeHTML.find('[data-stroke-delete]');
        $deleteStroke.on('click', function() {
            if ( $('#strokes-list').children().length > 1 ) {
                $strokeHTML.remove();
                rebuildStrokeSettings();
            }
        });

        //
        // Change events update data
        //

        $strokeHTML.on('change keyup', function(event) {

            var $this = $(this);

            var width = $this.find('[data-stroke-width]').val();
            var cap = $this.find('[data-stroke-cap] > :selected').val();
            var color = $this.find('[data-stroke-color]').val();

            $this.find('[data-stroke-color]').data('strokeColor', color);
            $this.find('[data-stroke-width]').data('strokeWidth', width);
            $this.find('[data-stroke-cap]').data('strokeCap', cap);

            rebuildStrokeSettings();

        });

        $strokeList.append($strokeHTML);
    }


    function updateSettingsUI() {

        // curve size field
        var $curveSizeInput = $('#curve-size');
        $curveSizeInput.val(globals.settings.tileSize);

        // line length field
        var $lineLengthInput = $('#line-length');
        $lineLengthInput.val(globals.settings.lineLength);

        // line count field
        var $lineCountInput = $('#line-count');
        $lineCountInput.val(globals.doc.lineCount);

        // opacity slider field
        var $opacityRange = $('#line-opacity');
        var $opacityInput = $('#line-opacity-input');
        $opacityRange.val(globals.settings.opacity);
        $opacityInput.val(globals.settings.opacity);

        // Color Picker
        $bgColorPicker.setColor(globals.doc.bgColor);

        // clear strokes
        $strokeList.children().remove();

        // make strokes
        _.each(globals.settings.strokes, function(stroke, index) {
            makeStrokeHTML(stroke);
        });

        // draggable
        makeStrokesSortable();

    }

    // ------------------------------------------------------------------------- //
    // Init
    // ------------------------------------------------------------------------- //

    function init() {
        controller();
        modes.draw.on();
    }

    init();

    // ------------------------------------------------------------------------- //
    // Export
    // ------------------------------------------------------------------------- //

    var pub = {
        updateSettingsUI : updateSettingsUI
    };

    return pub;

});