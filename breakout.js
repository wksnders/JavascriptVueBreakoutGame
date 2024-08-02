//single quote for default strings
//convention to end lines;
//var Vector = require("vector2js");
//get canvas
var canvas = document.getElementById('game-canvas'); 
var {screenWidth, screenHeight} = canvas;
var context = canvas.getContext('2d');
//other render context is web gl, dont make raw web gl

//mdn documentation
/*
var isPaused = true;
var isGameOver = false;

var lives = 3;
var highScore = 0;
var score = 0;*/


//bricks = [];
// paddle = nil
// ball = nil

var rightPressed = false;
var leftPressed = false;


//listen for dom event mouse point mv


//ms since landed on page  (float)
var paddleX = 0;
var paddleY = 360;
var paddleWidth = 100;
var paddleHeight = 10;
var paddleXSpeed = 250;
/*
const paddleStart = new Vector(0, 360)
const ballStart = new Vector(0, 330)

//called once
var onInitialize = function(){
    //setup inputs
    
    //create paddle
    
    //create ball
    
    //
    OnGameStart();
}

//called whenever the game is started or restarted
var OnGameStart = function(){
    //destroy bricks if exist

    //CreateBricks()

    //position paddle
    //position ball

    //set ball to not move yet
}*/

//rendering loop
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
    context.fillRect(0, 0, screenWidth, screenHeight);

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




/*
class sprite {
    constructor(id,height,width){
        this.id = id;
        this.active = true;
        this.position = new Vector(0, 0);
        this.rotation = 0;
        this.height = height;
        this.width = width;
        this.velocity = new Vector(0, 0);
        this.angVel = 0
    }
    setActive(active){
        this.active = active;
    }
    setPosition(position){
        this.position = position;
    }
    setRotation(rotation){
        this.rotation = rotation;
    }
    setSize(height,width){
        this.height = height;
        this.width = width;
    }
    Update(){
        this.setPosition(
            sprite.position + (deltaTime * sprite.velocity)
        );
        if(angVel != 0){
            this.setRotation(
                sprite.rotation + (sprite.angVel * deltaTime)
            );
        }
    }
}*/


