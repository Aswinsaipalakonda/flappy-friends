const fs = require('fs');
const path = require('path');

// Base64 1x1 pixels
const images = {
  // Red square
  'aryan.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  // Green square
  'mithelesh.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  // Blue square
  'rahul.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPgPwwADERABiA/rLQAAAABJRU5ErkJggg==',
  // Green Pipe
  'pipe.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  // Light blue sky
  'background.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
};

const dir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const [filename, base64] of Object.entries(images)) {
  fs.writeFileSync(path.join(dir, filename), Buffer.from(base64, 'base64'));
}
console.log('Images generated successfully!');
