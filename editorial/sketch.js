let carLength = 450;
let carWidth = carLength / 2.5;
let wheelWidth = carLength / 6;
let wheelThick = 25;

// Axle properties
let axleThick = 10;

// Info dimensions
let InfoHeight = carLength * 0.4;
let InfoWidth = carWidth * 0.7;

let cars = []; // Array to store cars' properties

// Array of countries with their respective years
let countries = [
  { name: "United States of America", years: [1960, 1961, 1962, 1963, 1964, 1965] },
  { name: "England", years: [1960, 1961, 1962, 1963, 1964, 1965] },
  { name: "Japan", years: [1973, 1974, 1975, 1976] },
  { name: "Malaysia", years: [1976, 1977, 1978, 1979] },
  { name: "South Korea", years: [1983, 1984, 1985, 1986] },
  { name: "China", years: [1996, 1997, 1998, 1999, 2000] },
  { name: "Vietnam", years: [2000, 2001, 2002, 2003] }
];

let countryIndex = 0; // Index to track the current country

let angle = 0;
let cRadius = 20; // Increased radius for better visibility
let cylinders = []; // Array to store cylinders' properties

let lastCarTime = 0; // Time when the last car was generated
let carSpeed = 3; // Speed at which cars move upward

// Rectangle properties
let rectangleHeight = 50; // Height of the yellow rectangle
let rectangleWidth = 2 * cRadius + 20; // Width of the yellow rectangle, slightly larger than the cylinder diameter

// Lane properties
let leftLaneX, rightLaneX; // Will be initialized in setup()
let nextLane = "left"; // Track the next lane for car generation
let carGap = carLength * 1.5; // Fixed gap between cars (1.5 times the car length)

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Define lane positions after width is defined
  leftLaneX = -width / 4; // X position of the left lane
  rightLaneX = width / 4; // X position of the right lane

  // Define colors
  carColor = color(150);
  axleColor = color(100);
  wheelColor = color(0);

  // Create multiple cylinders aligned vertically
  let numCylinders = 15; // Number of cylinders
  let spacing = height / numCylinders; // Vertical spacing between cylinders

  for (let i = 0; i < numCylinders; i++) {
    cylinders.push({
      x: 0, // Align cylinders vertically (same x position)
      y: -height / 2 + i * spacing, // Distribute cylinders vertically
      angle: random(TWO_PI), // Random initial rotation angle
      rotationSpeed: random(0.01, 0.05) // Random rotation speed
    });
  }

  // Generate the first car immediately
  generateCar();
  lastCarTime = millis(); // Set the last car time to now
}

function draw() {
  background(220);

  // Draw cars first (background)
  for (let i = cars.length - 1; i >= 0; i--) {
    let car = cars[i];
    car.y -= carSpeed; // Move the car upward

    // Remove the car if it goes off the screen
    if (car.y + carLength < -height / 2) {
      car.InfoDiv.remove(); // Remove the associated div
      cars.splice(i, 1); // Remove the car from the array
    } else {
      push();
      translate(car.x + carWidth / 2, car.y + carLength / 2); // Move origin to car center
      drawCar(-carWidth / 2, -carLength / 2, car); // Draw at adjusted position
      pop();
    }
  }

  // Draw cylinders (foreground)
  ambientLight(200);

  // Style the cylinders.
  noStroke();
  fill(100, 100, 100, 60);
  specularMaterial(155);
  shininess(10);

  // Draw each cylinder with its own rotation
  for (let i = 0; i < cylinders.length; i++) {
    let cyl = cylinders[i];

    push(); // Save the current transformation matrix
    translate(cyl.x, cyl.y); // Move to the cylinder's position
    rotateX(angle); // Apply the global rotation
    rotateZ(HALF_PI); // Rotate the cylinder to stand upright

    // Draw the cylinder
    cylinder(cRadius, windowWidth);

    // Draw the curved yellow rectangle around the cylinder
    push();
    fill(255, 208, 79); // Yellow color
    noStroke();
    rotateY(HALF_PI); // Rotate to align with the cylinder's curvature
    translate(0, 0, cRadius); // Move to the surface of the cylinder
    plane(rectangleWidth, rectangleHeight); // Draw a curved plane
    pop();

    pop(); // Restore the original transformation matrix

    // Update the cylinder's rotation angle
    cyl.angle += cyl.rotationSpeed;
  }

  // Update the global rotation angle
  angle += 0.02;

  // Generate a new car at fixed intervals
  if (millis() - lastCarTime > carGap / carSpeed * 20) {
    generateCar();
    lastCarTime = millis();
  }
}

