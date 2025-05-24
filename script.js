// Get container
const container = document.getElementById('container');

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create scene
const scene = new THREE.Scene();

// Create camera
const camera = new THREE.Camera();
scene.add(camera);

// Create geometry and material
const geometry = new THREE.PlaneBufferGeometry(2, 2);

// Get shaders from HTML
const vertexShader = document.getElementById('vertexShader').textContent;
const fragmentShader = document.getElementById('fragmentShader').textContent;

// Create uniforms
const uniforms = {
  u_time: { type: 'f', value: 0.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) }
};

// Create material
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
});

// Create mesh and add to scene
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Handle mouse movement
document.addEventListener('mousemove', (event) => {
  uniforms.u_mouse.value.x = event.clientX;
  uniforms.u_mouse.value.y = window.innerHeight - event.clientY;
});

// Handle window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = window.innerWidth;
  uniforms.u_resolution.value.y = window.innerHeight;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}

animate();
