'use strict';

const body = document.querySelector('body');
let ball;
let ballLeft = 0;
let ballRight = 0;
let ballBottom = 0;
let ballTop = 0;
let ballWidth = 0;
let base = 0;
let bar;
let bodyWidth = 0;
let bodyHeight = 0;
let count = 0;
let degree = 0;
let initialPosition = 0;
let keyPressed = '';
let leftPosition = 0;
let max = 5;
let min = -5;
let minTileWidth = 100;
let minTileHeight = 50;
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;
let platform;
let platformWidth = 0;
let platformBottom = 0;
let platformTop = 0;
let platformRight = 0;
let platformLeft = 0;
let radian = 0;
let rightPosition = 0;
let shift = 0;
let startGame = false;
let startPosition = 0;
let tilesContainer;
let tile;
let tileArray = [];
let tileBox = {};
let tilesColumns = 0;
let tilesContainerWidth = 0;
let tilesContainerHeigth = 0;
let tileNodeList;
let tilesRows = 0;
window.addEventListener('load', preGame);
window.addEventListener('keydown', moveBar);

function preGame() {
    
    bodyWidth = Math.floor(body.getBoundingClientRect().width);
    bodyHeight = Math.floor(body.getBoundingClientRect().height);
    
    platform = document.createElement('div');
    platform.classList.add('bar');
    body.appendChild(platform);
    
    platformWidth = Math.floor(platform.getBoundingClientRect().width);
    rightPosition = bodyWidth / 2 - platformWidth / 2;
    leftPosition = bodyWidth / 2 - platformWidth / 2;
    platform.style.right = `${rightPosition}px`;
    platform.style.left = `${leftPosition}px`;
    platformTop = Math.floor(platform.getBoundingClientRect().top);
    platformBottom = Math.floor(platform.getBoundingClientRect().bottom);
    
    ball = document.createElement('div');
    ball.classList.add('ball');
    body.appendChild(ball);
    ballWidth = Math.floor(ball.getBoundingClientRect().width);
    
    makeTiles();
    startPosition = Math.random() * (bodyWidth);
    ball.style.left = `${startPosition}px`; 
    startPosition = startPosition + ballWidth;
    ball.style.right = `${startPosition}px`;
    
    shift = Math.random() * (max - min) + min;
    shift = Math.floor(shift);
    game();
}

function makeTiles() {

    tilesContainer = document.createElement('div');
    tilesContainer.classList.add('tilesContainer');
    tilesContainerWidth = 0.6 * bodyWidth;
    tilesContainerHeigth = 0.4 * bodyHeight;
    tilesColumns = (tilesContainerWidth) / minTileWidth;
    tilesColumns = Math.floor(tilesColumns);
    tilesRows = tilesContainerHeigth / minTileHeight;
    tilesRows = Math.floor(tilesRows);
    tilesContainer.style.gridTemplateColumns = `repeat(${tilesColumns}, 1fr)`;
    tilesContainer.style.gridTemplateRows = `repeat(${tilesRows}, 1fr)`;
    body.appendChild(tilesContainer);
    ball.style.top = `${tilesContainer.getBoundingClientRect().bottom + 10}px`;

    for (let i = 0; i < tilesColumns * tilesRows; i++) {
        tile = document.createElement('div');
        tile.classList.add('tile');
        tilesContainer.appendChild(tile);
        tileBox = new Object();
        tileBox['index'] = i;
        tileBox['top'] = Math.floor(tile.getBoundingClientRect().top);
        tileBox['right'] = Math.floor(tile.getBoundingClientRect().right);
        tileBox['bottom'] = Math.floor(tile.getBoundingClientRect().bottom);
        tileBox['left'] = Math.floor(tile.getBoundingClientRect().left);
        tileArray.push(tileBox);
    }

    tileNodeList = document.querySelectorAll('.tile');
}

