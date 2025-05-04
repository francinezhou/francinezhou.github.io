// --- p5.js Instance Mode Only ---
// No global canvas, only one canvas per cocktail (instance mode)

// // Color palettes
// let linerPalette = [
//   "hsl(20, 40%, 50%)", // fruity
//   "hsl(350, 30%, 55%)", // floral
//   "hsl(100, 30%, 40%)", // tea
//   "hsl(60, 30%, 40%)", // herb
//   "hsl(20, 25%, 40%)", //wood
//   "hsl(10, 70%, 40%)", // spiced
//   "hsl(210, 15%, 50%)"  //savoury
// ];
// let palette = [
//   "hsl(55, 100%, 60%)",  // Sourness
//   "hsl(340, 80%, 60%)",  // Sweetness
//   "hsl(30, 100%, 30%)",  // Bitterness
//   "hsl(10, 100%, 50%)",  // Spicyness
//   "hsl(195, 100%, 35%)", // Saltiness
// ];

// Create the parent container
const parentContainer = document.createElement('div');
parentContainer.id = 'parent-container';
document.body.appendChild(parentContainer);

// Your spreadsheet info
let sheetID = "1xw9LbJNTwGl7zYzxNBh6XXO8HXbsuWXI9pHuOUDqxr8";
let tabName = 'cocktails';
let opensheet_uri = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

fetch(opensheet_uri)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.forEach((cocktail, index) => {
      // Create a container div for each cocktail
      const container = document.createElement('div');
      container.id = `cocktail-${index}`;
      parentContainer.appendChild(container);

      // Instance mode sketch
      let sketch = function(p) {
        // Register instance method here, sending your function arg p
        brush.instance(p);
       
        p.setup = function() {
          let canvas = p.createCanvas(600, 600, p.WEBGL); // or whatever size you want
          canvas.parent(container.id);

          p.pixelDensity(2);
          p.translate(-600/2,-600/2);
          brush.load();

         
          p.angleMode(p.DEGREES);
          p.textFont('sans-serif');
          
          p.background(240);

          p.push();
       
          drawFeather(p, parseFloat(cocktail.abv));
        
          p.pop();


          const spinePoints = [[10, 50], [200, 500], [350, 400], [500, 200]];
          // Add debugging
console.log("Drawing spline with points:", spinePoints);

// Set up brush style
p.brush.set("HB", "#002185", 1);

p.brush.spline(spinePoints, 1);

 
    // then this
        //   // Draw info
        //   p.fill(0);
        //   p.textSize(18);
        // //   p.textAlign(p.LEFT, p.TOP);
        //   p.text(cocktail.nameEN, 10, 10);
        //   p.textSize(14);
        //   p.text(`${cocktail.abv}% ABV | ${cocktail.flavors}`, 10, 35);
         
          //Draw feather

        //   drawFeatherSpine(p, parseFloat(cocktail.sweetness));

        };

        p.draw = function() {
           

        };
      };

      new p5(sketch);
    });
  })
  .catch(function (err) {
    // Display error in a user-visible way
      console.log("Something went wrong!", err);
  });


function drawFeather(p, abv) {
  let featherMaturity = p.map(abv, 0, 40, 0, 100);
  p.strokeWeight(2);
  p.stroke(1);
  p.fill(255, 0, 0, featherMaturity);
  p.beginShape();
  p.vertex(0, 50);
  p.bezierVertex(20, 500, 350, 400, 500, 200);
  p.endShape();
}

function drawFeatherSpine(p, sweetness) {
    // const featherLength = p.map(sweetness, 0, 3, 0, 10);
    const spinePoints = [[10, 50], [200, 500], [350, 400], [500, 200]];
    
    // Add debugging
    console.log("Drawing spline with points:", spinePoints);
  
    // Set up brush style
    brush.set("HB", "#002185", 1);
  
   
    brush.spline(spinePoints, 1);

  }
  


  


  

