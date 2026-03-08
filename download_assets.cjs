const fs = require('fs');
const https = require('https');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/samuelcust/flappy-bird-assets/master/sprites/';
const files = [
  'background-day.png',
  'base.png',
  'pipe-green.png',
  'message.png',
  'gameover.png',
  '0.png', '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png'
];

const dir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

files.forEach(file => {
  const fileUrl = baseUrl + file;
  const filePath = path.join(dir, file);
  https.get(fileUrl, (res) => {
    const fileStream = fs.createWriteStream(filePath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Downloaded ' + file);
    });
  }).on('error', (err) => {
    console.error('Error downloading ' + file + ':', err);
  });
});
