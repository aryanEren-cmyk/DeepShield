const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#080b0f';
  ctx.fillRect(0, 0, size, size);

  // Shield Shape (Simple Triangle/Badge)
  ctx.fillStyle = '#00f5a0';
  ctx.beginPath();
  const centerX = size / 2;
  const topY = size * 0.2;
  const bottomY = size * 0.8;
  const leftX = size * 0.25;
  const rightX = size * 0.75;
  
  ctx.moveTo(centerX, bottomY);
  ctx.bezierCurveTo(centerX, bottomY, leftX, size * 0.6, leftX, topY);
  ctx.lineTo(rightX, topY);
  ctx.bezierCurveTo(rightX, size * 0.6, centerX, bottomY, centerX, bottomY);
  ctx.fill();

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath}`);
}

generateIcon(192);
generateIcon(512);
