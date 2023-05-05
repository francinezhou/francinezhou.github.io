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
}

function setup() {
  createCanvas(windowWidth/2, 3000);
}

function draw() {
  background(220);
  let numPools = jsonData.length;
  let floatSpacing = 230;
  let floatWidth = 13;
  let floatHeight = 190;
  let cornerRadius = 4;

  let rectWidth = 11;
  let rectHeight = 8;  
  let cornerRadiusSmall = 3;
  
  let lineHeight = numPools * floatSpacing;
  let lineX = width/4;
  stroke(0);
  strokeWeight(2);
  line(lineX, 0, lineX, lineHeight);
  
  for (let i = 0; i < numPools; i++) {
    
    let x = width/4;
    let y = i * floatSpacing + floatSpacing/2;
    
    // Draw small white round rectangles TOP
    fill(255);
    strokeWeight(0);
    rect(x, y - floatHeight / 2 - rectHeight / 3, rectWidth, rectHeight, cornerRadiusSmall);
    
    // Draw small white round rectangles BOTTOM
    fill(255);
    strokeWeight(0);
    rect(x, y + floatHeight / 2 - rectHeight / 1.5, rectWidth, rectHeight, cornerRadiusSmall);
    
    if (i % 2 == 0) {
      fill(0, 0, 255);
    } else {
      fill(255);
    }
    
    strokeWeight(0);
    rectMode(CENTER);
    rect(x, y - rectHeight / 2, floatWidth, floatHeight - rectHeight, cornerRadius);
    
    
   
    let div = createDiv("");
    div.class("poolInfo");
    div.position(x + floatWidth/2 + 10, y - floatHeight/2);

    let poolNameDiv = createElement('h3', jsonData[i].name);
poolNameDiv.parent(div);

let poolLocationDiv = createElement('p', `${boroughs[jsonData[i].borough]} / ${jsonData[i].location} / ${jsonData[i].pooltype}`);
poolLocationDiv.parent(div);


  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
