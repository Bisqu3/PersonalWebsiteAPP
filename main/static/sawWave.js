const canvas = document.getElementById('sawWaveCanvas');
canvas.width = window.innerWidth;
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height / 2;
const waveHeight = height;
const waveWidth = 75;
const blackBackgroundWidth = 2*waveWidth;
const deadzone = 100;
let offsetX = 0;
let mousePosX = 0;

canvas.height = height;

canvas.addEventListener('mousemove', (event) => {
  mousePosX = event.clientX;
});

function drawBackground() {
  ctx.fillStyle = '#3b3834';
  ctx.fillRect(0, 0, blackBackgroundWidth, height);
  ctx.fillStyle = '#d4c7b4';
  ctx.fillRect(blackBackgroundWidth, 0, width - blackBackgroundWidth, height);
}

function drawWaveOnBlack(color, alpha) {
  ctx.beginPath();
  for (let x = -waveWidth + offsetX; x < blackBackgroundWidth*2; x += waveWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + waveWidth, waveHeight);
    ctx.lineTo(x + waveWidth, 0);
  }
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  ctx.stroke();
}

function drawWaveOnWhite(color, alpha) {
  ctx.beginPath();
  for (let x = -waveWidth + offsetX + blackBackgroundWidth; x < width; x += waveWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + waveWidth, waveHeight);
    ctx.lineTo(x + waveWidth, 0);
  }
  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  ctx.stroke();
}

function updateOffset() {
  const center = width / 2;
  const leftBound = center - deadzone / 2;
  const rightBound = center + deadzone / 2;

  if (mousePosX < leftBound) {
    offsetX += (leftBound - mousePosX) / 99.9-1;
  } else if (mousePosX > rightBound) {
    offsetX -= (mousePosX - rightBound) / 99.9-1;
  }

  if (offsetX <= -waveWidth) {
    offsetX += waveWidth;
  } else if (offsetX >= waveWidth) {
    offsetX -= waveWidth;
  }
}

function drawSawWave() {
  ctx.clearRect(0, 0, width, height);
  drawBackground();

  drawWaveOnBlack({ r: 212, g: 199, b: 180 }, 0.5); // Light beige from the CSS
  drawWaveOnWhite({ r: 59, g: 56, b: 52 }, 1); // Dark brown from the CSS

  ctx.save();
  ctx.beginPath();
  ctx.rect((width - waveWidth) / 2, (height - waveHeight) / 2, waveWidth, waveHeight);
  ctx.clip();

  drawWaveOnBlack({ r: 255, g: 255, b: 255 }, 1);
  ctx.restore();

  updateOffset();
}

function animate() {
  drawSawWave();
  requestAnimationFrame(animate);
}

animate();
