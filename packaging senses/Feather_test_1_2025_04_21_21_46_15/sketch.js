// save your sheet ID and name of the tab as variables for use
let sheetID = "1xw9LbJNTwGl7zYzxNBh6XXO8HXbsuWXI9pHuOUDqxr8";
let tabName = 'cocktails';

// format them into Ben's uri
let opensheet_uri = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

fetch(opensheet_uri)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // Create a canvas for each cocktail
        data.forEach(cocktail => {
            const sweetness = parseInt(cocktail.sweetness);
            const abv = parseFloat(cocktail.abv);
            const featherInstance = new FeatherCanvas(sweetness, abv);
            featherInstance.setup();
        });
    })
    .catch(function (err) {
        console.log("Something went wrong!", err);
    });

// Class to create a feather canvas
class FeatherCanvas {
    constructor(sweetness, abv) {
        this.sweetness = sweetness;
        this.abv = abv;
        this.canvasWidth = 800;
        this.canvasHeight = 800;
    }

    setup() {
        // Create a new p5 instance
        new p5((p) => {
            p.setup = () => {
                p.createCanvas(this.canvasWidth, this.canvasHeight);
                p.background(240);
                this.drawFeather(p);
                
                drawFeatherLine
            };
        });
    }

    drawFeather(p) {
        // Feather drawing logic
        const featherMaturity = p.map(this.abv, 0, 40, 0, 20);
        

        // CREATE YOUR OWN BRUSHES
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
                min_max: [0.8, 2]
            },
            tip: (_m) => {
                _m.rotate(30), _m.rect(-1.5, -1.5, 3, 3), _m.rect(1, 1, 1, 1);
            },
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
                min_max: [featherMaturity, featherMaturity + 1.2]
            },
            tip: (_m) => {
                _m.rotate(45), _m.rect(-1.5, -1.5, 3, 3), _m.rect(1, 1, 1, 1);
            },
            rotate: "natural"
        });

        
        // Example feather drawing logic
        p.strokeWeight(2); // Thicker stroke for visibility
        p.stroke(0);
        p.fill(255, 0, 0, featherMaturity); // Example color based on abv

        // Draw a simple feather shape (you can customize this)
        p.beginShape();
        p.vertex(400, 400); // Centered in the canvas
        p.bezierVertex(450, 350, 450, 450, 400, 400);
        p.bezierVertex(350, 450, 350, 350, 400, 400);
        p.endShape();
    }
}

// Object for creation and real-time resize of canvas
const C = {
    loaded: false,
    prop() { return this.height / this.width },
    isLandscape() { return window.innerHeight <= window.innerWidth * this.prop() },
    resize() {
        if (this.isLandscape()) {
            console.log("yes")
            document.getElementById(this.css).style.height = "100%";
            document.getElementById(this.css).style.removeProperty('width');
        } else {
            document.getElementById(this.css).style.removeProperty('height');
            document.getElementById(this.css).style.width = "100%";
        }
    },
    setSize(w, h, p, css) {
        this.width = w, this.height = h, this.pD = p, this.css = css;
    },
    createCanvas() {
        this.main = createCanvas(this.width, this.height, WEBGL), pixelDensity(this.pD), this.main.id(this.css), this.resize();
    }
};
C.setSize(800, 800, 1, 'mainCanvas')

function windowResized() {
    C.resize();
}

// CREATE YOUR OWN BRUSHES
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
        min_max: [0.8, 2]
    },
    tip: (_m) => {
        _m.rotate(30), _m.rect(-1.5, -1.5, 3, 3), _m.rect(1, 1, 1, 1);
    },
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
        min_max: [2.5, 1]
    },
    tip: (_m) => {
        _m.rotate(45), _m.rect(-1.5, -1.5, 3, 3), _m.rect(1, 1, 1, 1);
    },
    rotate: "natural"
});

// Colors  HSL 
let linerPalette = [
    "hsl(20, 40%, 50%)", // fruity
    "hsl(350, 30%, 55%)", // floral
    "hsl(100, 30%, 40%)", // tea
    "hsl(60, 30%, 40%)", // herb
    "hsl(20, 25%, 40%)", //wood
    "hsl(10, 70%, 40%)", // spiced
    "hsl(210, 15%, 50%)"  //savoury
];

