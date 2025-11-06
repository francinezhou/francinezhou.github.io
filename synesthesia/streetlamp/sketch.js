/* - - Streetlamp - - */

let params = {
  pole_x: 100,
  pole_y_offset: 0,
  pole_height: 450,
  lantern_opacity: 120, // Opacity for lantern glass (0-255)
  polar_rotation: 0, // Rotation angle for polar pattern (0-360 degrees)
  polar_opacity: 120, // Opacity for polar shapes (0-255)
  polar_num_shapes: 6, // Number of shapes in polar pattern
  polar_sway: 0 // Extent of swaying motion (0-30 degrees)
};

let gui;
let paperTexture;
let bgStartColor, bgEndColor;

let pole_base_width = 30;
let pole_base_height = 150;
let pole_base_center_x;
let pole_base_bottom_y;

let pole_body_width = pole_base_width / 3;
let pole_body_height;
let pole_body_center_x;
let pole_body_bottom_y;

// Add parameters for bar and lantern
let bar_start_x;
let bar_start_y;
let bar_end_x;
let bar_end_y;
let bar_thickness = 3;
let lantern_size = 50;
let lantern_height = 60;
let lantern_bottom_scale = 0.7; // Scale factor for bottom width (0.7 = 70% of top width)
let lantern_center_x; // Store lantern center X to link with polar
let lantern_bottom_y; // Store lantern bottom Y to link with polar (for ground projection)


function preload() {
 // paperTexture = loadImage('/assets/Paper-Texture-5.jpg');

}


/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);

  colorMode(HSB);


  // Create GUI
  gui = new dat.GUI();
  gui.add(params, 'pole_x', 100, 1200);
  gui.add(params, 'pole_y_offset', 0, 200);
  gui.add(params, 'pole_height', 200, 500);
  gui.add(params, 'lantern_opacity', 0, 255).name('Lantern Opacity');
  gui.add(params, 'polar_rotation', 0, 360).name('Polar Rotation');
  gui.add(params, 'polar_opacity', 0, 255).name('Polar Opacity');
  gui.add(params, 'polar_num_shapes', 0, 18).step(1).name('Polar Num Shapes');
  gui.add(params, 'polar_sway', 0, 30).name('Sway');

  

  // // Add Folders
  // var folder1 = gui.addFolder('FolderNameA');
  // folder1.add(params, 'x', -500, 500);
  // folder1.add(params, 'y', -500, 500);

  // // Add Buttons
  // gui.add({ Randomize: randomizeParams }, "Randomize").name("Randomize");



}




/* - - Draw - - */
function draw() {
 
  // load bg gradient
  gradientFilter();


// Set the blend mode.
  //blendMode(SOFT_LIGHT);
  // Display  paper texture
 // image(paperTexture, 0, 0);

// Use the default blend mode.
//  blendMode(BLEND);
drawPolar();

 pole_body_height = params.pole_height;
 
//calculate poleBase, poleBody positioning
  let pole_base_center_x = params.pole_x - pole_base_width / 2;
  let pole_body_center_x = params.pole_x - pole_body_width / 2;
  
  let pole_base_bottom_y =  windowHeight - params.pole_y_offset - pole_base_height;
  let pole_body_bottom_y = pole_base_bottom_y - pole_body_height; 

  // Calculate bar start position (top of pole body)
  bar_start_x = params.pole_x;
  bar_start_y = pole_body_bottom_y;
  
  // Calculate lantern position first (where we want it to hang)
  // This will be the bottom/lowest point of the spiral
  let lantern_extension_x = 100; // horizontal distance from pole
  let lantern_extension_y = 80; // vertical distance downward from pole top
  let lantern_top_y = bar_start_y + lantern_extension_y;
  lantern_center_x = bar_start_x + lantern_extension_x;
  lantern_bottom_y = lantern_top_y + lantern_height; // Bottom of the lantern
  
  // The bar end is at the lantern top (bottom of spiral curve)
  bar_end_x = lantern_center_x;
  bar_end_y = lantern_top_y;

  fill(255, 0, 0, 128);
  noStroke();
  
  // draw pole base
  rect(pole_base_center_x, pole_base_bottom_y, pole_base_width, pole_base_height);
  
  // draw pole body
  rect(pole_body_center_x, pole_body_bottom_y, pole_body_width, pole_body_height);

  // Draw spiral bar
  drawSpiralBar();

  // Draw lantern
  drawLantern(lantern_center_x, lantern_top_y);


}

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

  //Draws a linear gradient on the screen using a for loop and lerpColor
