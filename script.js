const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let letters = Array(256).join(1).split('');
const fontSize = 14;

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';

  letters.forEach((y, index) => {
    const text = String.fromCharCode(0x30A0 + Math.random() * 96);
    const x = index * fontSize;
    ctx.fillText(text, x, y);
    letters[index] = y > canvas.height + Math.random() * 1e4 ? 0 : y + fontSize;
  });
}

setInterval(drawMatrix, 50);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
