import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.130.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/DRACOLoader.js";

// const loader = new GLTFLoader();
let renderer, 
    scene, 
    camera, 
    orbit, 
    ambientLight, 
    directionalLight, 
    helper,
    bkgTextureLoader

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xFEFEFE);

scene = new THREE.Scene();
// scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );

camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 6, 6);
orbit.update();

bkgTextureLoader = new RGBELoader()
    .setPath('textures/')
    .load('spruit_sunrise_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.backgroundBlurriness = 1;

        scene.environment = texture;
    })



ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

helper = new THREE.AxesHelper(20);
scene.add(helper);

// Change the color attributes of the AxesHelper object to grey
const colors = helper.geometry.attributes.color;
colors.setXYZ(0, 0.9, 0.9, 0.9); // x-axis red to grey
colors.setXYZ(1, 0.9, 0.9, 0.9); 
colors.setXYZ(2, 0.9, 0.9, 0.9); // y-axis green to grey
colors.setXYZ(3, 0.9, 0.9, 0.9); 
colors.setXYZ(4, 0.9, 0.9, 0.9); // z-axis blue to grey

// Update the buffer attributes to reflect the changes
colors.needsUpdate = true;

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const shapesHistory = []; // Array to store the history of shapes
let undoneShapes = []; // Array to store the undone shapes

window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

let sphereColor = 0xFFEA00;
let sphereTransmission = 0.8;
let sphereThickness = 3;
let sphereRoughness = 0.2;

const colorSlider = document.getElementById('colorSlider');
const colorValue = document.getElementById('colorValue');
const transmissionSlider = document.getElementById('transmissionSlider');
const transmissionValue = document.getElementById('transmissionValue');
const thicknessSlider = document.getElementById('thicknessSlider');
const thicknessValue = document.getElementById('thicknessValue');
const roughnessSlider = document.getElementById('roughnessSlider');
const roughnessValue = document.getElementById('roughnessValue');

const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const exportButton = document.getElementById('exportButton');

colorSlider.addEventListener('input', function() {
    const hue = parseInt(colorSlider.value);
    sphereColor = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    colorValue.textContent = `Hue: ${hue}`;
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

undoButton.addEventListener('click', function() {
    const numUndoSteps = 1; // Adjust the number of steps to undo as needed
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

exportButton.addEventListener('click', function () {
    // Wait for the next frame to ensure rendering is complete
    requestAnimationFrame(captureAndDownload);
});

window.addEventListener('click', function(e) {
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    console.log(sphereTransmission)
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: sphereColor,
        metalness: 0,
        roughness: sphereRoughness,
        transmission: sphereTransmission,
        thickness: sphereThickness,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);

    shapesHistory.push(sphereMesh);

    undoneShapes = []; // Clear undoneShapes array when a new shape is added
});

const light = new THREE.DirectionalLight(0xfff0dd, 1);
  light.position.set(0, 5, 10);
  scene.add(light);
  
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

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

document.addEventListener('DOMContentLoaded', function () {
    function prevent3DInteraction(event) {
        if (!renderer.domElement.contains(event.target)) {
            console.log("Clicked outside of the 3D renderer");
            event.stopPropagation();
        }
    }
    document.body.addEventListener('click', prevent3DInteraction);


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

    const colorSlider = document.getElementById('colorSlider');
    const colorValue = document.getElementById('colorValue');
    const transmissionSlider = document.getElementById('transmissionSlider');
    const transmissionValue = document.getElementById('transmissionValue');
    const thicknessSlider = document.getElementById('thicknessSlider');
    const thicknessValue = document.getElementById('thicknessValue');
    const roughnessSlider = document.getElementById('roughnessSlider');
    const roughnessValue = document.getElementById('roughnessValue');

    colorSlider.addEventListener('input', function () {
        const hue = parseInt(colorSlider.value);
        colorValue.innerHTML = `<h4>Hue: ${hue}</h4>`;
    });

    transmissionSlider.addEventListener('input', function () {
        const transmission = parseFloat(transmissionSlider.value);
        transmissionValue.innerHTML = `${transmission}`;
    });
   
    thicknessSlider.addEventListener('input', function () {
        const thickness = parseFloat(thicknessSlider.value);
        thicknessValue.innerHTML = `<h4>Thickness: ${thickness}</h4>`;
    });
    
    roughnessSlider.addEventListener('input', function () {
        const roughness = parseFloat(roughnessSlider.value);
        roughnessValue.innerHTML = `<h4>Roughness: ${roughness}</h4>`;
    });
});