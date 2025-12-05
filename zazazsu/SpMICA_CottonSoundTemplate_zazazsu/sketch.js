let track;

function preload() {
  // upload your track to the "resources" folder and link here
  track = loadSound('我所有的夜有所梦里.mp3');
  // track = loadSound('resources/dust.mp3');
}

function setup() {
  createCanvas(1080, 1080);
  
  /////////// REQUIRED
  initiateCottonSound();
  
  // plays the uploaded track
  track.play();
}

function draw() {
  ////////// REQUIRED; leave at beginning of draw Loop
  updateAudioData();
  
  background('black');
    
  // Sample visualizers
  // audioData();
  audioVisual();  
}


////// AVAILABLE FUNCTIONS FROM CottonSound
// approxPitch();                      // RETURNS 0 - 100    
// approxPitchStrength();              // RETURNS 0 – 100

// analyzeEnergy().maxBand;            // RETURNS "bass" or "lowMid"
// analyzeEnergyBass();                // RETURNS true/false
// analyzeEnergyLowMid();              // RETURNS true/false
  
// analyzeEnergy().maxMidEnergy;       // RETURNS "mid" or "highMid"
// analyzeEnergyMid();                 // RETURNS true/false
// analyzeEnergyHighMid();             // RETURNS true/false
  
// analyzeEnergyBassVal();             // RETURNS 0 – 100
// analyzeEnergyLowMidVal();           // RETURNS 0 – 100
// analyzeEnergyMidVal();              // RETURNS 0 – 100
// analyzeEnergyHighMidVal();          // RETURNS 0 – 100
// analyzeEnergyTrebleVal();           // RETURNS 0 – 100

// analyzeAmplitude();                 // RETURNS 0 – 100