let palette = [
    "hsl(55, 100%, 60%)",  // Sourness
    "hsl(340, 80%, 60%)",  // Sweetness
    "hsl(30, 100%, 30%)",  // Bitterness
    "hsl(10, 100%, 50%)",  // Spicyness
    "hsl(195, 100%, 35%)", // Saltiness
];



// Function to draw one feather line, mirrored if specified
// mirror false is right side, mirror true is left side
function drawFeatherLine(i, numFeatherLines, spinePoints, mirror = false) {
    // Pick random color and weight for watercolor brush
    brush.stroke(random(palette));
    brush.strokeWeight(random(2, 3.5));

    // Determine the progress along the spine
    let baseProgress = 0.4 + (i / numFeatherLines) * 0.6;
    let extensionFactor = 1 + (i / numFeatherLines) * 0;
    let spineProgress = baseProgress * extensionFactor;
    let spineSegment = spineProgress * (spinePoints.length - 1);
    let segmentIndex = Math.floor(spineSegment);
    let segmentProgress = spineSegment - segmentIndex;

    // Handle case where progress exceeds spine length
    if (segmentIndex >= spinePoints.length - 1) {
        segmentIndex = spinePoints.length - 2;
        segmentProgress = 1;
    }

    // Interpolate starting point between spine segments
    let startX = spinePoints[segmentIndex][0] +
        (spinePoints[segmentIndex + 1][0] - spinePoints[segmentIndex][0]) * segmentProgress;
    let startY = spinePoints[segmentIndex][1] +
        (spinePoints[segmentIndex + 1][1] - spinePoints[segmentIndex][1]) * segmentProgress;

    // Add extension for overshooting
    if (spineProgress > 1) {
        let extension = spineProgress - 1;
        let lastSegmentX = spinePoints[spinePoints.length - 1][0] - spinePoints[spinePoints.length - 2][0];
        let lastSegmentY = spinePoints[spinePoints.length - 1][1] - spinePoints[spinePoints.length - 2][1];
        startX += lastSegmentX * extension;
        startY += lastSegmentY * extension;
    }

    // Calculate perpendicular offset direction
    let dx = spinePoints[segmentIndex + 1][0] - spinePoints[segmentIndex][0];
    let dy = spinePoints[segmentIndex + 1][1] - spinePoints[segmentIndex][1];
    let segmentLength = Math.sqrt(dx * dx + dy * dy);
    let perpX = -dy / segmentLength;
    let perpY = dx / segmentLength;

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
    let length = (i * -2 + 150) * (1 + i / 36);
    let progress = i / numFeatherLines;
    let bellCurve = Math.sin(progress * Math.PI);
    length = length * (0.4 + bellCurve * 0.6);
    let angle = (i + 45) * 2;

    // Mirror direction if on left side
    let endX = mirror ? startX - length : startX + length;
    let endY = mirror
        ? startY - length * tan(angle * PI / 180)
        : startY + length * tan(angle * PI / 180);

    // Create the spline feather shape
    let featherPoints = mirror
        ? [
            [startX, startY],
            [startX - length / 3, startY + angle / 6],
            [startX - length * 2 / 3, startY + angle / 8],
            [endX, endY]
        ]
        : [
            [startX, startY],
            [startX + length / 3, startY - angle / 6],
            [startX + length * 2 / 3, startY - angle / 8],
            [endX, endY]
        ];

    brush.spline(featherPoints, 1);
}

function setup() {
    // Canvas should be WEBGL!!
    C.createCanvas();
    pixelDensity(2), angleMode(DEGREES);
    translate(-width / 2, -height / 2);

    background(240);

    // Draw feather spine
    brush.pick("liner")
    brush.stroke(random(linerPalette))
    brush.strokeWeight(1)
    let spinePoints = [[50, 550], [200, 500], [350, 400], [500, 200]];
    brush.spline(spinePoints, 1);

    // draw palate liner strokes 
    // floral


    
    // Draw feather lines
    brush.pick("watercolor");
    const numFeatherLines = 24;

    // Right side lines
    for (let i = 0; i < numFeatherLines; i++) {
        drawFeatherLine(i, numFeatherLines, spinePoints, false);
    }

    // Left side lines (mirrored)
    for (let i = 0; i < numFeatherLines; i++) {
        drawFeatherLine(i, numFeatherLines, spinePoints, true);
    }
}
