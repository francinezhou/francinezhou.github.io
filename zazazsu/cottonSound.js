const bassEmphasis = 0.55;

let fft;
let amplitude;
let waveform = [];
let spectrum = [];
let level = 0;
let energy = {};
let centroid = 0;

let maxBand;

const maxRadius = 100;

let smoothedPitch = 0;
let smoothedStrength = 0;

let peaks;
let avgSpacing;
let avgHeight;

let smoothedAmplitude = 0;

const bands = {
  "bass": [20*bassEmphasis, 140*bassEmphasis],
  "lowMid": [140*bassEmphasis, 400],
  "mid": [400, 2600],
  "highMid": [2600, 5200],
  "treble": [5200, 14000]
};

const energyThresholds = {
    bass: 120, // I use 170 for come together
    lowMid: 120, // I use 170 for come together
    mid: 120, // I use 100 for sound of silence
    highMid: 120, // i use 70 throughout for debussy
    treble: 120
}

function initiateCottonSound(){
  fft = new p5.FFT(0.8, 1024);
  amplitude = new p5.Amplitude();
  fft.setInput(track);
  
  amplitude.setInput(track);
}

function approxPitch(){
  /// Original solution maps the spectrum peaks in too small a window and always returned a negative.
  // let targetPitchVal = map(avgSpacing, 6, 17, 0, 100);
  
  // suggested remap that maps from 0 to 17 of countPeaks();
  let targetPitchVal = map(avgSpacing, 0, 17, 0, 100);
  
  smoothedPitch = lerp(smoothedPitch, targetPitchVal, 0.1);  
  
  let returnSmoothedPitch = smoothedPitch;
  return returnSmoothedPitch;
}

function approxPitchStrength(){
  /// Original solution maps the spetrum peaks in relation to the height of the canvas, which could throw off different sizes
  // let targetStrengthVal = map(avgHeight, 0, height / 2, 0, 100);
  
  /// p5.sound: spectrum returns a 0–255; remap fixed here
  let targetStrengthVal = map(avgHeight, 0, 255, 0, 100);
  
  
  smoothedStrength = lerp(smoothedStrength, targetStrengthVal, 0.1);
  
  let returnSmoothedStrength = smoothedStrength;
  return returnSmoothedStrength;
}



function updateAudioData() {
  // Get waveform data (time domain)
  waveform = fft.waveform();
    
  // Get spectrum data (frequency domain)
  spectrum = fft.analyze();
    
  // Get amplitude level
  level = amplitude.getLevel();
    
  // Get spectral centroid
  centroid = fft.getCentroid();
    
  // Get energy in different frequency bands
  for (let band in bands) {
    energy[band] = fft.getEnergy(bands[band][0], bands[band][1]);
  }
  
  peaks = countPeaks(spectrum);
  avgSpacing = getAveragePeakSpacing(peaks);
  avgHeight = getAveragePeakHeight(peaks);
}


function countPeaks(spectrum, threshold = 30, distance = 1) {
  let peaks = [];
  for (let i = distance; i < spectrum.length - distance; i++) {
    let isPeak = true;

    for (let j = 1; j <= distance; j++) {
      if (spectrum[i] < spectrum[i - j] || spectrum[i] < spectrum[i + j]) {
        isPeak = false;
        break;
      }
    }

    if (isPeak && spectrum[i] > threshold) {
      peaks.push({ index: i, value: spectrum[i] });
    }
  }
  
  return peaks;
}


function getAveragePeakSpacing(peaks) {
  if (peaks.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < peaks.length; i++) {
    totalDistance += peaks[i].index - peaks[i - 1].index;
  }

  return totalDistance / (peaks.length - 1);
}

function getAveragePeakHeight(peaks) {
  if (peaks.length === 0) return 0;

  let total = 0;
  for (let i = 0; i < peaks.length; i++) {
    total += peaks[i].value;
  }

  return total / peaks.length;
}

