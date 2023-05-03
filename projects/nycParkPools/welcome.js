let jsonData;
let polygons = [];

const boroughs = {
  M: 'Manhattan',
  Q: 'Queens',
  X: 'Bronx',
  B: 'Brooklyn',
  R: 'Staten Island'
};

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

    // textSize(20);
    // textStyle(BOLD);
    // textAlign(CENTER, CENTER);
    const name = jsonData[0].name;
    // text(name, width/2, height/2);

    const borough = boroughs[jsonData[0].borough];
    const location = jsonData[0].location;
    const pooltype = jsonData[0].pooltype;
    // textSize(14);
    // textStyle(NORMAL);
    // textAlign(CENTER);
    // const description = `${borough} / ${location} / ${pooltype}`;
    // text(description, width/2, height/2 + 25);

    document.querySelector('.randomizerResult h2').textContent = name;
    document.querySelector('.randomizerResult p').textContent = `${borough} / ${location} / ${pooltype}`;

}
