const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFile = '../logo-white.png';
const resDir = './android/app/src/main/res';

// DP Multipliers: mdpi=1, hdpi=1.5, xhdpi=2, xxhdpi=3, xxxhdpi=4
const androidScales = {
  'mipmap-mdpi': 1,
  'mipmap-hdpi': 1.5,
  'mipmap-xhdpi': 2,
  'mipmap-xxhdpi': 3,
  'mipmap-xxxhdpi': 4
};

console.log("Generating Android App Icons directly into Native mapping...");

Object.keys(androidScales).forEach(group => {
  const scale = androidScales[group];
  const legacySize = Math.round(48 * scale);
  const adaptiveSize = Math.round(108 * scale);
  
  const dirPath = path.join(resDir, group);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  sharp(inputFile)
    .resize(legacySize, legacySize)
    .toFile(path.join(dirPath, 'ic_launcher.png'))
    .then(() => console.log(`Created ${group}/ic_launcher.png (${legacySize}px)`))
    .catch(err => console.error(err));

  sharp(inputFile)
    .resize(legacySize, legacySize)
    .toFile(path.join(dirPath, 'ic_launcher_round.png'))
    .then(() => console.log(`Created ${group}/ic_launcher_round.png (${legacySize}px)`))
    .catch(err => console.error(err));
    
  sharp(inputFile)
    .resize(adaptiveSize, adaptiveSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile(path.join(dirPath, 'ic_launcher_foreground.png'))
    .then(() => console.log(`Created ${group}/ic_launcher_foreground.png (${adaptiveSize}px) Adaptive Layer`))
    .catch(err => console.error(err));
});
