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
C.setSize(1500,1500,1,'mainCanvas')

function windowResized () {
    C.resize();
}

//////////////////////////////////////////////////
// The example really starts here
let palette = ["#3B2439", "#1b4332"]  // dark purple, dark green
let darkerPurple = "#3B2439"  // darker purple for row 2
//let palette = ["#7b4800", "#002185", "#003c32", "#fcd300", "#ff2702", "#6b9404"]

let scrollOffset = 0;  // Horizontal scroll offset
let slopeAmount = 0;   // Slope angle in degrees: starts at 0, gradually becomes 10 when midlow reaches 10
let targetSlopeAmount = 0;  // Target slope to lerp towards

let track;  // Audio track
let isPlaying = true;  // Track play state

// Track bass state for each column position
let bassHistory = {};  // Stores whether each column had bass when it entered
let circleHistory = {};  // Stores whether each merged unit should have circles
let flowLineHistory = {};  // Stores which field type each flowLine column should use
let midlowRangeHistory = {};  // Stores the midlow range state for merged units
let squareHistory = {};  // Stores whether rotating squares should appear for each column

let hasReachedHighMidlow = false;  // Track if midlow has ever reached 10
let hasReachedHighTreble = false;  // Track if treble has ever reached 60

function preload() {
    // Load the music file
    track = loadSound('我所有的夜有所梦里.mp3');
}

function setup () {
    C.createCanvas()
    angleMode(DEGREES)
    
    // Set low frame rate for slow animation
    frameRate(20)
    
    // Initialize cottonSound for audio analysis
    initiateCottonSound();
    
    // Play the music
    track.play();
}

