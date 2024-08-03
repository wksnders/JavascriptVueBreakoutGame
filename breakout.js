//single quote for default strings
//convention to end lines;

//get canvas
var canvas = document.getElementById('game-canvas'); 
var {width, height} = canvas;
var context = canvas.getContext('2d');
//other render context is web gl, dont make raw web gl

//mdn documentation

var isPaused = true;
var isGameOver = false;

var lives = 3;
var highScore = 0;
var score = 0;


//bricks = [];

var rightPressed = false;
var leftPressed = false;


//listen for dom event mouse point mv
class sprite {
    constructor(id,height,width){
        this.id = id;
        this.active = true;
        this.positionX = 0;
        this.positionY = 0;
        this.rotation = 0;
        this.height = height;
        this.width = width;
        this.velocityX = 0;
        this.velocityY = 0;
        this.angVel = 0
    }
    setActive(active){
        this.active = active;
    }
    setPosition(x,y){
        this.positionX = x;
        this.positionY = y;
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
            this.positionX + (deltaTime * sprite.velocityX),
            this.positionY + (deltaTime * sprite.velocityY)
        );
        if(angVel != 0){
            this.setRotation(
                sprite.rotation + (sprite.angVel * deltaTime)
            );
        }
    }
}

//ms since landed on page  (float)
const paddleStartX = 0;
const paddleStartY = 360;
var paddle = new sprite('paddle',10,100);
paddle.setPosition(paddleStartX,paddleStartY);

var paddleXSpeed = 250;

const ballStartX = 0;
const ballStartY = 330;
var ball = new sprite('ball',20,20);

//called once
var onInitialize = function(){
    //setup inputs
    
    //create paddle
    //var paddle = new sprite('paddle',10,100);
    
    //create ball
    //ball = new sprite('ball',20,20);
    //
    OnGameStart();
}

//called whenever the game is started or restarted
var OnGameStart = function(){
    //destroy bricks if exist

    //CreateBricks()

    //position paddle
    paddle.setPosition(paddleStartX,paddleStartY);
    //position ball
    ball.setPosition(ballStartX,ballStartY)

    //set ball to not move yet
}

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
    context.fillRect(0, 0, width, height);

    paddle.positionX += paddleXSpeed * deltaTime;
    paddle.positionX %= width;

    context.fillStyle = '#FFF';
    context.fillRect(
        paddle.positionX - (paddle.width/2),
        paddle.positionY,
        paddle.width,
        paddle.height
    );

    //empty
};
//call it the first time
requestAnimationFrame(vsyncLoop);
//updates state of the page