function gradientFilter() {
   let bgStartColor = color(210, 30, 95);
  //let bgStartColor = color(210, 90, 15);
  let bgEndColor = color(270, 40, 22);

  for (let y = 0; y < height; y += 1) {
    let amt = map(y, 0, height, 0, 1);
    let gradColor = lerpColor(bgStartColor, bgEndColor, amt);
    stroke(gradColor);
    line(0, y, width, y);
  }
}

// Function to draw the spiral bar
function drawSpiralBar() {
  push();
  
  // Set bar properties
  stroke(0); // Black
  strokeWeight(bar_thickness);
  noFill();
  
  // Calculate the center and radius of the semicircle
  // The semicircle goes from pole top to lantern
  let start_x = bar_start_x;
  let start_y = bar_start_y;
  let end_x = bar_end_x;
  let end_y = bar_end_y;
  
  // Calculate the midpoint and the chord length
  let mid_x = (start_x + end_x) / 2;
  let mid_y = (start_y + end_y) / 2;
  let chord_length = dist(start_x, start_y, end_x, end_y);
  
  // Calculate the center of the circle (perpendicular to chord, at desired height)
  // The peak should be above the midpoint
  let peak_height = chord_length * 0.6; // Height of the arc above the chord
  let chord_angle = atan2(end_y - start_y, end_x - start_x);
  let perpendicular_angle = chord_angle + PI / 2;
  
  // Center of the circle
  let center_x = mid_x + cos(perpendicular_angle) * peak_height;
  let center_y = mid_y + sin(perpendicular_angle) * peak_height;
  
  // Radius of the circle
  let radius = dist(center_x, center_y, start_x, start_y);
  
  // Calculate angles from center to start and end points
  let start_angle = atan2(start_y - center_y, start_x - center_x);
  let end_angle = atan2(end_y - center_y, end_x - center_x);
  
  // For a smooth semicircle, use bezier curves with control points
  // Control point distance for circular arc approximation: ~0.552 * radius
  let cp_distance = radius * 0.552;
  
  // Calculate control points for the first half of the arc
  let mid_angle = (start_angle + end_angle) / 2;
  
  // Control points positioned to create a smooth circular arc
  let cp1_x = start_x + cos(start_angle + PI/2) * cp_distance;
  let cp1_y = start_y + sin(start_angle + PI/2) * cp_distance;
  
  let cp2_x = center_x + cos(mid_angle) * radius * 0.85;
  let cp2_y = center_y + sin(mid_angle) * radius * 0.85;
  
  let cp3_x = center_x + cos(end_angle - PI/2) * radius;
  let cp3_y = center_y + sin(end_angle - PI/2) * radius;
  
  // Draw the semicircular bar using bezierVertex
  beginShape();
  vertex(start_x, start_y); // Start at pole top
  
  // Create smooth semicircular arc
  bezierVertex(
    cp1_x, cp1_y,      // control point 1
    cp2_x, cp2_y,      // control point 2
    mid_x + cos(perpendicular_angle) * radius, mid_y + sin(perpendicular_angle) * radius  // midpoint of arc (peak)
  );
  
  bezierVertex(
    cp3_x, cp3_y,      // control point 3
    end_x + cos(end_angle + PI/2) * cp_distance, end_y + sin(end_angle + PI/2) * cp_distance,  // control point 4
    end_x, end_y       // end at lantern
  );
  
  endShape();
  
  pop();
}

