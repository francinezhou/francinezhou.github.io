
//Liner Colors in Hue/Saturation/Lightness

const flavorColorMap = {
  tea: "hsl(100, 30%, 40%)",
  herbaceous: "hsl(60, 30%, 40%)",
  fruity: "hsl(20, 40%, 50%)",
  floral: "hsl(350, 30%, 55%)",
  
  wood: "hsl(20, 25%, 40%)",
  spiced: "hsl(10, 70%, 40%)",
  savoury: "hsl(210, 15%, 50%)"
};

// let palette = [
//   "hsl(55, 100%, 60%)",  // Sourness
//   "hsl(340, 80%, 60%)",  // Sweetness
//   "hsl(30, 100%, 30%)",  // Bitterness
//   "hsl(10, 100%, 50%)",  // Spicyness
//   "hsl(195, 100%, 35%)", // Saltiness
// ];

const parentContainer = document.getElementById('parent-container');

const sheetID = "1xw9LbJNTwGl7zYzxNBh6XXO8HXbsuWXI9pHuOUDqxr8";
const tabName = 'cocktails';
const opensheet_uri = `https://opensheet.elk.sh/${sheetID}/${tabName}`;




// Object for creation and real-time resize of canvas
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

        //Text info div
        const info = document.createElement('div');
        info.classList.add('cocktail-info');
        
        // Name div
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('cocktail-name');
        nameDiv.textContent = `{${cocktail.nameEN.trim()}} ${cocktail.nameCN.trim()}`;

        // Ingredients div
        
        // Flavors div
        const flavorsDiv = document.createElement('div');
        flavorsDiv.classList.add('cocktail-flavors');
        if (cocktail.flavors?.trim()) {
          flavorsDiv.textContent = cocktail.flavors.trim();
        }
        
        // Palate div
        const palateDiv = document.createElement('div');
        palateDiv.classList.add('cocktail-palate');
        ["sourness", "sweetness", "bitterness", "spicyness", "saltiness"].forEach((key) => {
          const val = parseInt(cocktail[key]);
          const pSpan = document.createElement('span');
          pSpan.textContent = `${key}: ${val}`;
          pSpan.style.marginRight = '0.5em';
          palateDiv.appendChild(pSpan);
        });
        
        // ABV div
        const abvDiv = document.createElement('div');
        abvDiv.classList.add('cocktail-abv');
        abvDiv.textContent = `ABV ${cocktail.abv}%`;
        
        // Append all child divs to the info box
        info.appendChild(nameDiv);
        info.appendChild(flavorsDiv);
        info.appendChild(palateDiv);
        info.appendChild(abvDiv);
        
        container.appendChild(info);
        

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

           
           

            // Draw feather spine
            brush.pick("liner");


            //Spine stroke color defined by the order of the flavors string in JSON 
            // specifically, the first item in the comma-separated list.
            // Example: "flavors": "spiced, herbal" → "spiced" is used
            // If need to change spine color, reorder JSON flavor tag 
            const firstFlavor = cocktail.flavors?.split(",")[0]?.trim().toLowerCase();
            brush.stroke(flavorColorMap[firstFlavor] || "black"); // fallback to black if no match

            brush.strokeWeight(1);

            const x1 = 50;
            const y1 = 500;
            const spinePoints = [
              [x1, y1],
              [x1 + 150, y1 - 50],
              [x1 + 300, y1 - 180],
              [x1 + 400, y1 - 350]
            ];
            brush.spline(spinePoints, 1); //0-1

           

            const abv = parseFloat(cocktail.abv);

            // Dynamically map ABV to pressure range
            const minVal = p.map(abv, 0, 40, 0, 3.5);
            const maxVal = p.map(abv, 0, 40, 1, 3);
            
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
                // min_max: [minVal, maxVal]
                min_max: [0.5, 2]
              },
              tip: (_m) => { 
                // in this example, the tip is composed of two squares, rotated 45 degrees
                // Always execute drawing functions within the _m buffer!
                _m.rotate(45); _m.rect(-1.5, -1.5, 3, 3); },
              rotate: "natural",
            });
      
            
            // Dynamically generate feather palette based on cocktail's palate values
            const featherPalette = [];

            // Sourness → Yellow-green hue
            {
              const level = parseInt(cocktail.sourness);
              if (level > 0) {
                const hue = 55;
                const saturation = 100;
                const lightness = 90 - level * 15; // e.g., 75, 60, 45
                featherPalette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
              }
            }
            
            // Sweetness → Pink hue
            {
              const level = parseInt(cocktail.sweetness);
              if (level > 0) {
                const hue = 340;
                const saturation = 80;
                const lightness = 85 - level * 15; // 70, 55, 40
                featherPalette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
              }
            }
            
            // Bitterness → Dark orange
            {
              const level = parseInt(cocktail.bitterness);
              if (level > 0) {
                const hue = 30;
                const saturation = 70;
                const lightness = 90 - level * 20; // 65, 45, 25
                featherPalette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
              }
            }
            
            // Spicyness → Red hue
            {
              const level = parseInt(cocktail.spicyness);
              if (level > 0) {
                const hue = 10;
                const saturation = 100;
                const lightness = 80 - level * 15; // 65, 50, 35
                featherPalette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
              }
            }
            
            // Saltiness → Cyan hue
            {
              const level = parseInt(cocktail.saltiness);
              if (level > 0) {
                const hue = 195;
                const saturation = 90;
                const lightness = 85 - level * 15; // 70, 55, 40
                featherPalette.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
              }
            }
            


            // Draw feather lines
            // brush.pick(`marker`);
            brush.pick(`watercolor-${index}`);

            //brush.bleed(strength, direction)
            //Adjusts the bleed and texture levels for the fill operation, mimicking the behavior of watercolor paints. This function adds a natural and organic feel to digital artwork.

            // strength (Number): The intensity of the bleed effect, capped at 0.5.
            // direction (String): Optional. "out" or "in". Defines the direction of the bleed effect
            // _borderIntensity (Number): The intensity of the border watercolor effect, ranging from 0 to 1.
            brush.bleed(0.5, "out", 1); //0-0.5, in/out, 1

            const numFeatherLines = 24;
            // for (let i = 0; i < numFeatherLines; i++) {
            //   drawFeatherLine(p, i, numFeatherLines, spinePoints, false);
            //   drawFeatherLine(p, i, numFeatherLines, spinePoints, true);
            // }

           
            for (let i = 0; i < numFeatherLines; i++) {
              drawFeatherLine(p, i, numFeatherLines, spinePoints, false, featherPalette);
              drawFeatherLine(p, i, numFeatherLines, spinePoints, true, featherPalette);
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
           
            
     
          };
          p.draw = () => {};
        });
      });
    });

