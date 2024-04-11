console.log("hi");
console.log(THREE);

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/MTLLoader.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,10); // Move the camera back along the z-axis
camera.lookAt(0, 0, 0); // Make the camera look at the origin (or the position of the loaded object)

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee, 1); // Set a light gray background color
document.body.appendChild(renderer.domElement);

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.update(); // Update controls after setting initial camera position

// OBJLoader setup
const loader = new OBJLoader();

// MTLLoader setup
const mtlLoader = new MTLLoader();
mtlLoader.load(
    'assets/model.mtl',
    function(materials) {
        console.log("Materials:", materials); // Log loaded materials
        materials.preload();
        loader.setMaterials(materials);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function(error) {
        console.error("Failed to load MTL file:", error);
    }
);

// Load the OBJ file
loader.load(
    'assets/beads1-Mesh891795.obj',
    function(object) {
        console.log("Object:", object); // Log loaded object
        object.scale.set(0.5, 0.5, 0.5); // Adjust the scale of the object if needed
        object.position.set(0, 0, 0); // Adjust the position of the loaded object if needed

        // Check if the loaded object has materials
        if (object.material) {
            console.log("Object materials:", object.material); // Log materials applied to the object
        } else {
            console.warn("No materials found for the object."); // Warn if no materials are found
        }

        scene.add(object);

        // Ensure that the camera is looking at the loaded object
        camera.lookAt(scene.position);
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function(error) {
        console.error("Failed to load OBJ file:", error);
    }
);

// Resize handler
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

// Stats setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White light coming from the direction of the camera
directionalLight.position.set(1, 1, 1); // Set the position of the light
scene.add(directionalLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

// Render function
function render() {
    renderer.render(scene, camera);
    controls.update(); // Update the controls in the animation loop
}

// Start animation loop
animate();
