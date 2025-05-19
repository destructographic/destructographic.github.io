// script.js
const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');

const parts = ['head', 'eyes', 'mouth', 'hair'];
const assetsPath = 'assets/';

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

async function generateCharacter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const part of parts) {
    const variant = getRandomInt(3); // assume 3 variants per part
    const img = await loadImage(`${assetsPath}${part}-${variant}.png`);
    ctx.drawImage(img, 0, 0);
  }
}

document.getElementById('rngButton').addEventListener('click', generateCharacter);

generateCharacter();