// Function to generate formatted text dynamically
function generateInfoText() {
  // Get the current country
  let country = countries[countryIndex];
  let year = random(country.years); // Random year from the country's years

  // Move to the next country for the next car
  countryIndex = (countryIndex + 1) % countries.length;

  return `Made in ${country.name} <br> © ${year}`;
}

// Function to create a new car at the bottom of the screen
function generateCar() {
  let laneX;
  if (nextLane === "left") {
    laneX = leftLaneX; // Use the left lane
    nextLane = "right"; // Switch to the right lane for the next car
  } else {
    laneX = rightLaneX; // Use the right lane
    nextLane = "left"; // Switch to the left lane for the next car
  }

  let carX = laneX; // Set the car's x position to the chosen lane
  let carY = height / 2; // Start at the bottom of the screen (WebGL coordinates)

  // Generate formatted text dynamically
  let randomText = generateInfoText();

  // Create a div for the text
  let newInfoDiv = createDiv(randomText);
  newInfoDiv.class("info");
  newInfoDiv.style("width", InfoWidth + "px");
  newInfoDiv.style("height", InfoHeight + "px");

  // Assign a random color to the car
  let carRandomColor = color(random(0, 255), random(50, 180), random(60, 180));

  cars.push({
    x: carX,
    y: carY,
    InfoDiv: newInfoDiv,
    color: carRandomColor // Store the random color for the car
  });

  console.log("New car created in lane:", nextLane === "left" ? "right" : "left");
}

// Function to draw a car at the given position (rotated 90 degrees)
function drawCar(carX, carY, car) {
  // Determine which view to display based on mouse position
  if (mouseX < width / 2 && car.x === leftLaneX) {
    drawBackView(carX, carY); // Draw back view if mouse is on the left half and car is in the left lane
  } else if (mouseX > width / 2 && car.x === rightLaneX) {
    drawBottomView(carX, carY, car); // Draw bottom view if mouse is on the right half and car is in the right lane
  } else {
    drawTopView(carX, carY, car); // Draw top view if no mouse is hovered or car is in the wrong lane
  }

  // Update the position of the text div
  let screenX = car.x + carWidth / 2 - InfoWidth / 2;
  let screenY = car.y + carLength / 2 - InfoHeight / 2;

  // Convert WebGL coordinates to screen coordinates
  let screenPos = webglToScreen(screenX, -screenY);
  car.InfoDiv.position(screenPos.x, screenPos.y);
}

// Function to draw the back view of the car
function drawBackView(carX, carY) {
  // Draw car body with rounded corners (swap width and height)
  fill(carColor);
  let cornerRadius = 20; // Radius for rounded corners
  rect(carX, carY, carWidth, carLength, cornerRadius);

  // Draw additional details for the back view (e.g., rear lights, etc.)
  // You can customize this part as needed
}

// Function to draw the bottom view of the car
function drawBottomView(carX, carY, car) {
  // Draw car body with rounded corners (swap width and height)
  fill(carColor);
  let cornerRadius = 20; // Radius for rounded corners
  rect(carX, carY, carWidth, carLength, cornerRadius);

  // Draw wheels and axles
  drawWheelsAndAxles(carX, carY);

  // Draw the text div (already handled in the main drawCar function)
}

// Function to draw the top view of the car
function drawTopView(carX, carY, car) {
  // Draw the outer shell of the car with the car's assigned random color
  fill(car.color);
  let cornerRadius = 20; // Radius for rounded corners
  rect(carX, carY, carWidth, carLength, cornerRadius); // Draw the outer shell

  // Draw the trapezoid windows
  fill(0); // Black color for windows
  drawTrapezoidWindows(carX, carY);
}

