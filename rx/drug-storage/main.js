import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createRenderer } from './renderer.js';
import { createScene } from './scene.js';
import { createDiagnostics } from './diagnostics.js';

const MAX_PIXEL_RATIO = 2;
const MODEL_URL = './assets/drug-storage-area.glb';

const container = document.getElementById('app');
const loading = document.getElementById('loading');

let renderer;
try {
  renderer = createRenderer(container, MAX_PIXEL_RATIO);
} catch (err) {
  console.error(err);
  window.showError(
    'WebGL is not available',
    'Your browser or device could not start WebGL. Try enabling hardware acceleration or using a different browser. (' + err.message + ')'
  );
}

if (renderer) start(renderer);

function start(renderer) {
  const { scene, camera, controls, addModel } = createScene(renderer);
  const diagnostics = createDiagnostics(document.getElementById('diagnostics'), renderer);

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // ResizeObserver catches window resizes, orientation changes and mobile
  // browser chrome showing/hiding; the listeners are a fallback.
  new ResizeObserver(resize).observe(container);
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 100));
  resize();

  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    diagnostics.setStatus('context lost');
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    diagnostics.setStatus(null);
  });

  new GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      addModel(gltf.scene);
      diagnostics.setModel(gltf.scene);
      loading.remove();
    },
    (event) => {
      const kb = Math.round(event.loaded / 1024);
      // total is 0 when the server omits Content-Length; a gzipped
      // response can also report loaded > total, hence the clamp.
      loading.textContent = event.total
        ? `Loading model… ${Math.min(100, Math.round((event.loaded / event.total) * 100))}%`
        : `Loading model… ${kb} KB`;
    },
    (err) => {
      console.error(err);
      window.showError(
        'Failed to load the 3D model',
        'Could not download or read ' + MODEL_URL + '. Check your connection, then reload. (' + (err.message || err) + ')'
      );
    }
  );

  renderer.setAnimationLoop((time) => {
    controls.update();
    renderer.render(scene, camera);
    diagnostics.tick(time);
  });
}
