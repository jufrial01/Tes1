import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// MODEL MANUSIA
const human = createHumanModel();
scene.add(human);

// ==========================
// LANTAI REALISTIK
// ==========================
const textureLoader = new THREE.TextureLoader();

const floorTexture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(8, 8);

const floorNormalMap = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg');
floorNormalMap.wrapS = floorNormalMap.wrapT = THREE.RepeatWrapping;
floorNormalMap.repeat.set(8, 8);

const floorMat = new THREE.MeshStandardMaterial({
  map: floorTexture,
  normalMap: floorNormalMap,
  roughness: 0.33,
  metalness: 0.14,
  color: 0xffffff,
});

const floorSize = 40;
const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid garis ubin
const gridHelper = new THREE.GridHelper(floorSize, 16, 0xffffff, 0xcccccc);
gridHelper.position.y = 0.02;
scene.add(gridHelper);

// Extra pencahayaan ke bawah agar lantai lebih hidup
const floorLight = new THREE.DirectionalLight(0xffffff, 0.4);
floorLight.position.set(0, 10, 0);
scene.add(floorLight);

// Ambient light lembut
scene.add(new THREE.AmbientLight(0xffffff, 0.35));

// ==========================
// RUMAH SEDERHANA
// ==========================
const rumah = new THREE.Group();

const dinding = new THREE.Mesh(
  new THREE.BoxGeometry(3, 2, 3),
  new THREE.MeshStandardMaterial({ color: 0xd2b48c })
);
dinding.position.set(7, 1, 0);
rumah.add(dinding);

const atap = new THREE.Mesh(
  new THREE.ConeGeometry(2.1, 1.2, 4),
  new THREE.MeshStandardMaterial({ color: 0x884422 })
);
atap.position.set(7, 2.6, 0);
atap.rotation.y = Math.PI / 4;
rumah.add(atap);

scene.add(rumah);

// ==========================
// LAMPU UTAMA
// ==========================
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ==========================
// JOYSTICK
// ==========================
const joystick = nipplejs.create({
  zone: document.getElementById('joystick-zone'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue'
});
setupMovementWithJoystick(human, joystick);

// ==========================
// RENDER LOOP
// ==========================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});