import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
// Kamera lebih tinggi & mundur agar rumah+karakter kelihatan
camera.position.set(2, 6, 13);
camera.lookAt(2, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Orbit Controls - Agar bisa geser/rotasi/zoom layar di HP (geser dengan satu jari = putar, dua jari = zoom/panning)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.12;
controls.screenSpacePanning = true;
controls.minDistance = 6;
controls.maxDistance = 30;
controls.target.set(2, 1.2, 0);

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

const floorSize = 30;
const floorGeo = new THREE.PlaneGeometry(floorSize, floorSize);
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

const gridHelper = new THREE.GridHelper(floorSize, 16, 0xffffff, 0x888888);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

const floorLight = new THREE.DirectionalLight(0xffffff, 0.4);
floorLight.position.set(0, 10, 0);
scene.add(floorLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

// ==========================
// MODEL MANUSIA
// ==========================
const human = createHumanModel();
human.position.set(0, 1, 0); // kaki pas di atas lantai
scene.add(human);

// ==========================
// RUMAH REALISTIK SEDERHANA
// ==========================
const rumah = new THREE.Group();
const rumahX = 6; // rumah di kanan karakter

// Dinding depan
const tembokDepan = new THREE.Mesh(
  new THREE.BoxGeometry(5, 2.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokDepan.position.set(rumahX, 1.1, 2);
rumah.add(tembokDepan);

// Dinding belakang
const tembokBelakang = new THREE.Mesh(
  new THREE.BoxGeometry(5, 2.2, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokBelakang.position.set(rumahX, 1.1, -2);
rumah.add(tembokBelakang);

// Dinding kiri
const tembokKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 2.2, 4),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKiri.position.set(rumahX - 2.5, 1.1, 0);
rumah.add(tembokKiri);

// Dinding kanan
const tembokKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 2.2, 4),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKanan.position.set(rumahX + 2.5, 1.1, 0);
rumah.add(tembokKanan);

// LANTAI RUMAH
const lantaiRumah = new THREE.Mesh(
  new THREE.BoxGeometry(5.05, 0.09, 4.05),
  new THREE.MeshStandardMaterial({ color: 0xcbb893 })
);
lantaiRumah.position.set(rumahX, 0.05, 0);
rumah.add(lantaiRumah);

// ATAP RUMAH (pelana)
const atapKiri = new THREE.Mesh(
  new THREE.BoxGeometry(5.3, 0.18, 2.1),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKiri.position.set(rumahX, 2.2, -1.05);
atapKiri.rotation.x = Math.PI / 10;
rumah.add(atapKiri);

const atapKanan = new THREE.Mesh(
  new THREE.BoxGeometry(5.3, 0.18, 2.1),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKanan.position.set(rumahX, 2.2, 1.05);
atapKanan.rotation.x = -Math.PI / 10;
rumah.add(atapKanan);

// PINTU
const pintu = new THREE.Mesh(
  new THREE.BoxGeometry(0.9, 1.5, 0.09),
  new THREE.MeshStandardMaterial({ color: 0x885533 })
);
pintu.position.set(rumahX, 0.75, 2.11);
rumah.add(pintu);

// JENDELA KIRI DEPAN
const jendelaKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.6, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKiri.position.set(rumahX - 1.3, 1.5, 2.11);
rumah.add(jendelaKiri);

// JENDELA KANAN DEPAN
const jendelaKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.6, 0.08),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKanan.position.set(rumahX + 1.3, 1.5, 2.11);
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
// JOYSTICK & GERAKAN MANUSIA
// ==========================
const joystick = nipplejs.create({
  zone: document.getElementById('joystick-zone'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue'
});
setupMovementWithJoystick(human, joystick);

// ==========================
// RENDER LOOP & RESPONSIF
// ==========================
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