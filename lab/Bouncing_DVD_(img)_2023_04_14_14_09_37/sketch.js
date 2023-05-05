let s = 100; //size of dvd
let x = s/2;
let y = s/2;
let vx = 3.5;
let vy = 1.5;

let dvd;

function preload() {
  dvd = loadImage('img/DVD_logo.svg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  imageMode(CENTER);
  dvd.resize(s,0.6*s);
  image(dvd, x, y);
  
//   ellipseMode(CORNER);
//   ellipse(x,y,d);
  
  x = x + vx;
  y = y + vy;

console.log(dvd.width/dvd.height);
  
  if (x + dvd.width/2 >= windowWidth || x - dvd.width/2 <= 0){
    vx = -vx;
  }
  
  if (y + dvd.height/2 >= windowWidth || y - dvd.height/2 <= 0){
    vy = -vy;
  }
}