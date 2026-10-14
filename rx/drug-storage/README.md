# rx/drug-storage

Three.js viewer for the pharmacy drug-storage area. Plain ES modules with a
version-pinned Three.js import map; no build step.

## Model

`assets/drug-storage-area.glb` is exported from the Blender scene in
`~/projects/drug-storage-temp` (the scene `render_shadows_blender.py` builds
from `generated/scene.obj`, minus its camera and sun):

```sh
cd ~/projects/drug-storage-temp
blender -b --python-exit-code 1 -P export_glb.py -- \
  ~/projects/destructographic.github.io/rx/drug-storage/assets/drug-storage-area.glb
```

- Units: 1 glTF unit = 1 inch (not metres). The viewer does not rescale; the
  camera, clipping planes, controls and shadow are fitted to the model bounds.
- Axes: Y-up (the exporter converts from Blender Z-up).
- 67 flat, named `Vis3D_*` mesh nodes, 3 untextured materials, 1026 triangles,
  about 83 KB.
- Initial view and sun direction match `camera.py` and `TO_SUN` in
  drug-storage-temp, so the first frame resembles `render/latest.png`
  (perspective here, orthographic there).