function draw() {
    // Update audio data each frame (REQUIRED for cottonSound)
    updateAudioData();
    
    // Get bass detection for controlling row 1 and 3 hatches
    // Only detect bass if music is actually playing AND has audible volume
    let currentAmplitude = analyzeAmplitude();  // 0-100
    let bassVal = analyzeEnergyBassVal();  // 0-100
    let hasDominantBass = track.isPlaying() && currentAmplitude > 15 && bassVal > 30;  // Lower threshold for more frequent hatches
    
    // Get midlow energy for controlling circle appearance
    let midlowVal = analyzeEnergyLowMidVal();  // 0-100
    let hasHighMidlow = track.isPlaying() && currentAmplitude > 15 && midlowVal > 35;
    
    // Get treble energy for controlling diamond appearance on flowLines
    let trebleVal = analyzeEnergyTrebleVal();  // 0-100
    
    // Track if midlow has ever reached 10 (permanent change)
    if (midlowVal >= 10) {
        hasReachedHighMidlow = true;
    }
    
    // Track if treble has ever reached 60 (permanent change)
    if (trebleVal >= 60) {
        hasReachedHighTreble = true;
    }
    
    // Gradually increase slope to 5 when midlow reaches 10, then to 10 when treble reaches 60
    if (hasReachedHighTreble) {
        targetSlopeAmount = 10;
    } else if (hasReachedHighMidlow) {
        targetSlopeAmount = 5;
    } else {
        targetSlopeAmount = 0;
    }
    
    // Smoothly lerp slope amount towards target (0.05 = gradual transition)
    slopeAmount = lerp(slopeAmount, targetSlopeAmount, 0.05);
    
    // Clear the background each frame
    background("#fffceb")
  
    translate(-width/2,-height/2)  
  
    // We create a grid here
    let num_cols = 12
    let num_rows = 3
    let border_horizontal = 0;  // left and right border
    let border_vertical = 600;     // top and bottom border
    let col_size = (width - border_horizontal) / num_cols
    
    // Define row heights as percentages of available height
    // Once midlow reaches 10, permanently switch to new ratio
    let available_height = height - border_vertical
    let row_1_height, row_2_height, row_3_height;
    
    if (!hasReachedHighMidlow) {
      // Before midlow reaches 10: 20%, 50%, 30%
      row_1_height = available_height * 0.20
      row_2_height = available_height * 0.50
      row_3_height = available_height * 0.30
    } else {
      // After midlow reaches 10 (permanent): 15%, 70%, 15%
      row_1_height = available_height * 0.15
      row_2_height = available_height * 0.70
      row_3_height = available_height * 0.15
    }
    
    let row_heights = [row_1_height, row_2_height, row_3_height]
  
    // We define the brushes for the hatches, and the brushes for the strokes
    //2B, HB, 2H, cpencil, pen, rotring, spray, marker, marker2, charcoal, and hatch_brush (for clean hatching).
    let hatch_brushes = ["marker"]
    // "marker2"
    let stroke_brushes = ["pen"]
    // , "HB", "charcoal"
    
    // Test Different Flowfields here: "zigzag", "seabed", "curved", "truncated"
    brush.field("zigzag")
    // You can also disable field completely with brush.noField()

    // We create the grid here
    let y_position = border_vertical/2  // Start position for rows
    
    // Increase scroll offset each frame
    //speed
    scrollOffset += 7;
    
    // Draw extra columns to cover the wrapping
    for (let i = 0; i < num_rows; i++) {
        let current_row_height = row_heights[i]
        
        for (let j = -1; j <= num_cols; j++) {  // Draw one extra column on each side
           
            // Calculate the actual column index with wrapping
            let actualCol = floor((j * col_size + scrollOffset) / col_size) % num_cols;
            if (actualCol < 0) actualCol += num_cols;
            
            // Calculate cell position with scroll offset
            let cell_x = border_horizontal/2 + col_size * j - (scrollOffset % col_size)
            
            // Get the column position for bass history lookup
            let colPosition = floor((j * col_size + scrollOffset) / col_size);
            
            // INSTANTANEOUS: Capture bass state for any new column entering the visible area from right
            // Widen the detection zone to ensure we never miss a column
            if (bassHistory[colPosition] === undefined && cell_x >= width - col_size * 3) {
                bassHistory[colPosition] = hasDominantBass;
            }
            
            // Also check positions slightly ahead to ensure no gaps
            if (bassHistory[colPosition + 1] === undefined) {
                bassHistory[colPosition + 1] = hasDominantBass;
            }
            
            // Capture midlow state for merged circle units entering from right
            if (circleHistory[colPosition] === undefined && cell_x >= width - col_size * 3) {
                circleHistory[colPosition] = hasHighMidlow;
                // Store midlow range: "high" (>35), "medium" (10-35), "low" (<10)
                if (midlowVal > 35) {
                    midlowRangeHistory[colPosition] = "high";
                } else if (midlowVal >= 10) {
                    midlowRangeHistory[colPosition] = "medium";
                } else {
                    midlowRangeHistory[colPosition] = "low";
                }
            }
            if (circleHistory[colPosition + 1] === undefined) {
                circleHistory[colPosition + 1] = hasHighMidlow;
                if (midlowVal > 35) {
                    midlowRangeHistory[colPosition + 1] = "high";
                } else if (midlowVal >= 10) {
                    midlowRangeHistory[colPosition + 1] = "medium";
                } else {
                    midlowRangeHistory[colPosition + 1] = "low";
                }
            }
            
            // Capture flowLine field type for columns entering from right
            // Use "seabed" when midlow > 10, otherwise "curved"
            if (flowLineHistory[colPosition] === undefined && cell_x >= width - col_size * 3) {
                flowLineHistory[colPosition] = (midlowVal > 10) ? "seabed" : "curved";
            }
            if (flowLineHistory[colPosition + 1] === undefined) {
                flowLineHistory[colPosition + 1] = (midlowVal > 10) ? "seabed" : "curved";
            }
            
            // Capture whether rotating squares should appear (when hasHighMidlow)
            if (squareHistory[colPosition] === undefined && cell_x >= width - col_size * 3) {
                squareHistory[colPosition] = hasHighMidlow;
            }
            if (squareHistory[colPosition + 1] === undefined) {
                squareHistory[colPosition + 1] = hasHighMidlow;
            }
            
            // Default to false (no bass) if position hasn't been recorded yet
            let hasBass = bassHistory[colPosition] === true;
            let shouldShowCircles = circleHistory[colPosition] === true;
            let flowLineField = flowLineHistory[colPosition] || "curved";  // Default to curved
            let midlowRange = midlowRangeHistory[colPosition] || "low";  // Default to low
            let shouldShowSquare = squareHistory[colPosition] === true;
            let cell_y = y_position
            
            // Skip if outside visible area
            if (cell_x + col_size < 0 || cell_x > width) continue;
            
            // Check if this is row 2 and use flowLines every 4 columns
            let useFlowLines = (i === 1) && (actualCol % 4 === 0)
            
            // Check if this is row 2 and first of merged 3-column unit (for circle filling)
            let useMergedCircles = (i === 1) && (actualCol % 4 === 1)
            
            // Skip if this is part of merged unit but not the first column
            let skipCell = (i === 1) && (actualCol % 4 === 2 || actualCol % 4 === 3)
            
            if (skipCell) continue;  // Skip drawing this cell, it's part of merged unit
            
            // No fill pattern
            let shouldFill = false
            
            // Calculate slope offsets for this cell's corners using tan(angle)
            // For merged cells, width is 3x col_size
            let cellWidth = useMergedCircles ? col_size * 3 : col_size
            let leftSlope = cell_x * tan(-slopeAmount)
            let rightSlope = (cell_x + cellWidth) * tan(-slopeAmount)
            
            // Define parallelogram vertices: [top-left, top-right, bottom-right, bottom-left]
            let vertices = [
              [cell_x, cell_y + leftSlope],                                        // top-left
              [cell_x + cellWidth, cell_y + rightSlope],                           // top-right
              [cell_x + cellWidth, cell_y + current_row_height + rightSlope],      // bottom-right
              [cell_x, cell_y + current_row_height + leftSlope]                    // bottom-left
            ]
            
            if (useFlowLines && !shouldFill) {
              // Use flowLines with field based on midlow when column entered
              // "curved" by default or when midlow < 10, "seabed" when midlow > 10
              brush.field(flowLineField)
              
              // Select brush and color based on column position
              let brushIndex = actualCol % hatch_brushes.length
              let colorIndex = actualCol % palette.length
              // Use darker purple for row 2
              let cellColor = (i === 1 && colorIndex === 0) ? darkerPurple : palette[colorIndex]
              brush.set(hatch_brushes[brushIndex], cellColor)
              
              // Calculate flowLines - use pattern for spacing (alternates between wider/narrower)
              let hatch_distance = 40 + (actualCol % 3) * 20  // alternates: 40, 60, 80
              let hatch_angle = -90     // vertical angle
              let num_lines = floor(col_size / hatch_distance)
              
              // Draw flowLines that start from the sloped top edge but remain absolutely vertical
              for (let k = 0; k < num_lines; k++) {
                let line_x = cell_x + hatch_distance/2 + k * hatch_distance
                // Calculate Y position at this X on the top edge of the parallelogram
                let relativePos = (line_x - cell_x) / col_size  // 0 to 1 across cell
                let topEdgeY = cell_y + leftSlope + relativePos * (rightSlope - leftSlope)
                // Draw flowLine absolutely vertical (angle = -90) from the sloped top edge
                brush.flowLine(line_x, topEdgeY, current_row_height, -90)
              }
              
              brush.field("zigzag")  // reset to default field
              // Don't draw polygon for flowLine cells (just the lines)
            } 
            
            else if (useMergedCircles && !shouldFill) {
              // Merged 3-column unit - behavior depends on midlow range when it entered
              
              if (midlowRange === "high") {
                // When midlow > 35: Draw circles
                brush.noField()  // Disable field so circles don't fluctuate
                
                // Select brush and color - use HB brush for circles
                let colorIndex = actualCol % palette.length
                let cellColor = (colorIndex === 0) ? darkerPurple : palette[colorIndex]
                brush.set("HB", cellColor)
                
                // Generate circles with random sizes and positions
                // Use randomSeed for consistent circles as they scroll
                randomSeed(actualCol * 1000)
                
                // Random number of circles (between 3 and 8)
                let numCircles = floor(random(3, 9))
                
                for (let c = 0; c < numCircles; c++) {
                  // Random size for each circle
                  let circleRadius = random(40, 120)
                  
                  // Random position within the merged cell
                  let circleX = cell_x + random(circleRadius, cellWidth - circleRadius)
                  let circleY = cell_y + random(circleRadius, current_row_height - circleRadius)
                  
                  // Calculate slope adjustment for this position
                  let relativeX = (circleX - cell_x) / cellWidth
                  let slopeY = leftSlope + relativeX * (rightSlope - leftSlope)
           
                  brush.circle(circleX, circleY + slopeY, circleRadius, false)
                }
                
                // Reset random seed
                randomSeed(millis())
              } 
              else if (midlowRange === "medium") {
                // When midlow is 10-35: Draw a square fill
                brush.noField()
                
                // Select color
                let colorIndex = actualCol % palette.length
                let cellColor = (colorIndex === 0) ? darkerPurple : palette[colorIndex]
                brush.fill(cellColor, 50)  // Semi-transparent fill
                brush.bleed(0.05)
                brush.fillTexture(0.3, 0.5)
                
                // Draw square as polygon (use the parallelogram vertices)
                brush.polygon(vertices)
              }
              
              // Don't draw additional polygon outline for circle/square cells
            }

            else {
              // Regular cells with fill or hatch
              if (shouldFill) {
                //brush.fill(a, b, c, d) or brush.fill(color, opacity)
                brush.fill("black", 100)
                brush.bleed(0.1)
                //brush.fillTexture(textureStrength, borderIntensity)
                brush.fillTexture(0.05,0.6)
              } else {
                // Regular hatch for other cells
                // Set Stroke - alternates based on column
                let strokeIndex = actualCol % stroke_brushes.length
                let strokeColorIndex = actualCol % palette.length
                let strokeColor = (i === 1 && strokeColorIndex === 0) ? darkerPurple : palette[strokeColorIndex]
                brush.set(stroke_brushes[strokeIndex], strokeColor)
                //brush.noStroke();
                // Set Hatch
                // You set color and brush with .setHatch(brush_name, color)
        
                // Different hatch settings for each row
                if (i === 0) {
                  // Row 1 - bass reactive: show hatch for columns that entered when bass >= 60
                  if (hasBass) {
                    let hatchBrushIndex = actualCol % hatch_brushes.length
                    let hatchColorIndex = (actualCol + 1) % palette.length
                    brush.setHatch(hatch_brushes[hatchBrushIndex], palette[hatchColorIndex])
                    let spacing = 30 + (actualCol % 2) * 20  // alternates 30, 50
                    brush.hatch(spacing, 90, {rand: 0, continuous: false, gradient: false})
                  } else {
                    brush.noHatch();
                  }
                } else if (i === 1) {
                  // Row 2 hatch settings - always visible
                  let hatchBrushIndex = actualCol % hatch_brushes.length
                  let hatchColorIndex = (actualCol + 1) % palette.length
                  let hatchColor = (hatchColorIndex === 0) ? darkerPurple : palette[hatchColorIndex]
                  brush.setHatch(hatch_brushes[hatchBrushIndex], hatchColor)
                  brush.hatch(50, 90, {rand: 0, continuous: false, gradient: false})
                } else if (i === 2) {
                  // Row 3 - bass reactive: show hatch for columns that entered when bass >= 60
                  if (hasBass) {
                    let hatchBrushIndex = actualCol % hatch_brushes.length
                    let hatchColorIndex = (actualCol + 1) % palette.length
                    brush.setHatch(hatch_brushes[hatchBrushIndex], palette[hatchColorIndex])
                    brush.hatch(30, 90, {rand: 0, continuous: false, gradient: false})
                  } else {
                    brush.noHatch();
                  }
                }
              }
              
              // Draw parallelogram for all non-flowLine cells
              brush.polygon(vertices)
            }
            
            // Draw rotating squares between units in row 2 (only when hasHighMidlow was true)
            if (i === 1 && shouldShowSquare) {
              // Draw square at the right edge of flowLine columns (actualCol % 4 === 0)
              // OR at the right edge of merged units (actualCol % 4 === 1, since the merged unit spans 3 columns)
              if (actualCol % 4 === 0 || actualCol % 4 === 1) {
                push();  // Save transformation state
                
                // Position square at the right edge of the current unit
                let squareX = cell_x + cellWidth;
                let squareCenterY = cell_y + current_row_height / 2;
                
                // Calculate slope adjustment for this X position
                let squareSlope = squareX * tan(-slopeAmount);
                
                // Translate to square position
                translate(squareX, squareCenterY + squareSlope);
                
                // Rotate based on time (frameCount for slow rotation)
                rotate(frameCount * 0.5);  // 0.5 degrees per frame
                
                // Draw square using brush
                brush.noField();
                brush.set("pen", darkerPurple);
                let squareSize = 40;  // Size of the square
                
                // Define square vertices centered at origin
                let squareVertices = [
                  [-squareSize/2, -squareSize/2],
                  [squareSize/2, -squareSize/2],
                  [squareSize/2, squareSize/2],
                  [-squareSize/2, squareSize/2]
                ];
                
                brush.polygon(squareVertices);
                
                pop();  // Restore transformation state
              }
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

// Mouse click to pause/resume music and animation
function mousePressed() {
    if (isPlaying) {
        track.pause();
        noLoop();  // Stop animation
        isPlaying = false;
    } else {
        track.play();
        loop();  // Resume animation
        isPlaying = true;
    }
}