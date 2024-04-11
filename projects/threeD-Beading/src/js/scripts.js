import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 6, 6);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(0, 50, 0);

const helper = new THREE.AxesHelper(20);
scene.add(helper);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

const shapesHistory = []; // Array to store the history of shapes

window.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
});

let sphereColor = 0xFFEA00;
let sphereOpacity = 1;

const colorSlider = document.getElementById('colorSlider');
const colorValue = document.getElementById('colorValue');
const opacitySlider = document.getElementById('opacitySlider');
const opacityValue = document.getElementById('opacityValue');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

colorSlider.addEventListener('input', function() {
    const hue = parseInt(colorSlider.value);
    sphereColor = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    colorValue.textContent = `Hue: ${hue}`;
});

opacitySlider.addEventListener('input', function() {
    const opacity = parseFloat(opacitySlider.value);
    sphereOpacity = opacity;
    opacityValue.textContent = `Opacity: ${opacity}`;
});

undoButton.addEventListener('click', function() {
    if (shapesHistory.length > 0) {
        const lastShape = shapesHistory.pop();
        scene.remove(lastShape);
    }
});

redoButton.addEventListener('click', function() {
    // Your redo functionality here, if needed
    // This will depend on how you implement your undo functionality
});

window.addEventListener('click', function(e) {
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: sphereColor,
        opacity: sphereOpacity,
        transparent: true,
        metalness: 0,
        roughness: 0
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);

    // Add the created shape to the history
    shapesHistory.push(sphereMesh);
});

function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();





// open/close sign
document.addEventListener('DOMContentLoaded', function () {
    const signBig = document.querySelector('.signBig');
    const closeButton = document.querySelector('.closeButton');
    const informationSymbol = document.querySelector('header span');

    // Function to toggle sign visibility and 3D scene interaction
    function toggleSign() {
        if (signBig.style.display === 'none' || signBig.style.display === '') {
            signBig.style.display = 'block';
            // Enable event listener for 3D scene interaction
            document.body.addEventListener('click', prevent3DInteraction);
        } else {
            signBig.style.display = 'none';
            // Disable event listener for 3D scene interaction
            document.body.removeEventListener('click', prevent3DInteraction);
        }
    }

    // Close or open sign when close button or information symbol is clicked
    closeButton.addEventListener('click', toggleSign);
    informationSymbol.addEventListener('click', toggleSign);

    // Function to prevent interaction with 3D scene when signBig is open
    function prevent3DInteraction(event) {
        if (signBig.contains(event.target)) {
            // Click occurred inside signBig, prevent interaction with 3D scene
            event.stopPropagation();
        }
    }

    // Update the slider values with h4 font style
    const colorValue = document.getElementById('colorValue');
    const opacityValue = document.getElementById('opacityValue');
    const sizeValue = document.getElementById('sizeValue');
    const colorSlider = document.getElementById('colorSlider');
    const opacitySlider = document.getElementById('opacitySlider');
    const sizeSlider = document.getElementById('sizeSlider');

    colorSlider.addEventListener('input', function () {
        const hue = parseInt(colorSlider.value);
        colorValue.innerHTML = `<h4>Hue: ${hue}</h4>`;
    });

    opacitySlider.addEventListener('input', function () {
        const opacity = parseFloat(opacitySlider.value);
        opacityValue.innerHTML = `<h4>Opacity: ${opacity}</h4>`;
    });


});
