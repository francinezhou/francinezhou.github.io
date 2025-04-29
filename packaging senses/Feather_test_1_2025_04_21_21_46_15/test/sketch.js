     // save your sheet ID and name of the tab as variables for use
     let sheetID = "1xw9LbJNTwGl7zYzxNBh6XXO8HXbsuWXI9pHuOUDqxr8";
     let tabName = 'cocktails';
     let opensheet_uri = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

     // Feather line drawing function (needs to be global)
     function drawFeatherLine(p, i, total, spinePoints, isRightSide) {
         const t = i / total;
         const color = p.random(palette);
         const weight = p.map(i, 0, total, 4, 1);
         const offset = p.map(i, 0, total, 0, 150);
         
         brush.stroke(color);
         brush.strokeWeight(weight);
         
         const points = spinePoints.map(point => {
             const x = isRightSide ? 
                 point[0] + offset * p.noise(i, point[0] * 0.01) : 
                 point[0] - offset * p.noise(i, point[0] * 0.01);
             return [x, point[1]];
         });
         
         brush.spline(points, 1);
     }

     // Global palettes
     const linerPalette = ["#795e6c", "#9e6261", "#6f4644", "#727829", "#677482"];
     const palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"];

     fetch(opensheet_uri)
     .then(function (response) {
         return response.json();
     })
     .then(function (data) {
         const parentContainer = document.getElementById('parent-container'); // ← Grab the existing #container in HTML
 
         data.forEach((cocktail, index) => {
             const sweetness = parseInt(cocktail.sweetness);
             const abv = parseFloat(cocktail.abv);
             const containerID = `cocktail-${index}`;
 
             // Create a new container div for each canvas
             const container = document.createElement('div');
             container.classList.add('cocktail');
             container.id = containerID;
             
             // Add title and info
             const title = document.createElement('div');
             title.classList.add('cocktail-title');
             title.textContent = cocktail.nameEN;
             container.appendChild(title);
             
             const info = document.createElement('div');
             info.classList.add('cocktail-info');
             info.textContent = `${cocktail.abv}% ABV | ${cocktail.flavors}`;
             container.appendChild(info);
             
             // Append to the big parent container
             parentContainer.appendChild(container);
 
             // Create new p5 instance for each feather
             new p5((p) => {
                 p.setup = () => {
                     const canvas = p.createCanvas(600, 600, WEBGL);
                     canvas.parent(containerID);
                     p.pixelDensity(1);
                     p.angleMode(p.DEGREES);
                     p.background(240);
 
                     // Initialize brush for this instance
                     brush.setup(p);
 
                     const featherMaturity = p.map(abv, 3, 35, 2, 0.8);
 
                     brush.add(`liner-${index}`, { /* ... your brush settings ... */ });
                     brush.add(`watercolor-${index}`, { /* ... your brush settings ... */ });
 
                     brush.pick(`liner-${index}`);
                     brush.stroke(p.random(linerPalette));
                     brush.strokeWeight(1);
                     
                     const spinePoints = [[50, 550], [200, 500], [350, 400], [500, 200]];
                     brush.spline(spinePoints, 1);
 
                     brush.pick(`watercolor-${index}`);
                     const numFeatherLines = 24;
                     for (let i = 0; i < numFeatherLines; i++) {
                         drawFeatherLine(p, i, numFeatherLines, spinePoints, false);
                         drawFeatherLine(p, i, numFeatherLines, spinePoints, true);
                     }
                 };
             });
         });
     })
     .catch(function (err) {
         console.log("Something went wrong!", err);
     });