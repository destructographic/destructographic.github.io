import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Directions from the drug-storage-temp Blender render, converted from
// Blender Z-up (x, y, z) to glTF/Three.js Y-up (x, z, -y).
const TO_SUN = new THREE.Vector3(1, 0.75, 0.2).normalize();                // render_shadows_blender.py TO_SUN
const TO_CAMERA = new THREE.Vector3(0.43856, 0.52372, 0.73033).normalize(); // camera.py -VIEW_DIR

export function createScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1d22);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);

  // Lighting: soft sky/ground fill plus one shadow-casting sun.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x50545c, 1.4));

  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);

  // Controls: one-finger rotate, two-finger pinch zoom + pan; mouse left/right/wheel.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // stay above the floor

  // Adds the imported model unscaled (glTF units = inches) and fits the
  // camera, clipping planes, controls and sun shadow to its bounds.
  function addModel(model) {
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    scene.add(model);

    const box = new THREE.Box3().setFromObject(model);
    const { center, radius } = box.getBoundingSphere(new THREE.Sphere());

    // Distance at which the bounding sphere fits the narrower field of view.
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(vFov, hFov) / 2);

    camera.position.copy(center).addScaledVector(TO_CAMERA, distance);
    camera.near = radius * 0.005;
    camera.far = distance * 3 + radius * 2;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    controls.minDistance = radius * 0.05;
    controls.maxDistance = distance * 3;
    controls.update();

    sun.position.copy(center).addScaledVector(TO_SUN, radius * 2);
    sun.target.position.copy(center);
    const s = sun.shadow.camera;
    s.left = s.bottom = -radius;
    s.right = s.top = radius;
    s.near = radius;
    s.far = radius * 3;
    s.updateProjectionMatrix();
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = radius * 0.002;
  }

  return { scene, camera, controls, addModel };
}
