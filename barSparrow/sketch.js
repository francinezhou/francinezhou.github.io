
//Liner Colors in Hue/Saturation/Lightness

const flavorColorMap = {
  tea: "hsl(100, 30%, 40%)",
  herbaceous: "hsl(60, 30%, 40%)",
  fruity: "hsl(20, 40%, 50%)",
  floral: "hsl(350, 30%, 55%)",
  woody: "hsl(20, 25%, 40%)",
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
        const ingredientsDiv = document.createElement('div');
        ingredientsDiv.classList.add('cocktail-ingredients');
        if (cocktail.ingredientsEN?.trim()) {
          ingredientsDiv.textContent = cocktail.ingredientsEN.trim();
        }

     
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
        info.appendChild(ingredientsDiv);
        info.appendChild(palateDiv);
        info.appendChild(abvDiv);
        
        
        container.appendChild(info);
        

        new p5((p) => {

          p.setup = () => {
            
            // CREATE CANVAS
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



           
          

            // DRAW FEATHER SPINE
            
            brush.pick("liner");


            //Spine stroke color defined by the order of the flavors string in JSON 
            // specifically, the first item in the comma-separated list.
            // Example: "flavors": "spiced, herbal" → "spiced" is used
            // If need to change spine color, reorder JSON flavor tag 
            const firstFlavor = cocktail.flavors?.split(",")[0]?.trim().toLowerCase();
            brush.stroke(flavorColorMap[firstFlavor] || "grey"); // fallback to black if no match

            brush.strokeWeight(1);

            const x1 = 100; // start point bottom left
            const y1 = 500;
            
            
            const x5 = 450; // end point top right
            const y5 = 150;

            // Even division along the straight path
            const dx = x5 - x1;
            const dy = y5 - y1;

            const x2 = x1 + dx / 3;
            const y2 = y1 + dy / 3;


            const x4 = x1 + dx * 2 / 3;
            const y4 = y1 + dy * 2 / 3;



            // Apply curve offsets to bend the spine
            const curveOffsetX = -10;     // set to 20 or -20 for horizontal bending
            const curveOffsetY = -20;   // negative bends upward, positive downward

            const spinePoints = [
              [x1, y1],
              [x2 + curveOffsetX, y2 + curveOffsetY],
            
              [x4 + curveOffsetX, y4 + curveOffsetY],
              [x5, y5]
            ];

            
            brush.spline(spinePoints, 1); //0-1

            console.log(spinePoints);
            // END of spine code



            
            
            const abv = parseFloat(cocktail.abv);
            


            // Dynamically map ABV to pressure range
            const spacingVal = p.map(abv, 0, 40, 0.6, 0.3);

            const minVal = p.map(abv, 0, 40, 0.15, 1.5);
            const maxVal = p.map(abv, 0, 40, 1, 2);
            
            // Create a custom watercolor brush definition for this instance
            brush.add(`watercolor-${index}`, {
              type: "custom",
              weight: 30,
              vibration: 2,
              definition: 0.5,
              quality: 8,
              opacity: 23,
              spacing: spacingVal,
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
      
            console.log(`ABV: ${abv} → spacing: ${spacingVal.toFixed(2)} | pressure min_max: [${minVal.toFixed(2)}, ${maxVal.toFixed(2)}]`);

            console.log(`ABV: ${abv} → pressure min_max: [${minVal.toFixed(2)}, ${maxVal.toFixed(2)}]`);

            
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
                const saturation = 60;
                const lightness = 90 - level * 25; // 
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
            


            // DRAW FEATHER LINES
            // brush.pick(`marker`);
            brush.pick(`watercolor-${index}`);

            //brush.bleed(strength, direction)
            //Adjusts the bleed and texture levels for the fill operation, mimicking the behavior of watercolor paints. This function adds a natural and organic feel to digital artwork.

            // strength (Number): The intensity of the bleed effect, capped at 0.5.
            // direction (String): Optional. "out" or "in". Defines the direction of the bleed effect
            // _borderIntensity (Number): The intensity of the border watercolor effect, ranging from 0 to 1.
            brush.bleed(0.5, "out", 1); //0-0.5, in/out, 1

            const numFeatherLines = 24;
           
            for (let i = 0; i < numFeatherLines; i++) {
              // Right side lines
              drawFeatherLine(p, i, numFeatherLines, spinePoints, false, featherPalette);
              // Left side lines (mirrored)
              drawFeatherLine(p, i, numFeatherLines, spinePoints, true, featherPalette);
            }
          

            // DRAW FLAVORS STROKES based on data
            // DRAW FLOWER PETALS for floral flavor
            if (cocktail.flavors?.toLowerCase().includes("floral")) {
              drawFloralStrokes(p, spinePoints, "floral");
            }
            
            
            if (cocktail.flavors?.toLowerCase().includes("herbaceous")) {
              drawHerbStrokes(p);
            }
            
           
              // DRAW SPRAY STROKES for savoury flavor
              if (cocktail.flavors?.toLowerCase().includes("savoury")) {
                drawSavouryStrokes(p);
              }
              
  
  
          
    
            
            // DRAW CANVAS BORDER
            p.push();
            p.stroke(255, 0, 0);
            p.noFill();
            p.rect(0, 0, p.width, p.height);
            p.pop();
          

          };
          p.draw = () => {};
        });
      });
    });

