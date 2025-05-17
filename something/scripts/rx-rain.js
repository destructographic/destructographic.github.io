// rx-rain.js
console.log('initializing rx rain effect')

const frequencies = {
  pillSmall: 0.4,
  pillMedium: 0.3,
  pillLarge: 0.1,
  capsule: 0.15,
  inhaler: 0.025,
  ozempicPen: 0.015,
  rxBox: 0.005
}

const iconPaths = {
  pillSmall: 'assets/icons/pill-small.svg',
  pillMedium: 'assets/icons/pill-medium.svg',
  pillLarge: 'assets/icons/pill-large.svg',
  capsule: 'assets/icons/capsule.svg',
  inhaler: 'assets/icons/inhaler.svg',
  ozempicPen: 'assets/icons/ozempic-pen.svg',
  rxBox: 'assets/icons/rx-box.svg'
}

const icons = {}
function loadIcons() {
  const promises = []
  for (let key in iconPaths) {
    promises.push(new Promise((resolve, reject) => {
      const img = new Image()
      img.src = iconPaths[key]
      img.onload = () => {
        icons[key] = img
        resolve()
      }
      img.onerror = reject
    }))
  }
  return Promise.all(promises)
}

// canvas setup
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

let w, h
function resize() {
  w = canvas.width = window.innerWidth
  h = canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

class Particle {
  constructor(img) {
    this.img = img
    this.reset()
  }
  reset() {
    // size between 20% and 50%
    this.scale = 0.2 + Math.random() * 0.3
    this.x = Math.random() * w
    this.y = -this.img.height * this.scale
    this.speed = 1 + Math.random() * 2
    this.rot = Math.random() * Math.PI * 2
    this.rotSpeed = (Math.random() - 0.5) * 0.02
  }
  update() {
    this.y += this.speed
    this.rot += this.rotSpeed
    if (this.y > h + this.img.height * this.scale) this.reset()
  }
  draw() {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rot)
    ctx.drawImage(
      this.img,
      -this.img.width * this.scale / 2,
      -this.img.height * this.scale / 2,
      this.img.width * this.scale,
      this.img.height * this.scale
    )
    ctx.restore()
  }
}

const particles = []
const spawnRate = 0.02     // 2% chance per frame
const maxParticles = 50    // limit total icons

function spawn() {
  let rnd = Math.random()
  let sum = 0
  for (let key in frequencies) {
    sum += frequencies[key]
    if (rnd < sum) {
      particles.push(new Particle(icons[key]))
      break
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h)

  if (particles.length < maxParticles && Math.random() < spawnRate) {
    spawn()
  }

  particles.forEach(p => {
    p.update()
    p.draw()
  })

  requestAnimationFrame(animate)
}

loadIcons()
  .then(() => {
    console.log('rx-rain icons loaded')
    animate()
  })
  .catch(err => console.error('failed to load icons', err))
