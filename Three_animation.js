import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.133.1/build/three.module.js';

let scene, camera, renderer, mesh;
let mouseX = 0, mouseY = 0;
let isMouseOver = false;
let originalRotation = { x: 0, y: 0 };

init();
animate();

function init() {
    scene = new THREE.Scene();
    
    // Create a perspective camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create a WebGL renderer and append it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load the texture from URL
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://assets.leetcode.com/static_assets/others/LeetCode_75static_cover_picture.png', (texture) => {
        const aspectRatio = texture.image.width / texture.image.height;
        const geometry = new THREE.PlaneGeometry(2, 2 / aspectRatio);
        const material = new THREE.MeshPhongMaterial({ map: texture, transparent: true });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    });

    // Event listeners for mouse movement
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseenter', onDocumentMouseEnter, false);
    document.addEventListener('mouseleave', onDocumentMouseLeave, false);

    // Adjust camera and renderer on window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (isMouseOver) {
        rotateImage();
    }
}

function onDocumentMouseEnter(event) {
    isMouseOver = true;
    originalRotation.x = mesh.rotation.x;
    originalRotation.y = mesh.rotation.y;
}

function onDocumentMouseLeave(event) {
    isMouseOver = false;
    // Reset mesh rotation to original position
    mesh.rotation.x = originalRotation.x;
    mesh.rotation.y = originalRotation.y;
}

function rotateImage() {
    const bounds = mesh.geometry.parameters; // Get mesh dimensions
    const meshPosition = mesh.position.clone(); // Get mesh position

    // Adjust position based on mesh dimensions and position
    const minX = meshPosition.x - bounds.width / 2;
    const maxX = meshPosition.x + bounds.width / 2;
    const minY = meshPosition.y - bounds.height / 2;
    const maxY = meshPosition.y + bounds.height / 2;

    if (mouseX >= minX && mouseX <= maxX && mouseY >= minY && mouseY <= maxY) {
        // Calculate rotation angles based on mouse position within mesh bounds
        const targetRotationX = (mouseY - meshPosition.y) * 0.5;
        const targetRotationY = (mouseX - meshPosition.x) * 0.5;

        // Rotate the mesh directly without smoothing
        mesh.rotation.x = targetRotationX;
        mesh.rotation.y = targetRotationY;
    } else {
        // Reset mesh rotation to original position
        mesh.rotation.x = originalRotation.x;
        mesh.rotation.y = originalRotation.y;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
}
