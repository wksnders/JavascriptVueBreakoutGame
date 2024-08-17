//single quote for default strings
//convention to end lines;

//pass by val
// Boolean
// Number
// String
//pass by ref
// Array
// Object
// function
//mdn documentation

//get canvas
var canvas = document.getElementById('game-canvas'); 
var {width: canvasWidth, height: canvasHeight} = canvas;
var context = canvas.getContext('2d');
//other render context is web gl, dont make raw web gl

//game initial values ************************
var currentScore;
var victoryScore;

//game state
var isPaused = false;
var isGameOver = false;
var isBallOffScreen = false;
var isBallStopped = true;
var isBallStartMove = false;

//paddle
var paddleTargetXPos = 0;
var rightPressed = false;
var leftPressed = false;
var isMouseUsed = false;

//bricks
var bricks = new Array();

//game settings
var highScore;

//bricks
var brickHeight;
var brickStartY;
var brickWidth;
var brickStartX;
var brickPaddingY;
var brickPaddingX;

//paddle
const paddleStartX = canvasWidth/2;
const paddleStartY = 360;
const paddleWidth = 100;
const paddleHeight = 10;
var paddle;
var paddleMovementPadding;
var paddleXMin;
var paddleXMaxn;
var paddleSpeed;

//ball settings
const ballStartX = canvasWidth/2;
const ballStartY = 333;
const ballSize = 40;
const ballStartVelocityY = 100;
var ball;

//screen bounds
var b_minX;
var b_maxX;
var b_minY;



//mouse movement
var updateMousePos = function(event){
    console.log('updateMousePos : mouseX', event.offsetX, 'mouseY',event.offsetY);
    paddleTargetXPos = event.offsetX % canvasWidth;
}
canvas.addEventListener('mousemove', updateMousePos, false);
canvas.addEventListener("mouseenter", () => isMouseUsed = true, false);
canvas.addEventListener("mouseleave", () => isMouseUsed = false, false);
canvas.addEventListener("click", () => {
    if(isBallStopped){
        isBallStartMove = true;
    }
    console.log('ball Start : isBallStartMove', isBallStartMove);
});

//represents a sprite to be rendered on screen
class Sprite {//cap -> need to invoke it with keyword new
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
    update(deltaTime){
        this.setPosition(
            this.positionX + (deltaTime * this.velocityX),
            this.positionY + (deltaTime * this.velocityY)
        );
        if(this.angVel != 0){
            this.setRotation(
                this.rotation + (this.angVel * deltaTime)
            );
        }
    }
}

class brickSprite extends Sprite{
    constructor(id,height,width,score,row,col){
        super(id,height,width)
        this.score = score;
        this.row = row;
        this.col = col;
    }
}

var gameOver = function(){
    isPaused = true;
    isGameOver = true;
    if(currentScore > highScore){
        highScore = currentScore;
    }
}



var createBricks = function(){
    var brickScore = 1;
    var count = 0;
    bricks.length = 0; // Empty the array
    for (let row = 0; row < 5; row++) {
        // Runs 5 times, with values of row 0 through 4.
        for (let col = 0; col < 5; col++) {
            victoryScore += brickScore;
            count++;
            var brick = new brickSprite(
                'brick'.concat(count),
                brickHeight,
                brickWidth,
                brickScore,
                row,
                col
            );
            bricks.push(brick);
        }
    }
}
var activateAndPositionBrick = function(brick){
    brick.setActive(true);
    var brickXPos = brickStartX + ((brickWidth + brickPaddingX) * brick.row)
    var brickYPos = brickStartY + ((brickHeight + brickPaddingY) * brick.col)
    brick.setPosition(
        brickXPos,
        brickYPos
    );
}

var brickCollision = function(brick,newX,newY){
    if(!brick.active || !ball.active){
        return false;
    }
    if(!testCollision(ball,brick)){
        return false;
    }
    //TODO brick worth more than 1 point?
    currentScore += brick.score;
    
    console.log('brickCollision : ball.positionX - brick.positionX ',
        Math.abs(ball.positionX - brick.positionX),
        'brick.width + ball.width/2 ',
        ((brick.width + ball.width)/2)
    );
    if(Math.abs(ball.positionX - brick.positionX) < ((brick.width)/2)){
        //redirect Y
        ball.velocityY = newY;
        console.log('brickCollision : YRedirect ball.velocityY ',ball.velocityY);
    }
    else{
        //redirect X
        ball.velocityX = newX;
        console.log('brickCollision : XRedirect ball.velocityX ',ball.velocityX);
    }
    
    console.log('brickCollision :  ball.positionX ',ball.positionX, 'ball.positionY',ball.positionY);
    console.log('brickCollision :  brick.positionX ',ball.positionX, 'brick.positionY',ball.positionY);
    brick.setActive(false);
    console.log('brickCollision : score ',currentScore);
    return true;
}

