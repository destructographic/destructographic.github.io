const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const style = document.createElement('style');
style.innerHTML = `
  body {
    margin: 0;
    background: #cc0000;
    overflow: hidden;
  }
  canvas {
    display: block;
  }
`;
document.head.appendChild(style);

let width, height;
function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.alpha = 0.1 + Math.random() * 0.3;
    this.scale = 0.1 + Math.random() * 0.3;
    this.velocity = Math.random();
  }

  update() {
    this.y -= this.velocity;
    if (this.y < -10) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.scale * 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(255, 0, 0, ${this.alpha})`;
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
  requestAnimationFrame(animate);
}
animate();