function moveBar(keyInput) {

    platformRight = platform.getBoundingClientRect().right;
    platformLeft = platform.getBoundingClientRect().left;
    platformRight = bodyWidth - platformRight;

    if (keyInput.key === 'Enter') {
        startGame = true;
    }
    
    if (keyInput.key === 'ArrowRight') {
        if (platformRight < 10) {
            platformRight -= platformRight;
            platformLeft = bodyWidth - platformWidth;
        } else {
            platformRight -= 20;
            platformLeft += 20;           
        }
        platform.style.right = `${platformRight}px`;
        platform.style.left = `${platformLeft}px`;
    }
    
    if (keyInput.key === 'ArrowLeft') {
        if (platformLeft < 10) {
            platformLeft -= platformLeft;
            platformRight = bodyWidth - platformWidth;
        } else {
            platformRight += 20;
            platformLeft -= 20;
        }
        platform.style.right = `${platformRight}px`;
        platform.style.left = `${platformLeft}px`;
    }

}

function game() {

    platformRight = Math.floor(platform.getBoundingClientRect().right);
    platformLeft = Math.floor(platform.getBoundingClientRect().left);
    platformTop = Math.floor(platform.getBoundingClientRect().top);
    
    ballLeft = Math.floor(ball.getBoundingClientRect().left);
    ballTop = Math.floor(ball.getBoundingClientRect().top);
    ballRight = Math.floor(ball.getBoundingClientRect().right);
    ballBottom = Math.floor(ball.getBoundingClientRect().bottom);

    if (startGame === true) {
        ballMovement();
    }
    setTimeout(function() {
        game();
    }, 10);
    
}

function ballMovement() {

    //gameOver
    if (ballBottom === bodyHeight) {
        startGame = false;
        alert('Game Over');
        return;
    }
    
    for (let i = 0; i < tileArray.length; i++) {
        if (ballRight === tileArray[i].left) {
            if (ballTop >= tileArray[i].top && ballBottom <= tileArray[i].bottom) {
                moveLeft = true;
                moveRight = false;
                removeTile(i);
            }
        } else if (ballLeft === tileArray[i].right) {
            if (ballTop >= tileArray[i].top && ballBottom <= tileArray[i].bottom) {
                moveLeft = false;
                moveRight = true;   
                removeTile(i);
            }            
        } else if (ballTop === tileArray[i].bottom) {
            if (ballLeft >= tileArray[i].left && ballRight <= tileArray[i].right) {
                moveUp = false;
                removeTile(i);
            }
        } else if (ballBottom === tileArray[i].top) {
            if (ballLeft >= tileArray[i].left && ballRight <= tileArray[i].right) {
                moveUp = true;
                removeTile(i);
            }            
        }
    }    
    
    //if ball hits platform
    //add partial hit detection
    if (ballBottom === platformTop) {
        if (ballLeft >= platformLeft - 10 && ballRight <= platformRight + 10) {
            moveUp = true;
        }
    }

    //if ball hits left boundary
    if (ballLeft <= Math.abs(shift) && shift < 0) {
        moveRight = true;
    }
    
    //if ball hits right
    if(bodyWidth - ballRight <= shift && shift > 0) {
        moveLeft = true;
    }
    
    //if ball hits top
    if (ballTop === 0) {
        moveUp = false;
    }   
    
/*    if (moveUp === true && ballTop === 0) {
        moveUp = false;
    }*/
   
    if (moveUp === true) {
        ballTop -= 1;
        ball.style.top = ballTop + 'px';
    } else {
        ballTop += 1;
        ball.style.top = ballTop + 'px';
    }
   
    if (moveRight === true){
       ballLeft += shift; 
       shift = Math.abs(shift);
       moveRight = false;
   }
   
   if (moveLeft === true) {
       ballLeft += shift;
       shift = -(Math.abs(shift));
       moveLeft = false;
   }

    if (shift < 0) {
        ballLeft += shift;
        ball.style.left = ballLeft + 'px';
        ballRight += shift;
        ball.style.right = ballRight + 'px';
    } else if (shift > 0) {
        ballLeft += shift;
        ball.style.left = ballLeft + 'px';
        ballRight += shift;
        ball.style.right = ballRight + 'px';
    } else if (shift === 0) {
        return;
    }
}

function removeTile(i) {
    tileNodeList[tileArray[i].index].classList.remove('tile');
    tileNodeList[tileArray[i].index].classList.add('tileRemove');
    tileArray.splice(i, 1);
    console.log(tileArray)
}
