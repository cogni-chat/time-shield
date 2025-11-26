// Simple script to create placeholder PNG icons
// Since we can't easily convert SVG to PNG without dependencies,
// we'll create a simple HTML file that can be used to generate icons

const fs = require('fs');

const sizes = [16, 48, 128];

const htmlTemplate = (size) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    canvas { display: block; }
  </style>
</head>
<body>
  <canvas id="canvas" width="${size}" height="${size}"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, ${size}, ${size});
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#06b6d4');
    
    // Draw background circle
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(${size/2}, ${size/2}, ${size/2 - 2}, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw clock face
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(${size/2}, ${size/2}, ${size/2 - 8}, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw center dot
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.arc(${size/2}, ${size/2}, ${size/20}, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw hour hand
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = ${size/32};
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(${size/2}, ${size/2});
    ctx.lineTo(${size/2}, ${size/2 - size/4});
    ctx.stroke();
    
    // Draw minute hand
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = ${size/40};
    ctx.beginPath();
    ctx.moveTo(${size/2}, ${size/2});
    ctx.lineTo(${size/2 + size/4}, ${size/2});
    ctx.stroke();
    
    // Draw clock markers
    const markerRadius = ${size/50};
    ctx.fillStyle = '#0ea5e9';
    [[${size/2}, ${size/2 - size/3}], [${size/2}, ${size/2 + size/3}], 
     [${size/2 - size/3}, ${size/2}], [${size/2 + size/3}, ${size/2}]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'icon${size}.png';
      a.click();
    });
  </script>
</body>
</html>
`;

console.log('To generate PNG icons:');
console.log('1. Open the HTML files below in a browser');
console.log('2. They will automatically download the PNG files');
console.log('3. Move the downloaded files to the icons/ directory\n');

sizes.forEach(size => {
  const filename = `generate-icon${size}.html`;
  fs.writeFileSync(filename, htmlTemplate(size));
  console.log(`Created: ${filename}`);
});

console.log('\nAlternatively, you can use an online SVG to PNG converter with icons/icon.svg');