// Function to draw wheels and axles
function drawWheelsAndAxles(carX, carY) {
  // Wheel positioning
  let wheelOffsetY = carLength / 6; // Vertical offset for wheels
  let leftX = carX + wheelThick / 2; // Left side of the car
  let rightX = carX + carWidth - wheelThick - wheelThick / 2; // Right side of the car

  // Wheels
  let wheelTopL = { x: leftX, y: carY + wheelOffsetY }; // Left-top wheel
  let wheelTopR = { x: rightX, y: carY + wheelOffsetY }; // Right-top wheel
  let wheelBottomL = { x: leftX, y: carY + carLength - wheelOffsetY }; // Left-bottom wheel
  let wheelBottomR = { x: rightX, y: carY + carLength - wheelOffsetY }; // Right-bottom wheel

  // Axles
  let axleTop = { x1: wheelTopL.x + wheelThick / 2, y1: wheelTopL.y, x2: wheelTopR.x + wheelThick / 2, y2: wheelTopR.y }; // Top axle
  let axleBottom = { x1: wheelBottomL.x + wheelThick / 2, y1: wheelBottomL.y, x2: wheelBottomR.x + wheelThick / 2, y2: wheelBottomR.y }; // Bottom axle

  // Draw axles
  stroke(axleColor);
  strokeWeight(axleThick);
  line(axleTop.x1, axleTop.y1, axleTop.x2, axleTop.y2); // Top axle
  line(axleBottom.x1, axleBottom.y1, axleBottom.x2, axleBottom.y2); // Bottom axle
  noStroke();

  // Draw wheels
  fill(wheelColor);
  drawWheel(wheelTopL.x, wheelTopL.y); // Left-top wheel
  drawWheel(wheelTopR.x, wheelTopR.y); // Right-top wheel
  drawWheel(wheelBottomL.x, wheelBottomL.y); // Left-bottom wheel
  drawWheel(wheelBottomR.x, wheelBottomR.y); // Right-bottom wheel
}

// Function to draw trapezoid windows
function drawTrapezoidWindows(carX, carY) {
  // Top trapezoid (largest)
  let topTrapezoidWidth = carWidth * 0.8; // Width of the top trapezoid
  let topTrapezoidHeight = carLength * 0.2; // Height of the top trapezoid
  quad(
    carX + (carWidth - topTrapezoidWidth) / 2, carY, // Top-left corner
    carX + (carWidth + topTrapezoidWidth) / 2, carY, // Top-right corner
    carX + (carWidth + topTrapezoidWidth * 0.8) / 2, carY + topTrapezoidHeight, // Bottom-right corner
    carX + (carWidth - topTrapezoidWidth * 0.8) / 2, carY + topTrapezoidHeight  // Bottom-left corner
  );

  // Left trapezoid (narrow)
  let leftTrapezoidWidth = carWidth * 0.3; // Width of the left trapezoid
  let leftTrapezoidHeight = carLength * 0.4; // Height of the left trapezoid
  quad(
    carX, carY + (carLength - leftTrapezoidHeight) / 2, // Top-left corner
    carX, carY + (carLength + leftTrapezoidHeight) / 2, // Bottom-left corner
    carX + leftTrapezoidWidth, carY + (carLength + leftTrapezoidHeight * 0.8) / 2, // Bottom-right corner
    carX + leftTrapezoidWidth, carY + (carLength - leftTrapezoidHeight * 0.8) / 2  // Top-right corner
  );

  // Right trapezoid (narrow)
  let rightTrapezoidWidth = carWidth * 0.3; // Width of the right trapezoid
  let rightTrapezoidHeight = carLength * 0.4; // Height of the right trapezoid
  quad(
    carX + carWidth, carY + (carLength - rightTrapezoidHeight) / 2, // Top-right corner
    carX + carWidth, carY + (carLength + rightTrapezoidHeight) / 2, // Bottom-right corner
    carX + carWidth - rightTrapezoidWidth, carY + (carLength + rightTrapezoidHeight * 0.8) / 2, // Bottom-left corner
    carX + carWidth - rightTrapezoidWidth, carY + (carLength - rightTrapezoidHeight * 0.8) / 2  // Top-left corner
  );

  // Bottom trapezoid (narrow)
  let bottomTrapezoidWidth = carWidth * 0.8; // Width of the bottom trapezoid
  let bottomTrapezoidHeight = carLength * 0.2; // Height of the bottom trapezoid
  quad(
    carX + (carWidth - bottomTrapezoidWidth) / 2, carY + carLength, // Bottom-left corner
    carX + (carWidth + bottomTrapezoidWidth) / 2, carY + carLength, // Bottom-right corner
    carX + (carWidth + bottomTrapezoidWidth * 0.8) / 2, carY + carLength - bottomTrapezoidHeight, // Top-right corner
    carX + (carWidth - bottomTrapezoidWidth * 0.8) / 2, carY + carLength - bottomTrapezoidHeight  // Top-left corner
  );
}

// Function to convert WebGL coordinates to screen coordinates
function webglToScreen(x, y) {
  // WebGL origin is at the center of the canvas, while screen origin is at the top-left
  let screenX = x + width / 2;
  let screenY = -y + height / 2; // Invert y-axis for screen coordinates
  return { x: screenX, y: screenY };
}

// Function to draw a wheel with rounded edges
function drawWheel(x, y) {
  let radius = wheelThick / 2;
  rect(x, y - wheelWidth / 2, wheelThick, wheelWidth, radius, radius); // Vertical wheels
}