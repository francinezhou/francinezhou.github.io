//////////////////////////////////////////////////
// Object for creation and real-time resize of canvas
// Good function to create canvas and resize functions. I use this in all examples.
const C = {
    loaded: false,
    prop() {return this.height/this.width},
    isLandscape() {return window.innerHeight <= window.innerWidth * this.prop()},
    resize () {
        if (this.isLandscape()) {
          console.log("yes")
            document.getElementById(this.css).style.height = "100%";
            document.getElementById(this.css).style.removeProperty('width');
        } else {
            document.getElementById(this.css).style.removeProperty('height');
            document.getElementById(this.css).style.width = "100%";
        }
    },
    setSize(w,h,p,css) {
        this.width = w, this.height = h, this.pD = p, this.css = css;
    },
    createCanvas() {
        this.main = createCanvas(this.width,this.height,WEBGL), pixelDensity(this.pD), this.main.id(this.css), this.resize();
    }
};
C.setSize(1500,2000,1,'mainCanvas')

function windowResized () {
    C.resize();
}

//////////////////////////////////////////////////
// The example really starts here
let palette = ["brown", "black"]
//let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"]

let scrollOffset = 0;  // Horizontal scroll offset

function setup () {
    C.createCanvas()
    angleMode(DEGREES)
    
    // Set low frame rate for slow animation
    frameRate(20)  
}

function draw() {
    // Clear the background each frame
    background("#fffceb")
  
    translate(-width/2,-height/2)  
  
    // We create a grid here
    let num_cols = 6
    let num_rows = 3
    let border_horizontal = 0;  // left and right border
    let border_vertical = 600;     // top and bottom border
    let col_size = (width - border_horizontal) / num_cols
    
    // Define row heights as percentages of available height
    let available_height = height - border_vertical
    let row_1_height = available_height * 0.20  // 20% for row 1
    let row_2_height = available_height * 0.60  // 60% for row 2
    let row_3_height = available_height * 0.20  // 20% for row 3
    let row_heights = [row_1_height, row_2_height, row_3_height]
  
    // We define the brushes for the hatches, and the brushes for the strokes
    //2B, HB, 2H, cpencil, pen, rotring, spray, marker, marker2, charcoal, and hatch_brush (for clean hatching).
    let hatch_brushes = ["marker"]
    // "marker2"
    let stroke_brushes = ["2H"]
    // , "HB", "charcoal"
    
    // Test Different Flowfields here: "zigzag", "seabed", "curved", "truncated"
    brush.field("zigzag")
    // You can also disable field completely with brush.noField()

    // We create the grid here
    let y_position = border_vertical/2  // Start position for rows
    
    // Increase scroll offset each frame
    scrollOffset += 5;
    
    // Draw extra columns to cover the wrapping
    for (let i = 0; i < num_rows; i++) {
        let current_row_height = row_heights[i]
        
        for (let j = -1; j <= num_cols; j++) {  // Draw one extra column on each side
           
            // Calculate the actual column index with wrapping
            let actualCol = floor((j * col_size + scrollOffset) / col_size) % num_cols;
            if (actualCol < 0) actualCol += num_cols;
            
            // Calculate cell position with scroll offset
            let cell_x = border_horizontal/2 + col_size * j - (scrollOffset % col_size)
            let cell_y = y_position
            
            // Skip if outside visible area
            if (cell_x + col_size < 0 || cell_x > width) continue;
            
            // Use deterministic random based on actual column and row
            randomSeed(actualCol + i * 100);
            
            // Check if this is row 2 and certain columns (e.g., columns 1, 3, 4)
            let useFlowLines = (i === 1) && (actualCol === 1 || actualCol === 3 || actualCol === 4)
            
            // Determine if this cell should use flowLines or regular pattern
            let shouldFill = random() < 0.1
            
            if (useFlowLines && !shouldFill) {
              // Use seabed flowLines instead of regular hatch for row 2, certain columns
              brush.field("seabed")
              brush.set(random(hatch_brushes), random(palette))
              
              // Calculate flowLines - vertical lines as long as unit height
              let hatch_distance = random(30, 100)  // spacing between vertical lines (fewer lines)
              let hatch_angle = -90     // vertical angle
              let num_lines = floor(col_size / hatch_distance)
              
              // Draw vertical flowLines across the cell width
              for (let k = 0; k < num_lines; k++) {
                let line_x = cell_x + hatch_distance/2 + k * hatch_distance
                let line_y = cell_y
                brush.flowLine(line_x, line_y, current_row_height, hatch_angle)
              }
              
              brush.field("zigzag")  // reset to default field
              // Don't draw rectangle for flowLine cells
            } 

            else {
              // Regular cells with fill or hatch
              if (shouldFill) {
                //brush.fill(a, b, c, d) or brush.fill(color, opacity)
                brush.fill("black", random(100,100))
                brush.bleed(random(0,0.2))
                //brush.fillTexture(textureStrength, borderIntensity)
                brush.fillTexture(0.05,0.6)
              } else {
                // Regular hatch for other cells
                // Set Stroke
                brush.set(random(stroke_brushes), random(palette))
                //brush.noStroke();
                // Set Hatch
                // You set color and brush with .setHatch(brush_name, color)
        
                brush.setHatch(random(hatch_brushes), random(palette))
                // You set hatch params with .hatch(distance_between_lines, angle, options: see reference)
                brush.hatch(random(20,60), random(85,90), {rand: 0, continuous: false, gradient: false})
              }
              
              // Draw rectangle for all non-flowLine cells
              brush.rect(cell_x, cell_y, col_size, current_row_height)
            }
          
            // Reset states for next cell
            brush.noStroke()
            brush.noFill()
            brush.noHatch()
        }
        
        // Move y_position down for next row
        y_position += current_row_height
    }
}