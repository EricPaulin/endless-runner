import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const SPEED = 0.05
const floor = document.querySelectorAll("[data-floor]");

// both floors setup
export function setupFloor() {  
    setCustomProperty(floor[0], "--left", 0);
    setCustomProperty(floor[1], "--left", 300);
}

// update floor + speed 
export function updateFloor(delta, speedScale) {
    floor.forEach(floor => {
        incrementCustomProperty(floor, "--left", delta * speedScale * SPEED * -1);

        // loops foor
        if(getCustomProperty(floor, "--left") <= -300) {
            incrementCustomProperty(floor, "--left", 600);
        }
    })
}