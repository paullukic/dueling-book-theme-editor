const sharp = require('sharp');
const fs = require('fs');

const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  sharp('logo.png')
    .resize(size, size)
    .png()
    .toFile(`icon${size}.png`)
    .then(() => console.log(`icon${size}.png created`))
    .catch(err => console.error(err));
});