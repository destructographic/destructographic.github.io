import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// glTF frame (sp-200 export_glb.py): inches, Y-up, origin = rear-left-floor
// corner of the drug cabinet, +X along the machine, +Z toward the machine front.
const TO_CAMERA = new THREE.Vector3(0.42, 0.32, 0.85).normalize(); // front-right, slightly above
const TO_SUN = new THREE.Vector3(0.6, 1.0, 0.8).normalize();       // high, front-right
const FLOOR_COLOR = 0x2a2d34;                                      // viewer-only floor, not in the GLB

export function createScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1b1d22);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);

  // Lighting (as rx/drug-storage): soft sky/ground fill plus one shadow-casting sun.
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

  // Pan limit: the orbit target stays inside the model bounds, so the
  // machine cannot be panned out of view.
  const targetBounds = new THREE.Box3();
  controls.addEventListener('change', () => {
    if (!targetBounds.isEmpty()) targetBounds.clampPoint(controls.target, controls.target);
  });

  // Adds the model unscaled (glTF units = inches) at its own origin and fits
  // the camera, clipping planes, zoom limits and sun shadow to its bounds.
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
    targetBounds.copy(box);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(radius * 6, 64).rotateX(-Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: FLOOR_COLOR, roughness: 1 })
    );
    floor.name = 'viewer_floor';
    floor.receiveShadow = true;
    scene.add(floor);

    // Distance at which the bounding sphere fits the narrower field of view
    // (portrait phones use the horizontal FOV, so the whole machine fits).
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distance = radius / Math.sin(Math.min(vFov, hFov) / 2);

    camera.position.copy(center).addScaledVector(TO_CAMERA, distance * 0.9);
    camera.near = radius * 0.01;
    camera.far = distance * 4 + radius * 2;
    camera.updateProjectionMatrix();

    controls.target.copy(center);
    // Zoom limits: close enough for cabinet detail, but outside the solids
    // when orbiting around the centre (half-length 62 in < 0.9 * radius);
    // far enough to see the whole machine small on screen.
    controls.minDistance = radius * 0.9;
    controls.maxDistance = distance * 3;
    controls.update();

    sun.position.copy(center).addScaledVector(TO_SUN, radius * 2);
    sun.target.position.copy(center);
    const s = sun.shadow.camera;
    s.left = s.bottom = -radius * 1.5;
    s.right = s.top = radius * 1.5;
    s.near = radius * 0.5;
    s.far = radius * 4;
    s.updateProjectionMatrix();
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = radius * 0.002;

    return { box, center, radius, distance };
  }

  return { scene, camera, controls, addModel };
}
