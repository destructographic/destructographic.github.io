import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1d22);
  scene.fog = new THREE.Fog(0x1b1d22, 25, 60);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(6, 5, 8);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(5, 10, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0005;
  const s = sun.shadow.camera;
  s.left = -8; s.right = 8; s.top = 8; s.bottom = -8; s.near = 1; s.far = 30;
  scene.add(sun);

  // Floor + grid
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0x3a3f47, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const grid = new THREE.GridHelper(40, 40, 0x8a93a3, 0x555c68);
  grid.position.y = 0.001; // avoid z-fighting with the floor
  scene.add(grid);

  // Cube
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x4f9dde, roughness: 0.4, metalness: 0.1 })
  );
  cube.position.y = 1.5;
  cube.castShadow = true;
  scene.add(cube);

  // Controls: one-finger rotate, two-finger pinch zoom + pan; mouse left/right/wheel.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 40;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // stay above the floor
  controls.update();

  let last = 0;
  function update(time) {
    const dt = last ? (time - last) / 1000 : 0;
    last = time;
    cube.rotation.y += dt * 0.5;
    cube.rotation.x += dt * 0.2;
  }

  return { scene, camera, controls, update };
}
