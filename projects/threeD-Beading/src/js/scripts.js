import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.130.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/loaders/RGBELoader.js";
import { IcosahedronGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.130.1/build/three.module.js'; // Import IcosahedronGeometry
import * as Tone from "https://cdn.jsdelivr.net/npm/tone@14.8.26/build/Tone.js";

let renderer,
    scene,
    camera,
    orbit,
    bkgTextureLoader;

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xFEFEFE);

scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xa0a0a0, 10, 500);

camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(2, 1, 10);
orbit.update();

bkgTextureLoader = new RGBELoader()
    .setPath('textures/')
    .load('lonely_road_afternoon_puresky_4k.hdr', function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.backgroundBlurriness = 1;

        scene.environment = texture;
    });

const helper = new THREE.AxesHelper(20);
scene.add(helper);

// Change the color attributes of the AxesHelper object to grey
const colors = helper.geometry.attributes.color;
colors.setXYZ(0, 0.9, 0.9, 0.9); // x-axis red to grey
colors.setXYZ(1, 0.9, 0.9, 0.9);
colors.setXYZ(2, 0.9, 0.9, 0.9); // y-axis green to grey
colors.setXYZ(3, 0.9, 0.9, 0.9);
colors.setXYZ(4, 0.9, 0.9, 0.9); // z-axis blue to grey

const axesCheckbox = document.getElementById('axesCheckbox');
axesCheckbox.addEventListener('change', function() {
    helper.visible = axesCheckbox.checked;
});

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const shapesHistory = [];
let undoneShapes = [];

window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

let sphereHue = 0xFFEA00;
let sphereTransmission = 1;
let sphereThickness = 3;
let sphereRoughness = 0.2;
let sphereSaturation = 100;
let sphereLightness = 75;

const hueSlider = document.getElementById('hueSlider');
const hueValue = document.getElementById('hueValue');
const saturationSlider = document.getElementById('saturationSlider');
const saturationValue = document.getElementById('saturationValue');
const lightnessSlider = document.getElementById('lightnessSlider');
const lightnessValue = document.getElementById('lightnessValue');

const transmissionSlider = document.getElementById('transmissionSlider');
const transmissionValue = document.getElementById('transmissionValue');
const thicknessSlider = document.getElementById('thicknessSlider');
const thicknessValue = document.getElementById('thicknessValue');
const roughnessSlider = document.getElementById('roughnessSlider');
const roughnessValue = document.getElementById('roughnessValue');

hueSlider.addEventListener('input', function() {
    const hue = parseInt(hueSlider.value);
    sphereHue = hue / 360; // Convert hue to the range [0, 1]
    hueValue.textContent = `${hue}`;
});

saturationSlider.addEventListener('input', function() {
    const saturation = parseInt(saturationSlider.value);
    sphereSaturation = saturation;
    saturationValue.textContent = `${saturation}`;
});

lightnessSlider.addEventListener('input', function() {
    const lightness = parseInt(lightnessSlider.value);
    sphereLightness = lightness;
    lightnessValue.textContent = `${lightness}`;
});


transmissionSlider.addEventListener('input', function() {
    const transmission = parseFloat(transmissionSlider.value);
    sphereTransmission = transmission;
    transmissionValue.textContent = `${transmission}`;
});

thicknessSlider.addEventListener('input', function() {
    const thickness = parseFloat(thicknessSlider.value);
    sphereThickness = thickness;
    thicknessValue.textContent = `${thickness}`;
});

roughnessSlider.addEventListener('input', function() {
    const roughness = parseFloat(roughnessSlider.value);
    sphereRoughness = roughness;
    roughnessValue.textContent = `${roughness}`;
});


const leftWrapper = document.querySelector('.leftWrapper');
const sphereCard = document.getElementById('sphereCard');
const icosahedronCard = document.getElementById('icosahedronCard');
const cubeCard = document.getElementById('cubeCard'); // Add this line to get the cube card element

let selectedShape = 'sphere'; // Default selected shape is 'sphere'

sphereCard.addEventListener('click', function() {
    selectedShape = 'sphere';
    sphereCard.classList.add('selected');
    icosahedronCard.classList.remove('selected');
    cubeCard.classList.remove('selected'); // Ensure cube card is not selected
});

icosahedronCard.addEventListener('click', function() {
    selectedShape = 'icosahedron';
    icosahedronCard.classList.add('selected');
    sphereCard.classList.remove('selected');
    cubeCard.classList.remove('selected'); // Ensure cube card is not selected
});