// Function to draw one feather line, mirrored if specified
// mirror false is right side, mirror true is left side
function drawFeatherLine(p, i, num, points, mirror = false, palette = []) {
  if (palette.length === 0) return;

  brush.stroke(p.random(palette));
  brush.strokeWeight(3);

  // Determine progress along the spine
  const baseProgress = 0.2 + (i / num) * 0.7; //  starting positon // ideally add up to 1
  let spineSegment = baseProgress * (points.length - 1);
  let segmentIndex = Math.floor(spineSegment);
  let segmentProgress = spineSegment - segmentIndex;

  if (segmentIndex >= points.length - 1) {
    segmentIndex = points.length - 2;
    segmentProgress = 1;
  }

  // Interpolate the point on the spine
  const interpolate = (a, b, t) => [p.lerp(a[0], b[0], t), p.lerp(a[1], b[1], t)];
  const spineStart = points[segmentIndex];
  const spineEnd = points[segmentIndex + 1];
  const [startX, startY] = interpolate(spineStart, spineEnd, segmentProgress);

  // Calculate spine tangent and normal
  const segDx = spineEnd[0] - spineStart[0];
  const segDy = spineEnd[1] - spineStart[1];
  const len = Math.sqrt(segDx * segDx + segDy * segDy);
  const nx = -segDy / len;
  const ny = segDx / len;
  
  const spineAngle = Math.atan2(segDy, segDx); // radians

  // Offset from the spine (perpendicular)
  const offset = 15;
  const ox = nx * offset;
  const oy = ny * offset;

  const fx = startX + ox;
  const fy = startY + oy;

  // Feather length and curve variation
  let featherLen = (i * -2 + 150) * (1 + i / 36);
  let bell = Math.sin(i / num * Math.PI);
  featherLen *= 0.5 + bell * 0.6; // general length + exponential length

  // Angle away from spine increases along feather
  const angleOffset = p.map(i, 0, num - 1, 3, 10); // from flat to steep // change last 2 values
  const featherAngle = spineAngle + p.radians(angleOffset);

  const endX = fx + featherLen * Math.cos(featherAngle);
  const endY = fy + featherLen * Math.sin(featherAngle);

  // Define control points once
  const controlPoints = [
    [fx, fy],
    [fx + featherLen / 3, fy - angleOffset / 2], // [1/3 interval between fX & endX (don't change), change y value to control curvature]
    [fx + featherLen * 2 / 3, fy - angleOffset * 4], // [2/3 interval, change]
    [endX, endY]
  ];

  if (i === 0) {
    console.log("First feather line coords:", controlPoints);
  } else if (i === num - 1) {
    console.log("Last feather line coords:", controlPoints);
  }

  if (mirror) {
    const reflect = (x, y) => {
      const vx = x - startX;
      const vy = y - startY;
      const dot = vx * nx + vy * ny;
      return [x - 2 * dot * nx, y - 2 * dot * ny];
    };

    const mirroredFeather = controlPoints.map(([x, y]) => reflect(x, y)).reverse();
    brush.spline(mirroredFeather, 1);
  } else {
    brush.spline(controlPoints, 1);
  }
}
function drawFloralStrokes(p, spinePoints, flavorKey = "floral") {
  const color = flavorColorMap[flavorKey];
  if (!color || spinePoints.length < 2) return;

  brush.pick("liner");
  brush.stroke(color);
  brush.strokeWeight(1);

  const numPetals = 5;
  const petalLength = 90;
  const petalCurve = 45;
  const petalOffset = 30;

  const petal = [
    [0, 0],
    [petalLength / 2, -petalCurve],
    [petalLength, 0]
  ];

  const transform = (pts, cx, cy, angle) =>
    pts.map(([px, py]) => {
      const rx = px * Math.cos(angle) - py * Math.sin(angle);
      const ry = px * Math.sin(angle) + py * Math.cos(angle);
      return [cx + rx, cy + ry];
    });

  for (let i = 0; i < numPetals; i++) {
    const baseProgress = 0.1 + (i / numPetals) * 0.8;
    let segIndex = Math.floor(baseProgress * (spinePoints.length - 1));
    let segT = baseProgress * (spinePoints.length - 1) - segIndex;

    if (segIndex >= spinePoints.length - 1) {
      segIndex = spinePoints.length - 2;
      segT = 1;
    }

    const interpolate = (a, b, t) => [p.lerp(a[0], b[0], t), p.lerp(a[1], b[1], t)];
    const start = spinePoints[segIndex];
    const end = spinePoints[segIndex + 1];
    const [anchorX, anchorY] = interpolate(start, end, segT);

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const spineAngle = Math.atan2(dy, dx);

    const spiralRotation = p.radians(i * 1); // 20° offset each step

    // Offset the petal root slightly outward from spine
    const ox = Math.cos(spineAngle + spiralRotation) * petalOffset;
    const oy = Math.sin(spineAngle + spiralRotation) * petalOffset;
    const petalX = anchorX + ox;
    const petalY = anchorY + oy;

    // Final rotation: along spine + outward angle
    const finalAngle = spineAngle + spiralRotation;

    const rotatedPetal = transform(petal, petalX, petalY, finalAngle);
    brush.spline(rotatedPetal, 1);

    if (i === 0) console.log("First floral petal:", rotatedPetal);
  }
}



  function drawHerbStrokes(p, flavorKey = "herbaceous") {
    const flavorColor = flavorColorMap[flavorKey];

    brush.pick("liner");
    brush.stroke(flavorColor);
    brush.strokeWeight(1);

  const strokes = [
    [[320, 200], [325, 190], [330, 180]], // top right
    [[270, 190], [265, 180], [260, 170]], // top left
    [[350, 310], [360, 300], [370, 290]], // right middle
    [[250, 320], [240, 310], [230, 300]], // left middle
    [[290, 400], [300, 410], [310, 420]], // bottom center
  ];

  for (let curve of strokes) {
    brush.spline(curve, 1);
  }

    // Reset state to prevent leak into the next canvas
    brush.noFill();
}

