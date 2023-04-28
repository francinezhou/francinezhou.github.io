let jsonData;
let polygons = [];

function preload() {
  const url = "https://data.cityofnewyork.us/resource/y5rm-wagw.json";
  jsonData = loadJSON(url);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Extract coordinates of first polygon from JSON data
  const polygonCoords = jsonData[0].polygon.coordinates[0];
  
  // Convert coordinates to pixels
  const pixelCoords = polygonCoords.map(coord => {
    const x = map(coord[0], -74.00398, -74.00342, 0, width);
    const y = map(coord[1], 40.67293, 40.67321, 0, height);
    return [x, y];
  });
  
  // Add polygon to list of polygons
  polygons.push(pixelCoords);
  
  // Draw polygon
  beginShape();
  pixelCoords.forEach(coord => vertex(coord[0], coord[1]));
  endShape(CLOSE);
  
  // Display name of pool
  textSize(16);
  textAlign(LEFT, BOTTOM);
  text(jsonData[0].name, 0, height);
}
