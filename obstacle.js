import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

// make obstacle and floor speed equal
const SPEED = 0.05;
const OBSTACLE_INTERVAL_MIN = 700;
const OBSTACLE_INTERVAL_MAX = 2000;

const container = document.querySelector('[data-container]');

let nextObstacleTime;

export function setupObstacle() {
    // init obstacle interval
    nextObstacleTime = OBSTACLE_INTERVAL_MIN;
    // remove obstacles from prev game
    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        obstacle.remove();
    });
}

export function updateObstacle(delta, speedScale) {

    document.querySelectorAll('[data-obstacle]').forEach(obstacle => {
        incrementCustomProperty(obstacle, "--left", delta * speedScale * SPEED * -1);

        // remove object when out of frame
        if (getCustomProperty(obstacle, "--left") <= -100) {
            obstacle.remove();
        }
    });

    // summon Obstacle
    if (nextObstacleTime <= 0) {
        createObstacle();
        nextObstacleTime = randomRange(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale;
    }
    // decrements to signal next obstacle
    nextObstacleTime -= delta;
}


/* get obstacle hitbox */
export function getObjectRects() {
    return [...document.querySelectorAll('[data-obstacle]')].map(obstacle => {
        return obstacle.getBoundingClientRect();
    })
}


/* loads obstacle into game */
function createObstacle() {
    const obstacle = document.createElement("img");
    obstacle.dataset.obstacle = true;
    obstacle.src = "./images/cactus.png";
    obstacle.classList.add("obstacle");
    // moves to far right end of screen 
    setCustomProperty(obstacle, "--left", 100);
    container.append(obstacle);
}

    // might move to inside (one liner)
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
