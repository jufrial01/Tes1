import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

// KAMERA
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 7, 17);
camera.lookAt(4, 1.2, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.screenSpacePanning = true;
controls.minDistance = 7;
controls.maxDistance = 30;
controls.target.set(4, 1.2, 0);

// LANTAI
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10);

const floorNormalMap = textureLoader.load('https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg');
floorNormalMap.wrapS = floorNormalMap.wrapT = THREE.RepeatWrapping;
floorNormalMap.repeat.set(10, 10);

const floorMat = new THREE.MeshStandardMaterial({
  map: floorTexture,
  normalMap: floorNormalMap,
  roughness: 0.33,
  metalness: 0.14,
  color: 0xffffff,
});

const floorSize = 50;
const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(floorSize, 20, 0xffffff, 0x888888);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

// Pencahayaan dasar
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(7, 13, 7);
scene.add(dirLight);

// MODEL KARAKTER (tetap berdiri di atas lantai)
const human = createHumanModel();
human.position.set(0, 1, 0);
scene.add(human);

// RUMAH PROPORSIONAL, DEKAT KARAKTER
const rumah = new THREE.Group();
const rumahPosX = 8; // Tidak terlalu jauh dari karakter

// Dinding depan
const tembokDepan = new THREE.Mesh(
  new THREE.BoxGeometry(8, 4.5, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokDepan.position.set(rumahPosX, 2.25, 3.9);
rumah.add(tembokDepan);

// Dinding belakang
const tembokBelakang = new THREE.Mesh(
  new THREE.BoxGeometry(8, 4.5, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokBelakang.position.set(rumahPosX, 2.25, -3.9);
rumah.add(tembokBelakang);

// Dinding kiri
const tembokKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 4.5, 8),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKiri.position.set(rumahPosX - 4, 2.25, 0);
rumah.add(tembokKiri);

// Dinding kanan
const tembokKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 4.5, 8),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKanan.position.set(rumahPosX + 4, 2.25, 0);
rumah.add(tembokKanan);

// LANTAI RUMAH
const lantaiRumah = new THREE.Mesh(
  new THREE.BoxGeometry(8.1, 0.15, 8.1),
  new THREE.MeshStandardMaterial({ color: 0xcbb893 })
);
lantaiRumah.position.set(rumahPosX, 0.075, 0);
rumah.add(lantaiRumah);

// ATAP RUMAH (pelana, proporsional)
const atapKiri = new THREE.Mesh(
  new THREE.BoxGeometry(8.6, 0.25, 4.3),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKiri.position.set(rumahPosX, 4.8, -2.15);
atapKiri.rotation.x = Math.PI / 8;
rumah.add(atapKiri);

const atapKanan = new THREE.Mesh(
  new THREE.BoxGeometry(8.6, 0.25, 4.3),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKanan.position.set(rumahPosX, 4.8, 2.15);
atapKanan.rotation.x = -Math.PI / 8;
rumah.add(atapKanan);

// PINTU (proporsional ~1/3 tinggi rumah)
const pintu = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 2.7, 0.13),
  new THREE.MeshStandardMaterial({ color: 0x885533 })
);
pintu.position.set(rumahPosX, 1.35, 4.01);
rumah.add(pintu);

// JENDELA DEPAN KIRI
const jendelaKiri = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 0.11),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKiri.position.set(rumahPosX - 2.5, 2.7, 4.01);
rumah.add(jendelaKiri);

// JENDELA DEPAN KANAN
const jendelaKanan = new THREE.Mesh(
  new THREE.BoxGeometry(1.2, 1.2, 0.11),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKanan.position.set(rumahPosX + 2.5, 2.7, 4.01);
rumah.add(jendelaKanan);

scene.add(rumah);

// JOYSTICK (tetap terhubung)
const joystick = nipplejs.create({
  zone: document.getElementById('joystick-zone'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue'
});
setupMovementWithJoystick(human, joystick);

// RENDER LOOP
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});