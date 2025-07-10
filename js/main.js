import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.150.1/examples/jsm/controls/OrbitControls.js';
import { setupMovementWithJoystick } from './movement.js';
import { createHumanModel } from './human_model/human_model.js';

// SCENE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

// KAMERA
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(9, 7, 17);
camera.lookAt(4, 1.2, 0);

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

// LANTAI REALISTIK
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

const floorLight = new THREE.DirectionalLight(0xffffff, 0.4);
floorLight.position.set(0, 10, 0);
scene.add(floorLight);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

// MODEL MANUSIA - posisi pas di atas lantai
const human = createHumanModel();
human.position.set(0, 1, 0); // y=1, pas di atas lantai
scene.add(human);

// RUMAH REALISTIK SEDERHANA (proporsi besar, pintu/jendela proporsional, dekat karakter)
const rumah = new THREE.Group();

const rumahPosX = 7; // Tidak terlalu jauh dari karakter, di sisi kanan

// Dinding depan
const tembokDepan = new THREE.Mesh(
  new THREE.BoxGeometry(7, 4, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokDepan.position.set(rumahPosX, 2, 3.5);
rumah.add(tembokDepan);

// Dinding belakang
const tembokBelakang = new THREE.Mesh(
  new THREE.BoxGeometry(7, 4, 0.2),
  new THREE.MeshStandardMaterial({ color: 0xf6e3b4 })
);
tembokBelakang.position.set(rumahPosX, 2, -3.5);
rumah.add(tembokBelakang);

// Dinding kiri
const tembokKiri = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 4, 7),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKiri.position.set(rumahPosX - 3.5, 2, 0);
rumah.add(tembokKiri);

// Dinding kanan
const tembokKanan = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 4, 7),
  new THREE.MeshStandardMaterial({ color: 0xe4cb9c })
);
tembokKanan.position.set(rumahPosX + 3.5, 2, 0);
rumah.add(tembokKanan);

// LANTAI RUMAH
const lantaiRumah = new THREE.Mesh(
  new THREE.BoxGeometry(7.1, 0.15, 7.1),
  new THREE.MeshStandardMaterial({ color: 0xcbb893 })
);
lantaiRumah.position.set(rumahPosX, 0.075, 0);
rumah.add(lantaiRumah);

// ATAP RUMAH (pelana, lebih besar)
const atapKiri = new THREE.Mesh(
  new THREE.BoxGeometry(7.5, 0.25, 3.7),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKiri.position.set(rumahPosX, 4.3, -1.85);
atapKiri.rotation.x = Math.PI / 8;
rumah.add(atapKiri);

const atapKanan = new THREE.Mesh(
  new THREE.BoxGeometry(7.5, 0.25, 3.7),
  new THREE.MeshStandardMaterial({ color: 0xa55722 })
);
atapKanan.position.set(rumahPosX, 4.3, 1.85);
atapKanan.rotation.x = -Math.PI / 8;
rumah.add(atapKanan);

// PINTU (proporsional, ~1/3 tinggi rumah)
const pintu = new THREE.Mesh(
  new THREE.BoxGeometry(1.3, 2.5, 0.13),
  new THREE.MeshStandardMaterial({ color: 0x885533 })
);
pintu.position.set(rumahPosX, 1.25, 3.61);
rumah.add(pintu);

// JENDELA KIRI DEPAN (proporsional, tinggi sekitar 1m)
const jendelaKiri = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.11),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKiri.position.set(rumahPosX - 2, 2.4, 3.61);
rumah.add(jendelaKiri);

// JENDELA KANAN DEPAN
const jendelaKanan = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 0.11),
  new THREE.MeshStandardMaterial({ color: 0x99ccff, transparent: true, opacity: 0.7 })
);
jendelaKanan.position.set(rumahPosX + 2, 2.4, 3.61);
rumah.add(jendelaKanan);

scene.add(rumah);

// LAMPU UTAMA
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