var activateAndPositionBricks = function(){
    bricks.forEach(brick => activateAndPositionBrick(brick))
}
activateAndPositionBricks();

var testCollision = function(sprite1,sprite2){
    var sprite1XNegative = sprite1.positionX - (sprite1.width/2)
    var sprite1XPositive = sprite1.positionX + (sprite1.width/2)
    var sprite1YNegative = sprite1.positionY - (sprite1.height/2)
    var sprite1YPositive = sprite1.positionY + (sprite1.height/2)

    var sprite2XNegative = sprite2.positionX - (sprite2.width/2)
    var sprite2XPositive = sprite2.positionX + (sprite2.width/2)
    var sprite2YNegative = sprite2.positionY - (sprite2.height/2)
    var sprite2YPositive = sprite2.positionY + (sprite2.height/2)

    return (
        sprite1XNegative < sprite2XPositive &&
        sprite1XPositive > sprite2XNegative &&
        sprite1YNegative < sprite2YPositive &&
        sprite1YPositive > sprite2YNegative
    );
}

var onUpdate = function(deltaTime){
    if(isPaused){
        return;
    }

    console.log('onUpdate : ball.positionX',ball.positionX);
    console.log('onUpdate : paddle.positionX',paddle.positionX);
    console.log('onUpdate : ball.positionY',ball.positionY);

    if(ball.positionY > canvasHeight){
        isBallOffScreen = true;
    }
    else{
        isBallOffScreen = false;
    }

    if(isBallOffScreen){
        lives -= 1;
        if(lives <= 0 || (currentScore >= victoryScore)){
            gameOver();
        }
        else{
            //reset ball for new life
            ball.velocityX = 0;
            ball.velocityY = 0;
            ball.setPosition(ballStartX,ballStartY);
            //reset bools
            isBallStartMove = false;
            isBallStopped = true;
        }
        paddle.velocityX = 0;
        console.log('onUpdate : lost a life');
        return;
    }

    //player input, paddle move left/right
    console.log('onUpdate : isMouseUsed', isMouseUsed,);
    if(isMouseUsed){
        console.log('onUpdate : paddleTargetXPos', paddleTargetXPos);
        //mouse controlled movement
        if(paddle.positionX < paddleTargetXPos){
            //move left
            paddle.velocityX = paddleSpeed;
            console.log('onUpdate : paddle.velocityX', paddle.velocityX);
        }
        else{
            //move right
            paddle.velocityX = -paddleSpeed;
            console.log('onUpdate : paddle.velocityX', paddle.velocityX);

        }
    }
    else{
        //TODO movement control without mouse
            //paddle.velocityX = paddleSpeed;
    }


    //if ball is stopped (new life) then give it initial velocity
    if(isBallStopped){
        ball.positionX = paddle.positionX;//match ball and paddle
        if(isBallStartMove){
            ball.velocityX = paddle.velocityX;
            ball.velocityY = ballStartVelocityY;
            isBallStopped = false;
            isBallStartMove = false;
        }
    }

    
    ball.update(deltaTime);
    paddle.update(deltaTime);
    //dont let paddle go off screen
    if (paddle.positionX < paddleXMin){
        paddle.positionX = paddleXMin;
    }
    else if(paddle.positionX > paddleXMax){
        paddle.positionX = paddleXMax;
    }
    //dont move past mouse
    /*if(isMouseUsed
        && paddle.positionX
    )*/


    //dont let ball go off screen at top or sides
    if(ball.positionX < b_minX){
        ball.positionX = b_minX;
        ball.velocityX = -ball.velocityX;
    }
    else if (ball.positionX > b_maxX){
        ball.positionX = b_maxX
        ball.velocityX = -ball.velocityX;
    }
    if(ball.positionY  < b_minY){
        ball.positionY = b_minY;
        ball.velocityY = -ball.velocityY;
    }


    //ball/brick collisions
    var newXVelo = (-1 * ball.velocityX);
    var newYVelo = (-1 * ball.velocityY);
    bricks.forEach(brick => brickCollision(brick,newXVelo,newYVelo));

    //ball/paddle collision
    if(ball.active){
        var colliding = testCollision(paddle,ball);
        if(colliding && ball.positionY <= paddle.positionY){

            ball.positionY = ballStartY;
            ball.velocityY = -ball.velocityY; //add speedup factor
        }
    }
    
    console.log('onUpdate : collision ball/paddle',
        testCollision(ball,paddle)
    );

}

