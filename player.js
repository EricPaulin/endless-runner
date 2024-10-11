import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const player = document.querySelector('[data-player]');

const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
// only 2 frames 
    // change when importing multiple custom frames
const PLAYER_FRAME_COUNT = 3;
    // every frame lasts 100ms
const FRAME_TIME = 150;

let isJumping;
let playerFrame;
let currFrameTime;
let yVelocity;

export function setupPlayer() {
    isJumping = false;
    playerFrame = 0;
    currFrameTime = 0;
    yVelocity = 0;

    setCustomProperty(player, "--bottom", 0);

    //every reset we remove and reset onJump listener
    document.removeEventListener("keydown", onJump);
    document.addEventListener("keydown", onJump);
}


export function updatePlayer(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
} 


/* get player hitbox */
export function getPlayerRect() {
    return player.getBoundingClientRect();
}


/* lose sprite */
export function setPlayerLose() {
    //player.src = "./images/dino-lose.png";
    player.src = "./images/blob_lose.png";
}

  
/* config run */
function handleRun(delta, speedScale) {
    // stationary image on jump
    if (isJumping) {
        //player.src = `./images/dino-stationary.png`;
        player.src = `./images/blob_jump.png`;
        return;
    }
    // run animation
    if (currFrameTime >= FRAME_TIME) {
        playerFrame = (playerFrame + 1) % PLAYER_FRAME_COUNT;
        //player.src = `./images/dino-run-${playerFrame}.png`;
        player.src = `./images/blob_run_${playerFrame}.png`;

        //reset frametime
        currFrameTime -= FRAME_TIME;
    }
    // animation change faster as time goes on
    currFrameTime += delta * speedScale;
}

/* config jump */
function handleJump(delta) {
    // ignore running
    if (!isJumping) {
        return;
    }

    incrementCustomProperty(player, "--bottom", yVelocity * delta);
    
    // if on ground
    if (getCustomProperty(player, "--bottom") <= 0) {
        setCustomProperty(player, "--bottom", 0);
        isJumping = false;
    }

    // jump scales with frame rate
    yVelocity -= GRAVITY * delta;
}

// event listener
function onJump(e) {
    // cannot combo jumps
    if (e.code !== "Space" || isJumping) {
        return;
    }

    yVelocity = JUMP_SPEED;
    isJumping = true;
}