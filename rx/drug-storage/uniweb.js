import * as THREE from 'three';

// Uniweb hook-channel normal maps from drug-storage-temp/uniweb_textures.py.
// The GLB has no UVs, so planar UVs are computed here from world positions;
// positions, normals and dimensions are left untouched.
const TEXTURE_DIR = './assets/textures/uniweb/';
const NORMAL_SCALE = 1.0;       // extra strength on top of the generator's normal_strength
const WIDTH_TOLERANCE = 0.05;   // inches, matching a face to a texture width

// Painted steel: neutral, non-metallic, no colour map, so material.color
// can be swapped (e.g. a yellow hover highlight) without fighting a texture.
const PAINT = { roughness: 0.55, metalness: 0.0 };

// Mesh name -> texture kind. Freestanding panels reuse the wall-panel maps.
function kindOf(name) {
  if (/EndCap/.test(name)) return 'endcap';
  if (/Uniweb_(Back|Left)_P\d+$|FS_Panel$|_Panels$/.test(name)) return 'wall';
  return null;
}

export async function applyUniwebTextures(model, renderer) {
  const manifest = await (await fetch(TEXTURE_DIR + 'manifest.json')).json();
  const loader = new THREE.TextureLoader();
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const textures = new Map(); // file -> Promise<Texture>, one load per file

  function textureFor(entry) {
    if (!textures.has(entry.file)) {
      textures.set(entry.file, loader.loadAsync(TEXTURE_DIR + entry.file).then((t) => {
        t.colorSpace = THREE.NoColorSpace; // data, not colour
        t.anisotropy = anisotropy;         // channels are seen at grazing angles
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        return t;
      }));
    }
    return textures.get(entry.file);
  }

  const meshes = [];
  model.traverse((obj) => {
    if (obj.isMesh && kindOf(obj.name)) meshes.push(obj);
  });

  model.updateMatrixWorld(true);
  const stats = { meshes: 0, faces: 0, untextured: 0 };
  for (const mesh of meshes) {
    const kind = kindOf(mesh.name);
    const plan = mapMesh(mesh, (width) => manifest.textures.find(
      (t) => t.kind === kind && Math.abs(t.width_in - width) < WIDTH_TOLERANCE));
    const base = mesh.material;
    const materials = await Promise.all(plan.entries.map(async (entry) => {
      const m = new THREE.MeshStandardMaterial({ color: base.color.clone(), ...PAINT });
      m.name = entry ? `uniweb_${entry.name}` : 'uniweb_plain';
      if (entry) {
        m.normalMap = await textureFor(entry);
        m.normalScale.setScalar(NORMAL_SCALE);
      }
      return m;
    }));
    mesh.geometry.dispose();
    mesh.geometry = plan.geometry;
    mesh.material = materials;
    mesh.userData.uniweb = { kind, textures: plan.entries.filter(Boolean).map((e) => e.name) };
    stats.meshes++;
    stats.faces += plan.texturedFaces;
    stats.untextured += plan.unmatched;
  }
  if (stats.untextured) console.warn(`Uniweb: ${stats.untextured} panel faces had no matching texture width`);
  return { ...stats, files: textures.size };
}

// Rebuilds a mesh's geometry with UVs and material groups. Big faces (normal
// along the thin horizontal axis) get u across one panel (left to right as
// seen from that side, so both sides of a double-sided panel read the same
// way) and v = height / panel height. Multi-panel runs are split at their
// existing panel joints (vertex positions along the run). Edges/top: plain.
function mapMesh(mesh, findEntry) {
  const src = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
  const pos = src.attributes.position;
  const nrm = src.attributes.normal;
  const world = [];
  for (let i = 0; i < pos.count; i++) {
    world.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld));
  }

  const box = new THREE.Box3().setFromPoints(world);
  const size = box.getSize(new THREE.Vector3());
  const thin = size.x < size.z ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
  const runAxis = size.x < size.z ? 'z' : 'x';
  const joints = [...new Set(world.map((p) => Math.round(p[runAxis] * 1000) / 1000))].sort((a, b) => a - b);
  const up = new THREE.Vector3(0, 1, 0);

  const entries = [null];            // material index 0 = plain
  const tris = [];                   // { mat, verts: [i, j, k], uv: [...] }
  let unmatched = 0;
  let texturedFaces = 0;
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), n = new THREE.Vector3();

  for (let t = 0; t < pos.count; t += 3) {
    const [a, b, c] = [world[t], world[t + 1], world[t + 2]];
    n.crossVectors(e1.subVectors(b, a), e2.subVectors(c, a)).normalize();
    const tri = { mat: 0, verts: [t, t + 1, t + 2], uv: [0, 0, 0, 0, 0, 0] };
    tris.push(tri);
    if (Math.abs(n.dot(thin)) < 0.9) continue;

    const mid = (a[runAxis] + b[runAxis] + c[runAxis]) / 3;
    const k = joints.findIndex((j, idx) => idx > 0 && mid < j);
    if (k < 1) continue;
    const [j0, j1] = [joints[k - 1], joints[k]];
    const entry = findEntry(j1 - j0);
    if (!entry) { unmatched++; continue; }

    const right = new THREE.Vector3().crossVectors(up, n); // +-run axis
    const sign = right[runAxis] > 0 ? 1 : -1;
    const sMin = Math.min(j0 * sign, j1 * sign);
    let mat = entries.indexOf(entry);
    if (mat < 0) mat = entries.push(entry) - 1;
    tri.mat = mat;
    texturedFaces++;
    [a, b, c].forEach((p, i) => {
      tri.uv[2 * i] = (p[runAxis] * sign - sMin) / (j1 - j0);
      tri.uv[2 * i + 1] = (p.y - box.min.y) / entry.height_in;
    });
  }

  // Sort triangles by material so each material is one contiguous group.
  tris.sort((p, q) => p.mat - q.mat);
  const position = new Float32Array(pos.count * 3);
  const normal = new Float32Array(pos.count * 3);
  const uv = new Float32Array(pos.count * 2);
  const geometry = new THREE.BufferGeometry();
  let v = 0;
  tris.forEach((tri, i) => {
    if (i === 0 || tri.mat !== tris[i - 1].mat) geometry.addGroup(v, 0, tri.mat);
    geometry.groups[geometry.groups.length - 1].count += 3;
    tri.verts.forEach((s, corner) => {
      position.set([pos.getX(s), pos.getY(s), pos.getZ(s)], v * 3);
      normal.set([nrm.getX(s), nrm.getY(s), nrm.getZ(s)], v * 3);
      uv.set([tri.uv[2 * corner], tri.uv[2 * corner + 1]], v * 2);
      v++;
    });
  });
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  src.dispose();
  return { geometry, entries, texturedFaces, unmatched };
}
