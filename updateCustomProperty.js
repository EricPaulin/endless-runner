// helper funcitons

// convert CSS string to float (or default to 0)
export function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}

// setting CSS stlye
export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
}

// combines both functions
export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc);
}