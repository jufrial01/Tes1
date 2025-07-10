import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

let controlledObject;
let moveVector = new THREE.Vector3();

export function setupMovementWithJoystick(obj, joystick) {
  controlledObject = obj;

  joystick.on('move', function(evt, data) {
    const angle = data.angle ? data.angle.radian : 0;
    const force = data.force || 0;
    moveVector.x = Math.sin(angle) * force * 0.15; // Atur multiplier untuk kecepatan
    moveVector.z = -Math.cos(angle) * force * 0.15;
  });

  joystick.on('end', function() {
    moveVector.set(0,0,0);
  });

  animateMovement();
}

function update() {
  if (controlledObject) {
    controlledObject.position.add(moveVector);
  }
}

function animateMovement() {
  requestAnimationFrame(animateMovement);
  update();
}