function analyzeEnergy() {
    // translate(width / 2, height / 2);

    
    // Find the band with the max energy
    let maxBand = null;
    let maxEnergy = -Infinity;
    for (let band in energy) {
      if (energy[band] > maxEnergy) {
        maxEnergy = energy[band];
        maxBand = band;
      }
    }

    // let maxMid = null;
    let maxMidBand = null;
    let maxMidEnergy = -Infinity;
      if (energy.mid > energy.highMid) {
        maxMidEnergy = energy.mid;
        maxMidBand = "mid";
      }
      if (energy.highMid > energy.mid) {
        maxMidEnergy = energy.lowMid;
        maxMidBand = "highMid";
      }
  
    // Draw circles for each frequency band
    for (let band in energy) {
      let radius = map(energy[band], 0, 255, 50, 300);
      let alpha = map(energy[band], 0, 255, 50, 200);
      let col;
  
      // Choose color based on band
    //   if (band === "bass") col = color(255, 0, 0, alpha);
    //   else if (band === "lowMid") col = color(255, 127, 0, alpha);
      if (band === "bass") col = color('#850031');
      else if (band === "lowMid") col = color('#b5d927');
      else if (band === "mid") col = color(255, 255, 0, alpha);
      else if (band === "highMid") col = color(0, 255, 0, alpha);
      else if (band === "treble") col = color(0, 0, 255, alpha);

  
    //   stroke(col);
    //   strokeWeight(3);
  
    //   if (band === maxBand) {
    //     radius *= 1.5; // make the largest one slightly bigger
    //     fill(col);
    //   } else {
    //     noFill();
    //   }
  
    //   ellipse(0, 0, radius, radius);


    // console.log(energy.mid - energy.highMid)
    // console.log(energy.treble)

    //   if (energy.mid < energy.highMid){
    //   if (energy.treble > 70){
    //     for (let i = 0; i < 5; i++) {
    //         fill('yellow');
    //         noStroke();
            
    //         // Generate a random angle and radius
    //         let angle = random(TWO_PI);
    //         let r = random(0, 300); // stay within circle radius
          
    //         // Convert polar to Cartesian coordinates
    //         let x = r * cos(angle);
    //         let y = r * sin(angle);
          
    //         ellipse(x, y, min(random(5, 20), random(5, 20)));
    //       }
    //   }

    // console.log(energy);

    }
  
  resetMatrix();

  // console.log(energy.bass, energyThresholds.bass);

  return({
      maxBand: maxBand,
      maxMidEnergy: maxMidBand,
      bassVal: energy.bass > energyThresholds.bass ? energy.bass : 0,
      lowMidVal: energy.lowMid > energyThresholds.lowMid ? energy.lowMid : 0,
      midVal: energy.mid > energyThresholds.mid ? energy.mid : 0,
      highMidVal: energy.highMid > energyThresholds.highMid ? energy.highMid : 0,
      trebleVal: energy.treble > energyThresholds.treble ? energy.treble : 0,
  })
}

function analyzeEnergyBass() {
  return analyzeEnergy().maxBand == "bass";
}

function analyzeEnergyLowMid() {
  return analyzeEnergy().maxBand == "lowMid";
}

function analyzeEnergyMid() {
  return analyzeEnergy().maxMidEnergy == "mid";
}

function analyzeEnergyHighMid() {
  return analyzeEnergy().maxMidEnergy == "highMid";
}

function analyzeEnergyBassVal() {
  return analyzeEnergy().bassVal == 0 ? 0 : map(analyzeEnergy().bassVal, energyThresholds.bass, 255, 0, 100);
}

function analyzeEnergyLowMidVal() {
  return analyzeEnergy().lowMidVal == 0 ? 0 : map(analyzeEnergy().lowMidVal, energyThresholds.lowMid, 255, 0, 100);
}

function analyzeEnergyMidVal() {
  return map(analyzeEnergy().midVal, 0, 255, 0, 100);
}

function analyzeEnergyHighMidVal() {
  return map(analyzeEnergy().highMidVal, 0, 255, 0, 100);
}

function analyzeEnergyTrebleVal() {
  return map(analyzeEnergy().trebleVal, 0, 255, 0, 100);
}


function analyzeAmplitude(){
  let smoothingFactor = 1.0; // 0 - 1
  
  let currentAmplitude = amplitude.getLevel();
  smoothedAmplitude = lerp(smoothedAmplitude, currentAmplitude, smoothingFactor);
  
  return map(smoothedAmplitude, 0, 1, 0, 100);
}


///////////////////////////////////
////////////// RAW VISUALIZERS
///////////////////////////////////

