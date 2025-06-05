let scene, camera, renderer, model;
let targetRotation = 0;
let currentRotation = 0;
const rotationLimit = Math.PI / 9; // 20 degrees
let rotationDirection = 1;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth * 0.25 / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.25, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const container = document.getElementById('model-viewer');
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Load the model
    const loader = new THREE.FBXLoader();
    loader.load(
        'assets/3d/untitled.fbx',
        function (fbx) {
            model = fbx;
            
            // Scale the model if needed
            model.scale.setScalar(0.01); // FBX models often need scaling
            
            // Rotate model 45 degrees to the left
            model.rotation.y = Math.PI / 4;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            scene.add(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened:', error);
        }
    );
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth * 0.25 / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.25, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        // Calculate the new rotation
        if (Math.abs(currentRotation) >= rotationLimit) {
            rotationDirection *= -1;
        }
        
        currentRotation += 0.01 * rotationDirection;
        model.rotation.y = Math.PI / 4 + currentRotation;
    }
    
    renderer.render(scene, camera);
}

// Initialize and start animation
init();
animate(); 