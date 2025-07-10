export function setupJoystick(human) {
  // Buat joystick sederhana (HTML)
  const joy = document.createElement('div');
  joy.style.position = 'fixed';
  joy.style.left = '30px';
  joy.style.bottom = '30px';
  joy.style.width = '100px';
  joy.style.height = '100px';
  joy.style.background = 'rgba(200,200,200,0.4)';
  joy.style.borderRadius = '50%';
  joy.style.zIndex = 10;
  document.body.appendChild(joy);

  let dragging = false;
  let origin = { x: 0, y: 0 };

  let moveDir = { x: 0, y: 0 };

  joy.addEventListener('pointerdown', e => {
    dragging = true;
    origin.x = e.clientX;
    origin.y = e.clientY;
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    moveDir.x = e.clientX - origin.x;
    moveDir.y = e.clientY - origin.y;
    // Batasi maksimal radius
    const len = Math.sqrt(moveDir.x*moveDir.x + moveDir.y*moveDir.y);
    if (len > 40) {
      moveDir.x = moveDir.x / len * 40;
      moveDir.y = moveDir.y / len * 40;
    }
  });
  window.addEventListener('pointerup', e => {
    dragging = false;
    moveDir.x = 0;
    moveDir.y = 0;
  });

  // Update movement dari joystick
  function update() {
    // Mapping: x=left/right, y=up/down (di joystick y positif ke bawah)
    let speed = 0.04;
    if (Math.abs(moveDir.x) > 5 || Math.abs(moveDir.y) > 5) {
      // Gerak relatif rotasi manusia
      let dir = new THREE.Vector3(
        moveDir.x / 40,
        0,
        -moveDir.y / 40
      );
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), human.rotation.y);
      human.position.addScaledVector(dir, speed);
    }
    requestAnimationFrame(update);
  }
  update();
}
