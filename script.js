import * as THREE from 'three';

const scene = new THREE.Scene();
// Removed fog temporarily to ensure the grid is 100% visible
// scene.fog = new THREE.FogExp2(0x2a2a2a, 0.002);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// Bring camera closer
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x2a2a2a, 1);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(350, 250, 130, 100);

// Made color brighter and opacity higher to ensure it cuts through
const material = new THREE.MeshBasicMaterial({ 
    color: 0xaaaaaa, 
    wireframe: true,
    transparent: true,
    opacity: 0.5
});

const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -0.1;
plane.position.z = -10; 
scene.add(plane);

const clock = new THREE.Clock();

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
    });
});

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime() * 0.3;
    const positionAttribute = geometry.attributes.position;
    
    // Spacetime fabric waves
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        
        // Deep organic waves forming peaks and valleys
        const z = Math.sin(x * 0.04 + time) * 6 + 
                  Math.cos(y * 0.04 + time * 0.8) * 6 +
                  Math.sin((x - y) * 0.02 + time * 0.5) * 4;
                  
        positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;

    // Very subtle camera tracking
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -10);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
