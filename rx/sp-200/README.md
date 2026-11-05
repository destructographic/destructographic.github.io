# rx/sp-200

Three.js viewer for the ScriptPro SP-200 on its own. Same architecture as
`rx/drug-storage`: plain ES modules, a version-pinned Three.js 0.180 import map
and no build step.

| File | Role |
|---|---|
| `index.html` | Import map, error/loading overlays, module bootstrap |
| `main.js` | Renderer, resize, context loss, GLB load, render loop, `?debug` |
| `scene.js` | Lights, orbit controls, viewer-only floor, camera/zoom/shadow fit |
| `renderer.js`, `diagnostics.js`, `style.css` | Copied from `rx/drug-storage` (overlay shows size instead of textures; no rotate hint) |
| `assets/sp-200.glb` | Generated; do not edit |

## Model

`assets/sp-200.glb` is exported from the FreeCAD model, which is authoritative:

```sh
cd ~/projects/sp-200
freecadcmd export_glb.py && freecadcmd validate_glb.py
cp generated/sp-200.glb ~/projects/destructographic.github.io/rx/sp-200/assets/
```

- Units: 1 glTF unit = 1 inch. Y-up. Machine-local origin at the rear-left
  floor corner of the drug cabinet, +X along the machine, +Z toward the front.
  There is no pharmacy offset. Bounds: 0…124.25 × 0…78 × 0…24 in.
- Root node `ScriptPro_SP200` (no transform) with meshes `SP_DrugCabinet`,
  `SP_CenterTower` and `SP_ComputerCabinet`. Each has its own placeholder
  material and `userData` from the FreeCAD properties (`sp_category`,
  `sp_scenesolid`, `sp_heightstatus`, `sp_size_in`, …).
- To place it in the pharmacy scene, translate the root by
  `asset.extras.pharmacy_offset_in` = (131.406, 0, 96.5). It then lands
  exactly on the `Vis3D_SP_*` meshes of `drug-storage-area.glb`.

## View

- The camera fits the bounding sphere to the narrower field of view, so the
  whole machine shows in portrait and landscape. The initial view is front-right and
  slightly above, aimed at the model centre.
- Zoom: min 0.9 × radius (about 67 in, outside the solids when orbiting the
  centre); max 3 × the fit distance. Polar angle stays above the floor. Pan
  is limited so the orbit target stays inside the model bounds.
- The floor disc is viewer-only (not in the GLB) and catches the sun shadow.
- `?debug` exposes `window.viewer` (`scene`, `camera`, `controls`, `renderer`,
  `model`, `fit`, `ready`) and draws 24 in axes at the machine origin.
