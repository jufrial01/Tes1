import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

export function createLeg(side = "left") {
  const leg = new THREE.Group();

  const upperLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12),
    new THREE.MeshStandardMaterial({ color: 0xcc8888 })
  );
  upperLeg.position.y = -0.3;

  const lowerLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.5, 12),
    new THREE.MeshStandardMaterial({ color: 0xcc8888 })
  );
  lowerLeg.position.y = -0.55;

  const knee = new THREE.Object3D();
  knee.position.y = -0.6;
  knee.add(lowerLeg);

  leg.add(upperLeg);
  leg.add(knee);

  if (side === "right") {
    leg.scale.x *= -1;
  }

  return leg;
}