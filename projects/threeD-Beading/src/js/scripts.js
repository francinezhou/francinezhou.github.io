import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.130.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.121.0/examples/jsm/loaders/RGBELoader.js";

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
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );

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
    .load('142_hdrmaps_com_free_4K.hdr', function (texture) {
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

exportButton.addEventListener('click', function () {
    requestAnimationFrame(captureAndDownload);
});

window.addEventListener('click', function(e) {
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    const sphereMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(sphereHue, sphereSaturation / 100, sphereLightness / 100),
        metalness: 0,
        roughness: sphereRoughness,
        transmission: sphereTransmission,
        thickness: sphereThickness,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);

    shapesHistory.push(sphereMesh);

    undoneShapes = [];
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
document.addEventListener('DOMContentLoaded', function () {
    function prevent3DInteraction(event) {
        if (!renderer.domElement.contains(event.target)) {
            console.log("Clicked outside of the 3D renderer");
            event.stopPropagation();
        }
    }
    document.body.addEventListener('click', prevent3DInteraction);

    // Additional setup code here if needed
});
