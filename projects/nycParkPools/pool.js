function setup() {
    createCanvas(windowWidth, windowHeight);
    leftDiv = createDiv();
    leftDiv.id('left');
    rightDiv = createDiv();
    rightDiv.id('right');
    for (let i = 0; i < 50; i++) {
        leftDiv.child(createP('Left content ' + i));
        rightDiv.child(createP('Right content ' + i));
    }
}



function mouseWheel(event) {
    if (event.x < width/2) {
        leftDiv.elt.scrollTop += event.deltaY;
    } else {
        rightDiv.elt.scrollTop += event.deltaY;
    }
}