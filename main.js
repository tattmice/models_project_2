const HEADER_HEIGHT = 100;
const WATER_RANGE = 20;
const FOREST_RANGE = 100;
const MOUNTAIN_RANGE = 250;

var ctx = null;
var canvas = null;
var treeCtx = null;
var treeCanvas = null;
var width = null;
var height = null;

let pos = {x:0, y:0};
let draw = false;

function resize() {
    canvas.width = $("#canvas").parent().width();
    canvas.height = $("#canvas").parent().height();
    treeCanvas.width = canvas.width;
    treeCanvas.height = canvas.height;    
    width = canvas.width;
    height = canvas.height;
}

function getPosition(e) {
    pos.x = e.clientX - treeCanvas.offsetLeft;
    pos.y = e.clientY - treeCanvas.offsetTop - HEADER_HEIGHT;
}

function startDraw(e) {
    draw = true;
    getPosition(e);
}

function stopDraw() {
    draw = false;
}

function flipY(y) {
    if (y > height / 2) {
        return (height / 2 - y) + (height / 2);
    }
    return (height / 2) - (y - height / 2);
}

function mapPositionToLandscapeColor(y) {
    // Water
    if (y < height / 2 + WATER_RANGE && y > height / 2 - WATER_RANGE) {
        return 'blue';
    }
    if (y < height / 2 + FOREST_RANGE && y > height / 2 - FOREST_RANGE) {
        return 'orange';
    }
    if (y < height / 2 + MOUNTAIN_RANGE && y > height / 2 - MOUNTAIN_RANGE) {
        return 'grey';
    }
    return 'white';
}

function drawTree(x, y, flippedY) {
    const TREE_HEIGHT = 40;
    const TREE_WIDTH = 10;
    const TREE_COLORS = ['#9A7B4F', '#C0C0C0', '#65350F'];
    const LEAF_COLORS = ['#3F704D', '#D6B85A', '#CC5801']

    aboveY = y > flippedY ? flippedY : y;
    belowY = aboveY == flippedY ? y : flippedY;
    var treeColor = TREE_COLORS[Math.floor(Math.random() * TREE_COLORS.length)];
    var leafColor = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];

    // First Tree
    treeCtx.fillStyle = treeColor;
    treeCtx.beginPath();
    treeCtx.moveTo(x - TREE_WIDTH, aboveY);
    treeCtx.lineTo(x + TREE_WIDTH, aboveY);
    treeCtx.lineTo(x, aboveY - TREE_HEIGHT);
    treeCtx.fill();

    // First Leaf
    treeCtx.lineWidth = 0;
    treeCtx.fillStyle = leafColor;

    treeCtx.beginPath();
    treeCtx.arc(x - 5, aboveY - TREE_HEIGHT + 10, 12, 0, 2 * Math.PI);
    treeCtx.fill();
    treeCtx.beginPath();
    treeCtx.arc(x, aboveY - TREE_HEIGHT, 15, 0, 2 * Math.PI);
    treeCtx.fill();
    treeCtx.beginPath();
    treeCtx.arc(x + 12, aboveY - TREE_HEIGHT + 5, 10, 0, 2 * Math.PI);
    treeCtx.fill();

    // Reflection Tree
    treeCtx.fillStyle = treeColor;
    treeCtx.beginPath();
    treeCtx.moveTo(x - TREE_WIDTH, belowY);
    treeCtx.lineTo(x + TREE_WIDTH, belowY);
    treeCtx.lineTo(x, belowY + TREE_HEIGHT);
    treeCtx.fill();

    // Reflection Leaf
    treeCtx.lineWidth = 0;
    treeCtx.fillStyle = leafColor;

    treeCtx.beginPath();
    treeCtx.arc(x - 5, belowY + TREE_HEIGHT - 10, 12, 0, 2 * Math.PI);
    treeCtx.fill();
    treeCtx.beginPath();
    treeCtx.arc(x, belowY + TREE_HEIGHT, 15, 0, 2 * Math.PI);
    treeCtx.fill();
    treeCtx.beginPath();
    treeCtx.arc(x + 12, belowY + TREE_HEIGHT - 5, 10, 0, 2 * Math.PI);
    treeCtx.fill();
}