// Function to draw one feather line, mirrored if specified
// mirror false is right side, mirror true is left side
function drawFeatherLine(p, i, num, points, mirror = false, palette = []) {
    if (palette.length === 0) return; // skip if no colors available when palate value=0

    // Pick random color and weight for watercolor brush
    brush.stroke(p.random(palette));
    brush.strokeWeight(3);

    // Determine the progress along the spine
    let baseProgress = 0.4 + (i / num) * 0.6;
    let spineSegment = baseProgress * (points.length - 1);
    let segmentIndex = Math.floor(spineSegment);
    let segmentProgress = spineSegment - segmentIndex;

    // Handle case where progress exceeds spine length
    if (segmentIndex >= points.length - 1) {
      segmentIndex = points.length - 2;
      segmentProgress = 1;
    }

    // Interpolate starting point between spine segments
    let startX = p.lerp(points[segmentIndex][0], points[segmentIndex + 1][0], segmentProgress);
    let startY = p.lerp(points[segmentIndex][1], points[segmentIndex + 1][1], segmentProgress);

    // Calculate perpendicular offset direction
    let dx = points[segmentIndex + 1][0] - points[segmentIndex][0];
    let dy = points[segmentIndex + 1][1] - points[segmentIndex][1];
    let len = Math.sqrt(dx * dx + dy * dy);
    let perpX = -dy / len;
    let perpY = dx / len;

    // Apply offset
    let offset = 15;
    if (mirror) {
      startX -= perpX * offset;
      startY -= perpY * offset;
    } else {
      startX += perpX * offset;
      startY += perpY * offset;
    }
    
    // Length and angle variation with bell curve progression
    let featherLen = (i * -2 + 150) * (1 + i / 36);
    let bell = Math.sin(i / num * Math.PI);
    featherLen *= 0.4 + bell * 0.6;
    let angle = (i + 45) * 2;

    // Mirror direction if on left side
    let endX = mirror ? startX - featherLen : startX + featherLen;
    let endY = mirror
      ? startY - featherLen * p.tan(angle * p.PI / 180)
      : startY + featherLen * p.tan(angle * p.PI / 180);

    // Create the spline feather shape
    const feather = mirror
      ? [[startX, startY], 
         [startX - featherLen / 3, startY + angle / 6],
         [startX - featherLen * 2 / 3, startY + angle / 8], 
         [endX, endY]]
      : [[startX, startY], 
         [startX + featherLen / 3, startY - angle / 6],
         [startX + featherLen * 2 / 3, startY - angle / 8], 
         [endX, endY]];

    brush.spline(feather, 1);
  }

