import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
import { createTorso } from './torso.js';
import { createArm } from './arm.js';
import { createLeg } from './leg.js';
import { createHead } from './head.js';

export function createHumanModel() {
  const model = new THREE.Group();

  // Torso
  const torso = createTorso();
  model.add(torso);

  // Head
  const head = createHead();
  head.position.y = 0.9 + 0.25 + 0.05; // di atas torso
  torso.add(head);

  // Arms
  const leftArm = createArm('left');
  leftArm.position.set(-0.35, 0.5, 0);
  torso.add(leftArm);

  const rightArm = createArm('right');
  rightArm.position.set(0.35, 0.5, 0);
  torso.add(rightArm);

  // Legs
  const leftLeg = createLeg('left');
  leftLeg.position.set(-0.15, -0.9, 0);
  torso.add(leftLeg);

  const rightLeg = createLeg('right');
  rightLeg.position.set(0.15, -0.9, 0);
  torso.add(rightLeg);

  return model;
}
