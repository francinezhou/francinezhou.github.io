
//Colors
const linerPalette = [
  "hsl(20, 40%, 50%)", // fruity
  "hsl(350, 30%, 55%)", // floral
  "hsl(100, 30%, 40%)", // tea
  "hsl(60, 30%, 40%)", // herb
  "hsl(20, 25%, 40%)", //wood
  "hsl(10, 70%, 40%)", // spiced
  "hsl(210, 15%, 50%)"  //savoury
];

const palette = [
  "hsl(55, 100%, 60%)",  // Sourness
  "hsl(340, 80%, 60%)",  // Sweetness
  "hsl(30, 100%, 30%)",  // Bitterness
  "hsl(10, 100%, 50%)",  // Spicyness
  "hsl(195, 100%, 35%)", // Saltiness
];
const parentContainer = document.getElementById('parent-container');

const sheetID = "1xw9LbJNTwGl7zYzxNBh6XXO8HXbsuWXI9pHuOUDqxr8";
const tabName = 'cocktails';
const opensheet_uri = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

// const canvasWidth = 600;
// const canvasHeight = 600;


function createCanvasObject(p, w, h, pD, cssID) {
  return {
    loaded: false,
    width: w,
    height: h,
    pD: pD,
    css: cssID,
    prop() { return this.height / this.width },
    isLandscape() { return window.innerHeight <= window.innerWidth * this.prop() },
    resize() {
      const el = document.getElementById(this.css);
      if (!el) return;
      if (this.isLandscape()) {
        el.style.height = "100%";
        el.style.removeProperty('width');
      } else {
        el.style.removeProperty('height');
        el.style.width = "100%";
      }
    },
    createCanvas() {
      this.main = p.createCanvas(this.width, this.height, p.WEBGL);
      p.pixelDensity(this.pD);
      this.main.id(this.css);
      this.resize();
      
    }
  };
}


function windowResized() {
  C.resize();
}

 // Define brushes globally 
 brush.add("liner", {
  type: "custom", 
  weight: 5, 
  vibration: 0.5, 
  definition: 1, 
  quality: 40,
  opacity: 100, 
  spacing: 0.5, 
  blend: true,
  pressure: { 
      type: "standard", 
      curve: [0.2, 0.25], 
      min_max: [0.8, 2] },
  tip: (_m) => { _m.rotate(30); _m.rect(-1.5, -1.5, 3, 3); },
  rotate: "none"
});

