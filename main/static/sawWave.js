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

function getRandomNoise() {
  return Math.random() * 16 - 10; // Generates a random number
}

function drawWaveWithNoise(color, alpha, startX) {
  ctx.beginPath();
  
  for (let x = startX; x <= startX + waveWidth; x += 1) {
    let y = ((x - startX) / waveWidth) * waveHeight;

    y += getRandomNoise();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 1, y - waveHeight + getRandomNoise());
  }

  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
  ctx.lineWidth = 2; // Increase the line width for better visibility
  ctx.stroke();
  ctx.lineWidth = 1; 
}

function drawWaveOnBlack(color, alpha) {
  for (let x = -waveWidth + offsetX; x < blackBackgroundWidth * 2; x += waveWidth) {
    drawWaveWithNoise(color, alpha, x);
  }
}

function drawWaveOnWhite(color, alpha) {
  for (let x = -waveWidth + offsetX + blackBackgroundWidth; x < width; x += waveWidth) {
    drawWaveWithNoise(color, alpha, x);
  }
}

function updateOffset() {
  const center = width / 2;
  const leftBound = center - deadzone / 2;
  const rightBound = center + deadzone / 2;

  if (mousePosX < leftBound) {
    offsetX += (leftBound - mousePosX) / 500;
  } else if (mousePosX > rightBound) {
    offsetX -= (mousePosX - rightBound) / 500;
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

  drawWaveOnBlack({ r: 212, g: 199, b: 180 }, 0.5); // Light beige
  drawWaveOnWhite({ r: 59, g: 56, b: 52 }, 1); // Dark brown

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, blackBackgroundWidth, height);
  ctx.clip();

  drawWaveOnBlack({ r: 212, g: 199, b: 180 }, 1); // Light Beige
  ctx.restore();

  updateOffset();
}


function animate() {
  drawSawWave();
  requestAnimationFrame(animate);
}

animate();
