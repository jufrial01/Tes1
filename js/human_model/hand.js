import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

export function createHand() {
  const group = new THREE.Group();

  // Telapak tangan
  const palm = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xfafafa })
  );
  group.add(palm);

  // Jari-jari sederhana (4 jari)
  for (let i = 0; i < 4; i++) {
    const finger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.13, 8),
      new THREE.MeshStandardMaterial({ color: 0xeaeaea })
    );
    finger.position.set(Math.sin(i * Math.PI / 3) * 0.08, -0.04, Math.cos(i * Math.PI / 3) * 0.08);
    finger.rotation.x = Math.PI / 2.2;
    group.add(finger);
  }
  // Ibu jari
  const thumb = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.11, 8),
    new THREE.MeshStandardMaterial({ color: 0xeaeaea })
  );
  thumb.position.set(-0.08, -0.04, 0);
  thumb.rotation.z = Math.PI / 4;
  group.add(thumb);

  return group;
}