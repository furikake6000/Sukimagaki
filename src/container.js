var width = window.innerWidth;
var height = (window.innerHeight - 25);

// first we need Konva core things: stage and layer
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var layer = new Konva.Layer();
stage.add(layer);


// then we are going to draw into special canvas element
var canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

// created canvas we can add to layer as "Konva.Image" element
var image = new Konva.Image({
    image: canvas,
    x: 0,
    y: 0,
    stroke: 'green',
    shadowBlur: 5
});
layer.add(image);
stage.draw();

// Good. Now we need to get access to context element
var context = canvas.getContext('2d');
context.strokeStyle = "black";
context.lineJoin = "round";
context.lineWidth = 2;


var isPaint = false;
var lastPointerPosition;
var mode = 'brush';


// now we need to bind some events
// we need to start drawing on mousedown
// and stop drawing on mouseup
image.on('mousedown touchstart', function () {
    isPaint = true;
    lastPointerPosition = stage.getPointerPosition();

});

// will it be better to listen move/end events on the window?

stage.addEventListener('mouseup touchend', function () {
    isPaint = false;
});

// and core function - drawing
stage.addEventListener('mousemove touchmove', function () {
    if (!isPaint) {
        return;
    }

    if (mode === 'brush') {
        context.globalCompositeOperation = 'source-over';
    }
    if (mode === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
    }
    context.beginPath();

    var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y()
    };
    context.moveTo(localPos.x, localPos.y);
    var pos = stage.getPointerPosition();
    localPos = {
        x: pos.x - image.x(),
        y: pos.y - image.y()
    };
    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();


    lastPointerPosition = pos;
    layer.batchDraw();
});



var select = document.getElementById('tool');
select.addEventListener('change', function () {
    mode = select.value;
});