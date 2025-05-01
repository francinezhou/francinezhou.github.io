 // Define brushes globally (before any instance starts)
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

  brush.add("watercolor", {
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
        curve: [0.15, 0.25], 
        min_max: [2.5, 1] },
    tip: (_m) => { _m.rotate(45); _m.rect(-1.5, -1.5, 3, 3); },
    rotate: "natural"
  });

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

const canvasWidth = 600;
const canvasHeight = 600;


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
            brush.instance(p);
            brush.load();
            

            p.createCanvas(canvasWidth, canvasHeight, p.WEBGL).parent(container);
            p.pixelDensity(2);
            p.angleMode(p.DEGREES);
            p.background(240);
            p.translate(-canvasWidth / 2, -canvasHeight / 2 );

            // Spine (same for now)
            const spinePoints = [[0, 250], [120, 200], [180, 120], [250, 50]];

            // Liner spine
            brush.pick("liner");
            brush.stroke(p.random(linerPalette));
            brush.strokeWeight(1);
            brush.spline(spinePoints, 1);

            // ABV controls brush pressure
            brush.pick("watercolor");
            const abv = parseFloat(cocktail.abv);
            const numLines = Math.floor(p.map(abv, 0, 40, 0, 24));

            for (let i = 0; i < numLines; i++) {
              drawFeatherLine(p, i, numLines, spinePoints, false);
              drawFeatherLine(p, i, numLines, spinePoints, true);
            }

            // Label
            p.push();
            p.fill(0);
            p.noStroke();
            p.textSize(14);
            p.textAlign(p.LEFT, p.TOP);
            p.text(`${cocktail.nameEN}`, 10, 10);
            p.text(`${cocktail.abv}% ABV`, 10, 30);
            p.pop();
          };
          p.draw = () => {};
        });
      });
    });

  function drawFeatherLine(p, i, num, points, mirror = false) {
    brush.stroke(p.random(palette));
    brush.strokeWeight(p.random(1, 3.5));

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