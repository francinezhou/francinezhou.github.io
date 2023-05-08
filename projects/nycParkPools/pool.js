


function mouseWheel(event) {
    if (event.x < width/2) {
        leftDiv.elt.scrollTop += event.deltaY;
    } else {
        rightDiv.elt.scrollTop += event.deltaY;
    }
}