var drawBoxSprite = function(sprite,color){
    if(!sprite.active){
        return;
    }
    context.fillStyle = color;
    context.fillRect(
        sprite.positionX - (sprite.width/2),
        sprite.positionY - (sprite.height/2),
        sprite.width,
        sprite.height
    );
}

var drawBricks = function(){
    bricks.forEach(sprite => drawBoxSprite(sprite,'#F00'))
}

var drawBall = function(){
    if (ball.active) {
        context.beginPath();
        context.arc(
            ball.positionX,
            ball.positionY,
            ball.height / 2,
            0,
            2 * Math.PI
        );
        context.fillStyle = '#FFF';
        context.fill();
    }
}

function drawGameOver() {
    if (currentScore >= victoryScore) {
        //victory screen
        drawText(
            'You Win!'.concat((highScore || 0)),
            (canvasWidth / 2),
            (canvasHeight / 2) + 40
        );
        drawText(
            'Score : '.concat((currentScore || 0)),
            (canvasWidth / 2),
            (canvasHeight / 2) - 20
        );

    }
    else {
        //you lose!
        drawText(
            'GAME OVER',
            (canvasWidth / 2),
            (canvasHeight / 2) - 30,
            '40px serif'
        );
        drawText(
            'Score : '.concat((currentScore || 0)),
            (canvasWidth / 2),
            (canvasHeight / 2) + 20
        );
    }
}


var drawText = function(text,xPos,yPos, font = '18px serif'){
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle'
    context.fillStyle = '#FFF';
    context.fillText(text, xPos, yPos);
}

//rendering loop
var lastTime = 0;
//time is ms since landed on page  (float)
var vsyncLoop = function (time) {

    //schedule work for next frame
    requestAnimationFrame(vsyncLoop);

    var deltaTime = (time-lastTime)/1000; //fractions of a second
    lastTime = time;
    console.log('vsyncLoop : deltaTime',deltaTime);

    onUpdate(deltaTime);

    //Clear old content
    context.fillStyle = '#0002';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    
    drawBricks();

    if(isGameOver){
        console.log('vsyncLoop : Game Over');
        drawGameOver();
        return;
    }

    drawBoxSprite(paddle,'#FFF');

    drawBall();


    drawText('Score : '.concat((currentScore || 0)), 50,15);
    drawText('Lives : '.concat((lives || 0)), 50,35);
    drawText('High Score : '.concat((highScore || 0)), canvasWidth - 100,20);
};


//called whenever the game is started or restarted
var onGameStart = function(){
    
    isGameOver = false;
    isPaused = false;
    currentScore = 0;
    lives = 3;
    //activate and position bricks
    activateAndPositionBricks();
    //position paddle
    paddle.setPosition(paddleStartX,paddleStartY);
    //position ball
    ball.setPosition(ballStartX,ballStartY);

    //set ball to not move yet
    isBallStopped = true;
    isBallStartMove = false;
}

//called with config settings
var onInitialize = function(config = {}){
    //game settings
    highScore = config.highScore || 0;
    victoryScore = config.victoryScore || 0;//create bricks handles this

    //bricks
    
    brickHeight = config.brickHeight || 20;
    brickStartY = 50 + (brickHeight/2);
    brickWidth = config.brickWidth || 80;
    brickStartX = 20 + (brickWidth/2);
    brickPaddingY = 10;
    brickPaddingX = 15;

    //paddle
    paddle = new Sprite(
        'paddle',
        config.paddleHeight || 10,
        config.paddleWidth || 100
    );
    paddleMovementPadding = config.paddleMovementPadding || 2;
    paddleXMin = (paddle.width/2) + paddleMovementPadding;
    paddleXMax = canvasWidth - paddleXMin;
    paddleSpeed = config.paddleSpeed || 200;

    //create ball sprite
    ball = new Sprite('ball',ballSize,ballSize);

    
    //screen bounds
    b_minX = ball.width/2;
    b_maxX = canvasWidth - ball.width/2;
    b_minY = 0 + ball.height/2;

    //TODO setup inputs
    
    createBricks();

    onGameStart();

    
}

//load from json file
//or parse csv, colnames : values
onInitialize({brickHeight : 20});

//call it the first time
requestAnimationFrame(vsyncLoop);
//updates state of the page

const { createApp, ref } = Vue

createApp({
    setup() {
        const brickHeight = ref(20)
        const brickWidth = ref(80)//observability, update template dependant on it.
        const submitForm = function () {
            onInitialize({
                brickHeight : brickHeight.value,
                brickWidth : brickWidth.value,
            });
        }
        return {
            brickHeight,
            brickWidth,
            submitForm
        }
    }
}).mount('#app')




