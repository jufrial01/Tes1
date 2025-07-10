import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

export function createTorso() {
  const geometry = new THREE.CylinderGeometry(0.25, 0.3, 1.2, 12);
  const material = new THREE.MeshStandardMaterial({ color: 0xffaaaa });
  const torso = new THREE.Mesh(geometry, material);
  torso.position.y = 0.9;
  return torso;
}
