let jsonData;
let jsonDataLength;
let poolTypes = ["Wading", "Mini", "Intermediate", "Intermediate & Diving", "Large", "Diving", "Olympic", "Olympic & Diving"];
const boroughs = {
  M: 'Manhattan',
  Q: 'Queens',
  X: 'Bronx',
  B: 'Brooklyn',
  R: 'Staten Island'
};
let poolInfoDivs = []; // an array to hold the pool info divs

function preload() {
  const url = "https://data.cityofnewyork.us/resource/y5rm-wagw.json";
  loadJSON(url, dataLoaded);
}

function dataLoaded(data) {
  jsonData = Object.values(data);
  jsonDataLength = jsonData.length;
  jsonData = jsonData.filter(pool => pool.location === "Indoor");
  let numPools = jsonData.length;
  let numFloats = numPools;
  jsonData.sort((a, b) => poolTypes.indexOf(a.pooltype) - poolTypes.indexOf(b.pooltype));

  // create the pool info divs and add them to the poolInfoDivs array
  for (let i = 0; i < jsonData.length; i++) {
    let div = createDiv("");
    div.class("poolInfo");
    poolInfoDivs.push(div);

    let poolNameDiv = createElement('h3', jsonData[i].name);
    poolNameDiv.parent(div);

    let poolLocationDiv = createElement('p', `${boroughs[jsonData[i].borough]} /  ${jsonData[i].pooltype}`);
    poolLocationDiv.parent(div);
  }
}

function setup() {
  createCanvas(windowWidth, 5200);
}

function draw() {
  let numPools = jsonData.length;
  let floatSpacing = 420;
  let floatWidth = 13;
  let floatHeight = 195;
  let cornerRadius = 4;

  let rectWidth = 11;
  let rectHeight = 8;
  let cornerRadiusSmall = 3;

  let lineHeight = numPools * floatSpacing; // multiply by 2 to double the length of the line
  let lineX = width / 4;
  stroke(0);
  strokeWeight(2);
  line(lineX, 0, lineX, lineHeight+floatHeight);

  for (let i = 0; i < numPools; i++) {
    let x = width / 4;
    let y = i * floatSpacing + floatSpacing / 2;

    
   //Blue float line
    fill(0, 0, 255);
    strokeWeight(0);
    rectMode(CENTER);
    rect(x, y - rectHeight / 2, floatWidth, floatHeight - rectHeight, cornerRadius);
    
    // Draw small white round rectangles TOP
    fill(255);
    strokeWeight(0);
    rect(x, y - floatHeight / 2 - rectHeight / 3, rectWidth, rectHeight, cornerRadiusSmall);

    // Draw small white round rectangles BOTTOM
    fill(255);
    strokeWeight(0);
    rect(x, y + floatHeight / 2 - rectHeight / 1.5, rectWidth, rectHeight, cornerRadiusSmall);
    
    //White float line
    fill(255, 255, 255);
    strokeWeight(0);
    rectMode(CENTER);
    rect(x, (y - rectHeight / 2) + (floatSpacing - floatHeight)/2 + floatHeight/2, floatWidth, floatHeight - rectHeight, cornerRadius);
    
    // Draw small white round rectangles TOP
    fill(255);
    strokeWeight(0);
    rect(x, y - floatHeight / 2 - rectHeight / 3 + (floatSpacing - floatHeight)/2 + floatHeight/2, rectWidth, rectHeight, cornerRadiusSmall);

    // Draw small white round rectangles BOTTOM
    fill(255);
    strokeWeight(0);
    rect(x, y + floatHeight / 2 - rectHeight / 1.5 + (floatSpacing - floatHeight)/2 + floatHeight/2, rectWidth, rectHeight, cornerRadiusSmall);
    
    

    // position the pool info divs based on the floats
    poolInfoDivs[i].position(x + floatWidth / 2 + 10, y - floatHeight / 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
