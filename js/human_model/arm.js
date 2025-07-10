import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { createHand } from './hand.js';

export function createArm(side = "left") {
  const arm = new THREE.Group();

  const upperArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0xffcccc })
  );
  upperArm.position.y = -0.25;

  const lowerArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0xffbbbb })
  );
  lowerArm.position.y = -0.45;

  // Tambahkan tangan di ujung lowerArm
  const hand = createHand();
  hand.position.y = -0.25;
  lowerArm.add(hand);

  // tandai untuk kontrol
  hand.userData.isHand = true;

  const elbow = new THREE.Object3D();
  elbow.position.y = -0.5;
  elbow.add(lowerArm);

  arm.add(upperArm);
  arm.add(elbow);

  if (side === "right") {
    arm.scale.x *= -1;
  }

  return arm;
}