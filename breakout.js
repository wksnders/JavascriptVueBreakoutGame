

//get canvas
//single quote for default strings
var canvas = document.getElementById('game-canvas'); //convention to end ;
var {width, height} = canvas;
var context = canvas.getContext('2d');//other render context is web gl
//dont make raw web gl

//mdn documentation

//make a box

//listen for dom event mouse point mv

//rendering loop
//ms since landed on page  (float)
var paddleX = 0;
var paddleY = 360;
var paddleWidth = 100;
var paddleHeight = 10;
var paddleXSpeed = 250;

var lastTime = 0;
var vsyncLoop = function (time) {
    //pass by val
    // Boolean
    // Number
    // String
    //pass by ref
    // Array
    // Object
    // function

    //schedule work for next frame
    requestAnimationFrame(vsyncLoop);

    var deltaTime = (time-lastTime)/1000; //fractions of a second
    lastTime = time;
    console.log('vsyncLoop : deltaTime',deltaTime);

    context.fillStyle = '#0002';
    context.fillRect(0, 0, width, height);

    paddleX += paddleXSpeed * deltaTime;
    paddleX %= width;

    context.fillStyle = '#FFF';
    context.fillRect(
        paddleX - (paddleWidth/2),
        paddleY,
        paddleWidth,
        paddleHeight
    );

    //empty
};
//call it the first time
requestAnimationFrame(vsyncLoop);
//updates state of the page