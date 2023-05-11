let jsonData;
let jsonDataLength;
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
  loadJSON(url, dataLoaded);
}
 
function dataLoaded(data) {
  jsonData = Object.values(data);
  jsonDataLength = jsonData.length;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  jsonDataLength = Object.keys(jsonData).length;
  // Find the min/max coordinates of all polygons in the data
  let minMaxCoords = jsonData.reduce((acc, pool) => {
    let coords = pool.polygon.coordinates[0]; // get the first set of coordinates in the polygon
    let longitudes = coords.map(coord => coord[0]); // extract all the longitudes
    let latitudes = coords.map(coord => coord[1]); // extract all the latitudes

    let minLongitude = Math.min(...longitudes);
    let maxLongitude = Math.max(...longitudes);
    let minLatitude = Math.min(...latitudes);
    let maxLatitude = Math.max(...latitudes);

    // update the accumulator with the new min/max values
    acc.minLongitude = Math.min(acc.minLongitude, minLongitude);
    acc.maxLongitude = Math.max(acc.maxLongitude, maxLongitude);
    acc.minLatitude = Math.min(acc.minLatitude, minLatitude);
    acc.maxLatitude = Math.max(acc.maxLatitude, maxLatitude);

    return acc;
  }, {
    // set initial values for the accumulator
    minLongitude: Infinity,
    maxLongitude: -Infinity,
    minLatitude: Infinity,
    maxLatitude: -Infinity
  });
}

let count = Math.floor(Math.random() * 91);
let isPlaying = 0;

function draw() {
    //console.log(count)
    let name = jsonData[count].name;
    let borough = boroughs[jsonData[count].borough];
    let location = jsonData[count].location;
    let pooltype = jsonData[count].pooltype;
  
    // Loop through each polygon in the data
  for (let i = 0; i < jsonDataLength; i++) {
    let coords = jsonData[i].polygon.coordinates[0]; // get the first set of coordinates in the polygon
    let longitudes = coords.map(coord => coord[0]); // extract all the longitudes
    let latitudes = coords.map(coord => coord[1]); // extract all the latitudes

    let minLongitude = min(longitudes);
    let maxLongitude = max(longitudes);
    let minLatitude = min(latitudes);
    let maxLatitude = max(latitudes);

    // Convert coordinates to pixels using the min/max values
    let pixelCoords = coords.map(coord => {
      let x = map(coord[0], minLongitude, maxLongitude, 0, width);
      let y = map(coord[1], minLatitude, maxLatitude, 0, height);
      return [x, y];
    });

    // Add polygon to list of polygons
    polygons.push(pixelCoords);
  }
    // Draw polygon
    background(255);
    fill(173, 216, 230); // light blue fill color
    beginShape();
    polygons[count].forEach(coord => vertex(coord[0], coord[1]));
    endShape(CLOSE);

    document.querySelector('.poolInfo h2').textContent = name;
    document.querySelector('.poolInfo h4').textContent = `${borough} / ${location} / ${pooltype}`;
  
   document.querySelector('.arrow').addEventListener('mousedown', () => {
  arrow.classList.add('yellow');
  if (isPlaying === 1) {
    isPlaying = 0;
    clearInterval(animate);
  } else {
    isPlaying = 1;
    animate = setInterval(playAnimation, 150);
    setTimeout(() => {
      clearInterval(animate);
      isPlaying = 0;
      arrow.classList.remove('yellow');
    }, 2200); // wait for 4 seconds and then stop the randomizer
  }
});

}

const arrow = document.querySelector('.arrow');
arrow.classList.add('blinker');

function playAnimation() {
  count = Math.floor(Math.random() * jsonDataLength);
  arrow.classList.remove('blinker');
  arrow.classList.add('yellow');
  setTimeout(() => {
    arrow.classList.remove('yellow');
    arrow.classList.add('blinker');
  }, 2200);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}