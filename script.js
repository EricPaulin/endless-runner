import { setupFloor, updateFloor } from './floor.js';
import { setupPlayer, updatePlayer, getPlayerRect, setPlayerLose } from './player.js';
import { setupObstacle, updateObstacle, getObjectRects } from './obstacle.js';

const CONTAINER_WIDTH = 100;
const CONTAINER_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const container = document.querySelector('[data-container]');
const score = document.querySelector('[data-score]');
const highScore = document.querySelector('[data-high-score]');
const messageScreen = document.querySelector('[data-message-screen]');
const message1 = document.querySelector('.message1');

const jumpBtn = document.querySelector('.jumpBtn');

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });
jumpBtn.addEventListener("click", handleStart, { once: true });

let lastTime;
let speedScale;
let currScore;
let currHighScore;

/* update frames */
function update(time) {

    // if NaN
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }

    // make sure delta is correct time
    const delta = time - lastTime;

    updateFloor(delta, speedScale);
    updatePlayer(delta, speedScale);
    updateObstacle(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    // check if loss
    if (loseCondition()) {
        return handleLose();
    }

    lastTime = time;
    window.requestAnimationFrame(update);
}


/* Determine Loss */
function loseCondition() {
    const playerRect = getPlayerRect();
    return getObjectRects().some(rect => isCollision(rect, playerRect));
}


/* checks collision conditions */
function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}


/* calculates speed */
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}


/* calulates score  */
function updateScore(delta) {
    currScore += delta * 0.1;
    score.textContent = Math.floor(currScore);
}


/* init game */
function handleStart() {
    // make sure high score isn't blank
    if (currHighScore == null) {
        highScore.innerHTML = "";
    }

    // remove start contidion until loss
    document.removeEventListener("keydown", handleStart, { once: true })
    jumpBtn.removeEventListener("click", handleStart, { once: true });


    jumpBtn.innerHTML = "Jump";

    // properly updates time on each game
    lastTime = null;
    speedScale = 1;
    currScore = 0;
    setupFloor();
    setupPlayer();
    setupObstacle();
    messageScreen.classList.add("hide");
    highScore.classList.add("hide");
    // works with monitor refresh rate
    window.requestAnimationFrame(update);
}


/* lose condition */
function handleLose() {
    setPlayerLose();

    // set Game Over Screen + set High Score
    if (currHighScore == null) {
        currHighScore = Math.ceil(currScore);
        highScore.innerHTML = `High Score: ${currHighScore}`
    }
    if (currScore > currHighScore) {
        currHighScore = Math.ceil(currScore);
        highScore.innerHTML = `High Score: ${currHighScore}`;
    }

    message1.innerHTML = "Game Over";

    // prevent immediate playback
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true });
        jumpBtn.addEventListener("click", handleStart, { once: true });
        messageScreen.classList.remove("hide");
        highScore.classList.remove("hide");
    }, 850)
}


/* responsive screen sizing */
function setPixelToWorldScale() {
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < CONTAINER_WIDTH / CONTAINER_HEIGHT) {
        worldToPixelScale = window.innerWidth / CONTAINER_WIDTH;
    }
    else {
        worldToPixelScale = window.innerHeight / CONTAINER_HEIGHT;
    }

    container.style.width = `${CONTAINER_WIDTH * worldToPixelScale}px`;
    container.style.height = `${CONTAINER_HEIGHT * worldToPixelScale}px`;
}
