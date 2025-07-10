// File: js/hand_control.js
// Simulasi buka/tutup tangan via tombol Q dan E
export function setupHandControl(human) {
  // Cari semua mesh tangan di model
  let hands = [];
  human.traverse(obj => {
    if (obj.userData && obj.userData.isHand) hands.push(obj);
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyQ') {
      hands.forEach(hand => hand.rotation.x = 0.5); // buka tangan
    }
    if (e.code === 'KeyE') {
      hands.forEach(hand => hand.rotation.x = -0.5); // tutup tangan
    }
  });
}