// brush.add("watercolor", {
//   type: "custom", 
//   weight: 30, 
//   vibration: 2, 
//   definition: 0.5, 
//   quality: 8,
//   opacity: 23, 
//   spacing: 0.6, 
//   blend: true,
//   pressure: { 
//       type: "standard", 
//       curve: [0.15, 0.25], 
//       min_max: [0.5, 2] },
//   tip: (_m) => { _m.rotate(45); _m.rect(-1.5, -1.5, 3, 3); },
//   rotate: "natural"
// });


  fetch(opensheet_uri)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.forEach((cocktail, index) => {
        const container = document.createElement('div');
        container.classList.add('cocktail');
        container.id = `cocktail-${index}`;
        parentContainer.appendChild(container);

        new p5((p) => {

          p.setup = () => {
            
            
            //order matters! first canvas then load brush
            //otherwise scaling weird
            C = createCanvasObject(p, 700, 700, 1, `canvas-${index}`);
            C.createCanvas();
            C.main.parent(container);
            
            // p5.brush internally binds to: p.drawingContext & p.canvas & uses createGraphics() under the hood
            brush.instance(p);
            brush.load();
            
            p.angleMode(p.DEGREES);
            p.translate(-p.width / 2, -p.height / 2);

            p.background(240);
            console.log("p.width:", p.width, "p.height:", p.height);
            console.log("line from (0,0) to (600,600)");
           
           

            // Draw feather spine
            brush.pick("liner");
            
            brush.stroke(p.random(linerPalette));
            brush.strokeWeight(1);
            const spinePoints = [[50, 550], [200, 500], [350, 400], [500, 200]];
            brush.spline(spinePoints, 1);

           

            const abv = parseFloat(cocktail.abv);

            // Dynamically map ABV to pressure range
            const minVal = p.map(abv, 0, 40, 0, 3.5);
            const maxVal = p.map(abv, 0, 40, 1, 5);
            
            // Create a custom watercolor brush definition for this instance
            brush.add(`watercolor-${index}`, {
              type: "custom",
              weight: 30,
              vibration: 2,
              definition: 0.5,
              quality: 8,
              opacity: 23,
              spacing: 0.6,
              blend: true,
              pressure: {
                type: "standard",
                curve: [0.15, 0.25],// Values for the bell curve
                min_max: [minVal, maxVal]
              },
              tip: (_m) => { 
                // in this example, the tip is composed of two squares, rotated 45 degrees
                // Always execute drawing functions within the _m buffer!
                _m.rotate(45); _m.rect(-1.5, -1.5, 3, 3); },
              rotate: "natural",
            });
            
            // Pick the custom brush and draw
            brush.pick(`watercolor-${index}`);
            
            const numFeatherLines = 24;
for (let i = 0; i < numFeatherLines; i++) {
  drawFeatherLine(p, i, numFeatherLines, spinePoints, false);
  drawFeatherLine(p, i, numFeatherLines, spinePoints, true);
}

           
            // // ABV controls brush pressure
            // brush.pick("watercolor");
           
            // const numLines = Math.floor(p.map(abv, 0, 40, 0, 24));

            // for (let i = 0; i < numLines; i++) {
            //   drawFeatherLine(p, i, numLines, spinePoints, false);
            // }

            // for (let i = 0; i < numLines; i++) {
            //   drawFeatherLine(p, i, numLines, spinePoints, true);
            // }

           

            // // Draw feather lines
            // brush.pick("watercolor");
            // const numFeatherLines = 24;

            // // Right side lines
            // for (let i = 0; i < numFeatherLines; i++) {
            //   drawFeatherLine(p, i, numFeatherLines, spinePoints, false);
            // }
            // // Left side lines (mirrored)
            // for (let i = 0; i < numFeatherLines; i++) {
            //   drawFeatherLine(p, i, numFeatherLines, spinePoints, true);
            // }

           
          
            
            //border
            p.push();
            p.stroke(255, 0, 0);
            p.noFill();
            p.rect(0, 0, p.width, p.height);
            p.pop();
           
            // brush.pick("marker");
            // Set the brush color and draw a line
            //brush.line(x1, y1, x2, y2)
           
            
            
            // // Label
            // p.push();
            // p.fill(0);
            // p.noStroke();
            // p.textSize(14);
            // p.textAlign(p.LEFT, p.TOP);
            // p.text(`${cocktail.nameEN}`, 10, 10);
            // p.text(`${cocktail.abv}% ABV`, 10, 30);
            // p.pop();
          };
          p.draw = () => {};
        });
      });
    });

  function drawFeatherLine(p, i, num, points, mirror = false) {
    brush.stroke(p.random(palette));
    brush.strokeWeight(3);

    let baseProgress = 0.4 + (i / num) * 0.6;
    let spineSegment = baseProgress * (points.length - 1);
    let segmentIndex = Math.floor(spineSegment);
    let segmentProgress = spineSegment - segmentIndex;

    if (segmentIndex >= points.length - 1) {
      segmentIndex = points.length - 2;
      segmentProgress = 1;
    }

    let startX = p.lerp(points[segmentIndex][0], points[segmentIndex + 1][0], segmentProgress);
    let startY = p.lerp(points[segmentIndex][1], points[segmentIndex + 1][1], segmentProgress);

    let dx = points[segmentIndex + 1][0] - points[segmentIndex][0];
    let dy = points[segmentIndex + 1][1] - points[segmentIndex][1];
    let len = Math.sqrt(dx * dx + dy * dy);
    let perpX = -dy / len;
    let perpY = dx / len;

    let offset = 15;
    if (mirror) {
      startX -= perpX * offset;
      startY -= perpY * offset;
    } else {
      startX += perpX * offset;
      startY += perpY * offset;
    }

    let featherLen = (i * -2 + 150) * (1 + i / 36);
    let bell = Math.sin(i / num * Math.PI);
    featherLen *= 0.4 + bell * 0.6;
    let angle = (i + 45) * 2;

    let endX = mirror ? startX - featherLen : startX + featherLen;
    let endY = mirror
      ? startY - featherLen * p.tan(angle * p.PI / 180)
      : startY + featherLen * p.tan(angle * p.PI / 180);

    const feather = mirror
      ? [[startX, startY], [startX - featherLen / 3, startY + angle / 6],
         [startX - featherLen * 2 / 3, startY + angle / 8], [endX, endY]]
      : [[startX, startY], [startX + featherLen / 3, startY - angle / 6],
         [startX + featherLen * 2 / 3, startY - angle / 8], [endX, endY]];

    brush.spline(feather, 1);
  }

