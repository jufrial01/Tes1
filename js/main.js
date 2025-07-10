import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

// KAMERA
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5.5, 15);
camera.lookAt(4, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// ==========================
// LANTAI REALISTIK
// ==========================
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
floor.position.y = 0; // lantai di y=0
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(floorSize, 20, 0xffffff, 0x888888);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

const floorLight = new THREE.DirectionalLight(0xffffff, 0.4);
floorLight.position.set(0, 10, 0);
scene.add(floorLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

// ==========================
// MODEL MANUSIA - posisi pas di atas lantai
// ==========================
const human = createHumanModel();
human.position.set(0, 1, 0); // y=1, pas di atas lantai
scene.add(human);

// ==========================
// RUMAH REALISTIK SEDERHANA
// ==========================
const rumah = new THREE.Group();

const rumahPosX = 7; // Dekat karakter, bisa digeser jika perlu

// Dinding depan
const tembokDepan = new THREE.Mesh(
  new THREE.BoxGeometry(6, 3, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokDepan.position.set(rumahPosX, 1.5, 3);
rumah.add(tembokDepan);

// Dinding belakang
const tembokBelakang = new THREE.Mesh(
  new THREE.BoxGeometry(6, 3, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokBelakang.position.set(rumahPosX, 1.5, -3);
rumah.add(tembokBelakang);

// Dinding kiri
const tembokKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 3, 6),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKiri.position.set(rumahPosX - 3, 1.5, 0);
rumah.add(tembokKiri);

// Dinding kanan
const tembokKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 3, 6),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKanan.position.set(rumahPosX + 3, 1.5, 0);
rumah.add(tembokKanan);

// LANTAI RUMAH
const lantaiRumah = new THREE.Mesh(
  new THREE.BoxGeometry(6.05, 0.1, 6.05),
  new THREE.MeshStandardMaterial({ color: 0xcbb893 })
);
lantaiRumah.position.set(rumahPosX, 0.05, 0);
rumah.add(lantaiRumah);

// ATAP RUMAH (pelana)
const atapKiri = new THREE.Mesh(
  new THREE.BoxGeometry(6.3, 0.2, 3.1),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKiri.position.set(rumahPosX, 3.1, -1.55);
atapKiri.rotation.x = Math.PI / 8;
rumah.add(atapKiri);

const atapKanan = new THREE.Mesh(
  new THREE.BoxGeometry(6.3, 0.2, 3.1),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKanan.position.set(rumahPosX, 3.1, 1.55);
atapKanan.rotation.x = -Math.PI / 8;
rumah.add(atapKanan);

// PINTU (proporsional)
const pintu = new THREE.Mesh(
  new THREE.BoxGeometry(1.1, 2, 0.09),
  new THREE.MeshStandardMaterial({ color: 0x885533 })
);
pintu.position.set(rumahPosX, 1, 3.11);
rumah.add(pintu);

// JENDELA KIRI DEPAN
const jendelaKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.8, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKiri.position.set(rumahPosX - 1.7, 2, 3.11);
rumah.add(jendelaKiri);

// JENDELA KANAN DEPAN
const jendelaKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.8, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKanan.position.set(rumahPosX + 1.7, 2, 3.11);
rumah.add(jendelaKanan);

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