function audioVisual(){
  textAlign(CENTER);
  
  ///// PITCH
  let pitchApprox = approxPitch();
  noFill();
  stroke(125);
  ellipse(200, 200, 100);
  fill(255);
  noStroke();
  ellipse(200, 200, pitchApprox);
  text("Approx Pitch\n" + round(pitchApprox), 200, 275);

  let pitchStrength = approxPitchStrength();
  noFill();
  stroke(125);
  ellipse(350, 200, 100);
  fill(255);
  noStroke();
  ellipse(350, 200, pitchStrength);
  text("Pitch Strength\n" + round(pitchStrength), 350, 275);
  
  ///// DOMINATE
  let dominateBass = analyzeEnergyBass();        
  noFill();
  stroke(75);
  ellipse(600, 200, 20);
  fill(255);
  noStroke();
  if(dominateBass){
    ellipse(600, 200, 20);    
  }
  text("Dominate\nBass", 600, 275);
  
  let dominateLowMid = analyzeEnergyLowMid();        
  noFill();
  stroke(75);
  ellipse(700, 200, 20);
  fill(255);
  noStroke();
  if(dominateLowMid){
    ellipse(700, 200, 20);    
  }
  text("Dominate\nLowMid", 700, 275);
  
  let dominateMid = analyzeEnergyMid();      
  noFill();
  stroke(75);
  ellipse(800, 200, 20);
  fill(255);
  noStroke();
  if(dominateMid){
    ellipse(800, 200, 20);    
  }
  text("Dominate\nMid", 800, 275);
  
  let dominateHighMid = analyzeEnergyHighMid();     
  noFill();
  stroke(75);
  ellipse(900, 200, 20);
  fill(255);
  noStroke();
  if(dominateHighMid){
    ellipse(900, 200, 20);    
  }
  text("Dominate\nHighMid", 900, 275);
  
  
  // VALUE
  let bassVal = analyzeEnergyBassVal();   
  noFill();
  stroke(125);
  ellipse(200, 400, 100);
  fill(255);
  noStroke();
  ellipse(200, 400, bassVal);
  text("Bass Value\n" + round(bassVal), 200, 475);
  
  let lowMidVal = analyzeEnergyLowMidVal();   
  noFill();
  stroke(125);
  ellipse(350, 400, 100);
  fill(255);
  noStroke();
  ellipse(350, 400, lowMidVal);
  text("Low Mid Value\n" + round(lowMidVal), 350, 475);
  
  let midVal = analyzeEnergyMidVal();   
  noFill();
  stroke(125);
  ellipse(500, 400, 100);
  fill(255);
  noStroke();
  ellipse(500, 400, midVal);
  text("Mid Value\n" + round(midVal), 500, 475);
  
  let highMidVal = analyzeEnergyHighMidVal();   
  noFill();
  stroke(125);
  ellipse(650, 400, 100);
  fill(255);
  noStroke();
  ellipse(650, 400, highMidVal);
  text("High Mid Value\n" + round(highMidVal), 650, 475);
  
  let trebleVal = analyzeEnergyTrebleVal();   
  noFill();
  stroke(125);
  ellipse(800, 400, 100);
  fill(255);
  noStroke();
  ellipse(800, 400, trebleVal);
  text("Treble Value\n" + round(trebleVal), 800, 475);
  
  
  // AMPLITUDE
  let ampVal = analyzeAmplitude();   
  noFill();
  stroke(125);
  ellipse(200, 600, 100);
  fill(255);
  noStroke();
  ellipse(200, 600, ampVal);
  text("Amplitude Value\n" + round(ampVal), 200, 675);
}

function audioData(){
  noStroke();
  fill(255);

  let pitchApprox = approxPitch();                      // RETURNS 0 - 100
  text("Approx Pitch: " + round(pitchApprox), 100, 100);
      
  let pitchStrength = approxPitchStrength();            // RETURNS 0 – 100
  text("Pitch Strength: " + round(pitchStrength), 100, 125);

  // let dominateBand = analyzeEnergy().maxBand;                // RETURNS "bass" or "lowMid"
  let dominateBass = analyzeEnergyBass();               // RETURNS boolean
  text("Predominantly Bass: " + dominateBass, 100, 175);

  let dominateLowMid = analyzeEnergyLowMid();           // RETURNS boolean
  text("Predominantly LowMid: " + dominateLowMid, 100, 200);
  
  // let dominateMidEnergy = analyzeEnergy().maxMidEnergy;      // RETURNS "mid" or "highMid"
  let dominateMid = analyzeEnergyMid();                // RETURNS boolean
  text("Predominantly Mid: " + dominateMid, 100, 225);
  
  let dominateHighMid = analyzeEnergyHighMid();        // RETURNS boolean
  text("Predominantly HighMid: " + dominateHighMid, 100, 250);  
  
  let bassVal = analyzeEnergyBassVal();               // RETURNS 0 – 100
  text("Bass Value: " + round(bassVal), 100, 300);  
  
  let lowMidVal = analyzeEnergyLowMidVal();           // RETURNS 0 – 100
  text("LowMid Value: " + round(lowMidVal), 100, 325);  

  let midVal = analyzeEnergyMidVal();                 // RETURNS 0 – 100
  text("Mid Value: " + round(midVal), 100, 350);  

  let highMidVal = analyzeEnergyHighMidVal();         // RETURNS 0 – 100
  text("High Mid Value: " + round(highMidVal), 100, 375);  
  
  let trebleVal = analyzeEnergyTrebleVal();           // RETURNS 0 – 100
  text("Treble Value: " + round(trebleVal), 100, 400);  

  let ampVal = analyzeAmplitude();                   // RETURNS 0 – 100
  text("Amplitude Value: " + round(ampVal), 100, 450);  
}

