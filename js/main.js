import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// Basic Three.js scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// MODEL MANUSIA DARI BUILDER
const human = createHumanModel();
scene.add(human);

// LANTAI (tempat pijakan karakter)
const floorGeo = new THREE.PlaneGeometry(40, 40);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// RUMAH SEDERHANA
const rumah = new THREE.Group();

// Tembok rumah (kotak)
const dinding = new THREE.Mesh(
  new THREE.BoxGeometry(3, 2, 3),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
dinding.position.set(7, 1, 0); // letakkan rumah di samping karakter
rumah.add(dinding);

// Atap rumah (kerucut)
const atap = new THREE.Mesh(
  new THREE.ConeGeometry(2.1, 1.2, 4),
  new THREE.MeshStandardMaterial({ color: 0x884422 })
);
atap.position.set(7, 2.6, 0);
atap.rotation.y = Math.PI / 4; // biar sudut atap sejajar dinding
rumah.add(atap);

scene.add(rumah);

// LAMPU
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// JOYSTICK
const joystick = nipplejs.create({
  zone: document.getElementById('joystick-zone'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue'
});

// GERAK KARAKTER PAKAI JOYSTICK
setupMovementWithJoystick(human, joystick);

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// RESPONSIVE RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});