cubeCard.addEventListener('click', function() {
    selectedShape = 'cube'; // Set selected shape to cube
    cubeCard.classList.add('selected'); // Add selected class to cube card
    icosahedronCard.classList.remove('selected');
    sphereCard.classList.remove('selected');
});

window.addEventListener('click', function(e) {
    const hue = parseInt(hueSlider.value);
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; // Define the note names
    const octave = Math.floor(hue / 40) + 1; // Calculate the octave based on hue

    // Calculate the index of the note name
    const noteIndex = Math.floor((hue % 40) / 10);
    const noteName = noteNames[noteIndex];

    let note;
    if (noteIndex % 2 === 0) {
        note = `${noteName}${octave}`; // Combine the note name and octave
    } else {
        note = `${noteName}${octave}#`; // Combine the note name, sharp sign, and octave
    }

    if (note && isSoundOn) {
        const synth = new Tone.Synth().toDestination();
        // Set maximum volume
        synth.volume.value = -20; // Adjust as needed (-12 dB is a reasonable starting point)
        synth.triggerAttackRelease(note, "8n");
    }

    let shapeGeometry;
    if (selectedShape === 'sphere') {
        shapeGeometry = new THREE.SphereGeometry(0.125, 30, 30);
    } else if (selectedShape === 'icosahedron') {
        shapeGeometry = new IcosahedronGeometry(0.125); // Use IcosahedronGeometry for icosahedron shape
    } else if (selectedShape === 'cube') {
        shapeGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25); // Use BoxGeometry for cube shape
    }

    const shapeMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(sphereHue, sphereSaturation / 100, sphereLightness / 100),
        metalness: 0,
        roughness: sphereRoughness,
        transmission: sphereTransmission,
        thickness: sphereThickness,
    });
    const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
    scene.add(shapeMesh);
    shapeMesh.position.copy(intersectionPoint);

    // Rotate the cube 45 degrees
    if (selectedShape === 'cube') {
        shapeMesh.rotateZ(Math.PI / 4);
    }

    shapesHistory.push(shapeMesh);

    undoneShapes = [];
});

const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const exportButton = document.getElementById('exportButton');

undoButton.addEventListener('click', function() {
    const numUndoSteps = 1;
    for (let i = 0; i < numUndoSteps; i++) {
        if (shapesHistory.length > 0) {
            const lastShape = shapesHistory.pop();
            scene.remove(lastShape);
            undoneShapes.push(lastShape);
        }
    }
});

redoButton.addEventListener('click', function() {
    if (undoneShapes.length > 0) {
        const lastShape = undoneShapes.pop();
        scene.add(lastShape);
        shapesHistory.push(lastShape);
    }
});

exportButton.addEventListener('click', function() {
    requestAnimationFrame(captureAndDownload);
});

function captureAndDownload() {
    try {
        const strMime = "image/jpeg";
        const imgData = renderer.domElement.toDataURL(strMime);

        saveFile(imgData.replace(strMime, "image/octet-stream"), "beading_project.jpg");

    } catch (e) {
        console.log(e);
        return;
    }
}

function saveFile(strData, filename) {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link);
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link);
    } else {
        location.replace(uri);
    }
}

const signBig = document.querySelector('.signBig');
const closeButton = document.querySelector('.closeButton');
const infoButton = document.querySelector('header span');

function closeSign() {
    signBig.style.display = 'none';
}

function toggleSign() {
    if (signBig.style.display === 'none' || signBig.style.display === '') {
        signBig.style.display = 'block';
    } else {
        signBig.style.display = 'none';
    }
}

closeButton.addEventListener('click', closeSign);

infoButton.addEventListener('click', toggleSign);
document.addEventListener('DOMContentLoaded', function() {
    function prevent3DInteraction(event) {
        if (!renderer.domElement.contains(event.target) && isSoundOn) {
            console.log("Clicked outside of the 3D renderer");
            event.stopPropagation();
        }
    }
    document.body.addEventListener('click', prevent3DInteraction);

    // Additional setup code here if needed
});

const toggleSoundButton = document.getElementById('toggleSoundButton');
let isSoundOn = true;

toggleSoundButton.addEventListener('click', function() {
    isSoundOn = !isSoundOn; // Toggle sound state
    if (isSoundOn) {
        toggleSoundButton.textContent = 'Quiet';
    } else {
        toggleSoundButton.textContent = 'Sound';
    }
});

// Light setup
const light = new THREE.DirectionalLight(0xfff0dd, 1);
light.position.set(0, 5, 10);
scene.add(light);

// Animation loop
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