function fillToMiddle(x, y) {
    if (y > height / 2) {
        y = flipY(y);
    }

    color = mapPositionToLandscapeColor(y);
    ctx.lineCap = 'square';

    if (color == 'white') {
        ctx.strokeStyle = color;
        flippedY = flipY(y);
        ctx.beginPath();
        ctx.moveTo(x, y);
        var randomPerturbation = (Math.random() * 20);
        y = height / 2 - MOUNTAIN_RANGE + randomPerturbation;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, flippedY);
        flippedY = height / 2 + MOUNTAIN_RANGE - randomPerturbation;
        ctx.lineTo(x, flippedY);
        ctx.stroke();
        color = 'grey';

    }
    if (color == 'grey') {
        ctx.strokeStyle = color;
        flippedY = flipY(y);
        ctx.beginPath();
        ctx.moveTo(x, y);
        y = height / 2 - FOREST_RANGE;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, flippedY);
        flippedY = height / 2 + FOREST_RANGE;
        ctx.lineTo(x, flippedY);
        ctx.stroke();

        color = 'orange';
    }
    if (color == 'orange') {
        ctx.strokeStyle = color;
        topY = y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        y = flipY(y);
        ctx.lineTo(x, y);
        ctx.stroke();
        while (Math.random() > 0.9) {
            treeY = Math.random() * (topY - y) + y;
            drawTree(x, treeY, flipY(treeY));
        }
    }
    if (color == 'blue') {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        y = flipY(y);
        ctx.lineTo(x, y);
        ctx.stroke(); 
    }

}

function sketch(e) {
    if (!draw) return;
    
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = mapPositionToLandscapeColor(pos.y);

    // Main Line
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    firstPos = pos;
    getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Reflection Line
    ctx.beginPath();
    ctx.moveTo(firstPos.x, flipY(firstPos.y));
    ctx.lineTo(pos.x, flipY(pos.y));
    ctx.stroke();

    // Trees
    if (mapPositionToLandscapeColor(pos.y) === 'orange' && Math.random() > 0.96) {
        drawTree(pos.x, pos.y, flipY(pos.y));
    }

    // Fill to middle
    fillToMiddle(pos.x, pos.y);
}

function drawClouds() {
    ctx.fillStyle = '#DDDDDD';
    // Cloud 1
    ctx.beginPath();
    ctx.arc(200, 150, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300, 120, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(400, 135, 80, 0, 2 * Math.PI);
    ctx.fill();

    // Cloud 1 Flipped
    ctx.beginPath();
    ctx.arc(200, height - 150, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(300, height - 120, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(400, height - 135, 80, 0, 2 * Math.PI);
    ctx.fill();

    // Cloud 2
    ctx.beginPath();
    ctx.arc(1020, 220, 70, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1120, 180, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1220, 200, 50, 0, 2 * Math.PI);
    ctx.fill();

    // Cloud 2 Flipped 
    ctx.beginPath();
    ctx.arc(1020, height - 220, 70, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1120, height - 180, 100, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1220, height - 200, 50, 0, 2 * Math.PI);
    ctx.fill();

    // Cloud 3 
    ctx.beginPath();
    ctx.arc(1620, 150, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1700, 120, 80, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1800, 130, 70, 0, 2 * Math.PI);
    ctx.fill();

    // Cloud 3 Flipped
    ctx.beginPath();
    ctx.arc(1620, height - 150, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1700, height - 120, 80, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1800, height - 130, 70, 0, 2 * Math.PI);
    ctx.fill();
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    treeCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);

    treeCtx.strokeStyle = "rgba(100,100,100,1)";
    treeCtx.lineWidth = 5;
    treeCtx.lineCap = 'square';
    treeCtx.beginPath();
    treeCtx.moveTo(0, canvas.height / 2);
    treeCtx.lineTo(canvas.width, canvas.height / 2);
    treeCtx.stroke();

    draw = false;
    drawClouds();
    pos = {x:0, y:0};
    draw = false;
}


$(document).ready(function() {
    canvas = $("#canvas")[0];
    treeCanvas = $("#treecanvas")[0];
    ctx = canvas.getContext("2d");
    treeCtx = treeCanvas.getContext("2d");
    
    resize();
    reset();

    $(treeCanvas).on("mousedown", startDraw);
    $(treeCanvas).on("mouseup", stopDraw);
    $(treeCanvas).on("mousemove", sketch);
    $(window).on("resize", resize);
    $("#clear").on("click", reset);
});