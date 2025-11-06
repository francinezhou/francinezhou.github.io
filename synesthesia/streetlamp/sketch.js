/* - - Ellipse with GUI Controls - - */

let params = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  fill: [135, 100, 230],
  stroke: "#2b3030",
  strokeWeight: 10,
  leaf_distance: 50,
};

let gui;
let paperTexture;
let bgStartColor, bgEndColor;

function preload() {
  paperTexture = loadImage('/assets/Paper-Texture-5.jpg');
  

}


/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);

  colorMode(HSB);



  // Create GUI
  gui = new dat.GUI();
  //define MIN & MAX range of slider
  gui.add(params, 'x', -500, 500); 
  gui.add(params, 'y', -500, 500);
  gui.add(params, 'width', 10, 1000);
  gui.add(params, 'height', 10, 1000);
  gui.addColor(params, 'fill');
  gui.addColor(params, 'stroke');
  gui.add(params, 'strokeWeight', 0, 20);
  gui.add(params, 'leaf_distance', 0, 200);
  // // Add Folders
  // var folder1 = gui.addFolder('FolderNameA');
  // folder1.add(params, 'x', -500, 500);
  // folder1.add(params, 'y', -500, 500);

  // // Add Buttons
  // gui.add({ Randomize: randomizeParams }, "Randomize").name("Randomize");



}

let flower_center_x;


/* - - Draw - - */
function draw() {
 
  // load bg gradient
  gradientFilter();


// Set the blend mode.
  blendMode(SOFT_LIGHT);
  // Display  paper texture
 // image(paperTexture, 0, 0);

// Use the default blend mode.
//  blendMode(BLEND);


  fill(params.fill);
  stroke(params.stroke);
  strokeWeight(params.strokeWeight);

  let flower_center_x = windowWidth/2+params.x;


  
  let flower_center_y = windowHeight/2+params.y;


  //position ellipse center of window instead of top left of window
  ellipse(flower_center_x, flower_center_y, params.width, params.height);
  ellipse(flower_center_x+params.leaf_distance, flower_center_y, params.width, params.height);
  ellipse(flower_center_x-params.leaf_distance, flower_center_y, params.width, params.height);
  ellipse(flower_center_x, flower_center_y-params.leaf_distance, params.width, params.height);
  //flower_center_x +=200;
  ellipse(flower_center_x, flower_center_y+params.leaf_distance, params.width, params.height);


  //loop
  for (let y = 0; y < 10; y++){

    flower_center_x += 50;
    ellipse(flower_center_x, flower_center_y, params.width, params.height);

  }

}

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

  //Draws a linear gradient on the screen using a for loop and lerpColor
function gradientFilter() {
  let bgStartColor = color(210, 90, 15);
  let bgEndColor = color(270, 40, 22);

  for (let y = 0; y < height; y += 1) {
    let amt = map(y, 0, height, 0, 1);
    let gradColor = lerpColor(bgStartColor, bgEndColor, amt);
    stroke(gradColor);
    line(0, y, width, y);
  }
}