function drawSavouryStrokes(p, flavorKey = "savoury") {
  const flavorColor = flavorColorMap[flavorKey];

  brush.pick("marker2");
  brush.stroke(flavorColor);
  brush.strokeWeight(1);

  brush.fill("hsl(211, 100.00%, 79.60%)");
  brush.noStroke();
  brush.noHatch();
  brush.noField();

  const saltPolygons = [
    [[345, 289.5], [348, 290.5], [349, 293.5], [347, 296.5], [344, 296.5], [342, 294], [342.5, 291]],
    [[202, 117], [199.5, 115], [200, 112], [202.5, 110], [205.5, 110.5], [207, 113.5], [205.5, 116.5]],
    [[171.5, 116], [170, 114.5], [170.5, 112], [173, 111], [175, 112], [175.5, 114.5], [174, 116]],
    [[52.5, 198.5], [55.5, 196.5], [59, 198.5], [59, 202.5], [55.5, 204], [52.5, 202]],
    [[79, 109.5], [76.5, 109], [75.5, 106.5], [76.5, 104], [79.5, 103.5], [81, 105.5], [81, 108]],
    [[1.5, 33.5], [4, 31.5], [7.5, 33], [8, 36.5], [5, 38.5], [2, 37]]
  ];
  

  for (let shape of saltPolygons) {
    brush.polygon(shape);
  }

  // Reset state to prevent leak into the next canvas
  brush.noFill();
}



// brush.flowLine(x, y, length, dir)