// Function to draw the lantern
function drawLantern(centerX, topY) {
  push();
  
  // Temporarily switch to RGB mode for proper alpha channel
  colorMode(RGB, 255);
  
  // Calculate bottom width (narrower than top)
  let bottom_width = lantern_size * lantern_bottom_scale;
  
  // Draw lantern frame (black outline)
  stroke(0);
  strokeWeight(2);
  noFill();
  
  // Draw the 2 visible sides of the lantern
  // Side 1 (left side, visible from this angle)
  let side1_left_top = centerX - lantern_size / 2;
  let side1_right_top = centerX;
  let side1_left_bottom = centerX - bottom_width / 2;
  let side1_right_bottom = centerX;
  let side1_top = topY;
  let side1_bottom = topY + lantern_height;
  
  // Draw side 1 with translucent glass effect (trapezoid shape)
  fill(255, 200, 100, params.lantern_opacity); // Warm yellow with controllable transparency
  stroke(50);
  strokeWeight(1);
  quad(
    side1_left_top, side1_top,
    side1_right_top, side1_top,
    side1_right_bottom, side1_bottom,
    side1_left_bottom, side1_bottom
  );
  
  // Draw side 2 (right side, visible from this angle)
  let side2_left_top = centerX;
  let side2_right_top = centerX + lantern_size / 2;
  let side2_left_bottom = centerX;
  let side2_right_bottom = centerX + bottom_width / 2;
  let side2_top = topY;
  let side2_bottom = topY + lantern_height;
  
  // Draw side 2 with translucent glass effect (trapezoid shape)
  fill(255, 180, 80, params.lantern_opacity * 0.83); // Slightly different shade for depth, maintains relative opacity
  quad(
    side2_left_top, side2_top,
    side2_right_top, side2_top,
    side2_right_bottom, side2_bottom,
    side2_left_bottom, side2_bottom
  );
  
  // Draw frame lines to separate the sides
  stroke(0);
  strokeWeight(2);
  noFill();
  line(side1_left_top, side1_top, side1_left_bottom, side1_bottom);
  line(side1_right_top, side1_top, side1_right_bottom, side1_bottom);
  line(side2_left_top, side2_top, side2_left_bottom, side2_bottom);
  line(side2_right_top, side2_top, side2_right_bottom, side2_bottom);
  line(side2_left_top, side2_top, side2_right_top, side2_top);
  line(side1_left_bottom, side1_bottom, side2_right_bottom, side2_bottom);
  
  // Draw top cap
  fill(0);
  noStroke();
  triangle(
    centerX - lantern_size / 2 - 5, topY,
    centerX + lantern_size / 2 + 5, topY,
    centerX, topY - 10
  );
  
  // Draw bottom finial
  fill(0);
  ellipse(centerX, side1_bottom, 8, 8);
  
  pop(); // This restores the previous colorMode (HSB)
}

function drawPolar() { 
  push();
  
  // Temporarily switch to RGB mode for proper alpha channel (like lantern)
  colorMode(RGB, 255);
  
  // Move to position - X linked to lantern center X, Y linked to lantern bottom Y (ground projection)
  // Position the pattern below the lantern as if projected on the ground
  let projection_offset_y = 150; // Distance below lantern bottom for ground projection
  translate(lantern_center_x, lantern_bottom_y + projection_offset_y);
  
  // Apply base rotation
  rotate(radians(params.polar_rotation));
  
  // Apply wiggling motion (oscillating translation)
  let wiggleX = sin(frameCount * 0.03) * params.polar_sway;
  let wiggleY = cos(frameCount * 0.03) * params.polar_sway;
  translate(wiggleX, wiggleY);
  
  // Set center for polar coordinates (relative to translated origin)
  setCenter(0, 0);
  
  //polarPentagons(7, 50, 100);
  
  //stroke('#000');
  noStroke();

  
  // Warm colors in RGB with adjustable opacity
  // Warm orange-red (using more shapes for outer ring)
  fill(255, 140, 80, params.polar_opacity);
  polarPolygons(params.polar_num_shapes * 2.5, 4, 40, 180);
  
  // Warm orange
  fill(255, 165, 40, params.polar_opacity);
  polarPolygons(params.polar_num_shapes, 4, 40, 150);
  
  // Warm yellow-orange
  fill(255, 200, 100, params.polar_opacity);
  polarPolygons(params.polar_num_shapes, 4, 80, 100);
  
  // Warm yellow
  fill(255, 220, 130, params.polar_opacity);
  polarPolygons(params.polar_num_shapes, 4, 40, 100);
  
  pop(); // This restores the previous colorMode (HSB)
}