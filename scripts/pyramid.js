const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

// Resize canvas for device pixel ratio
function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener("resize", resize);
resize();

const vsSource = `
attribute vec3 position;
attribute float faceId;
varying float vFaceId;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
void main(void) {
  vFaceId = faceId;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fsSource = `
precision mediump float;
varying float vFaceId;
uniform float uTime;
uniform int uWire;

bool hexaflicker(float fid, float t) {
  float seed = fid * 12.345 + t * 0.5;
  float n = fract(sin(seed) * 43758.5453);
  return n > 0.97;
}

void main(void) {
  if (uWire == 1) {
    gl_FragColor = vec4(1.0);
    return;
  }
  bool isGlitched = hexaflicker(vFaceId, uTime);
  if (!isGlitched) discard;

  float scan = step(0.5, fract(gl_FragCoord.y * 0.2));
  vec3 color = vec3(1.0, 0.1, 0.1) * scan;
  gl_FragColor = vec4(color, 1.0);
}
`;

function compileShader(src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
  }
  return shader;
}

const vs = compileShader(vsSource, gl.VERTEX_SHADER);
const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

const positionLoc = gl.getAttribLocation(program, "position");
const faceIdLoc = gl.getAttribLocation(program, "faceId");
const modelViewLoc = gl.getUniformLocation(program, "modelViewMatrix");
const projectionLoc = gl.getUniformLocation(program, "projectionMatrix");
const timeLoc = gl.getUniformLocation(program, "uTime");
const wireLoc = gl.getUniformLocation(program, "uWire");

// Vertex and face data (same as original)
const vertices = new Float32Array([
  -1,0,-1,  1,0,-1,  0,1.5,0,    // face 0
   1,0,-1,  1,0, 1,  0,1.5,0,    // face 1
   1,0, 1, -1,0, 1,  0,1.5,0,    // face 2
  -1,0, 1, -1,0,-1,  0,1.5,0,    // face 3
  -1,0,-1,  1,0,-1,  1,0, 1,     // base triangle 1
   1,0, 1, -1,0, 1, -1,0,-1      // base triangle 2
]);

const faceIds = new Float32Array([
  0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4,4, 5,5,5
]);

const wireIndices = new Uint16Array([
  0,1, 1,2, 2,0,
  3,4, 4,5, 5,3,
  6,7, 7,8, 8,6,
  9,10,10,11,11,9
]);

// Buffers
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const faceIdBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, faceIdBuffer);
gl.bufferData(gl.ARRAY_BUFFER, faceIds, gl.STATIC_DRAW);

const wireBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wireIndices, gl.STATIC_DRAW);

// Manual matrix math (no glMatrix)
function mat4Perspective(fov, aspect, near, far) {
  const f = 1.0 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, (2 * far * near) * nf, 0
  ];
}

function render(time) {
  time *= 0.001;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const aspect = canvas.width / canvas.height;
  const proj = mat4Perspective(Math.PI / 3, aspect, 0.1, 100);

  const yaw = time * 0.6;
  const pitch = Math.sin(time * 0.7) * 0.5;
  const roll = Math.cos(time * 0.9) * 0.3;

  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);

  const mv = [
    cr * cy + sr * sp * sy, sr * cp, cr * -sy + sr * sp * cy, 0,
    -sr * cy + cr * sp * sy, cr * cp, sr * sy + cr * sp * cy, 0,
    cp * sy, -sp, cp * cy, 0,
    0, 0, -5, 1
  ];

  gl.uniformMatrix4fv(modelViewLoc, false, new Float32Array(mv));
  gl.uniformMatrix4fv(projectionLoc, false, new Float32Array(proj));
  gl.uniform1f(timeLoc, time);

  // Pass 1: glitch faces
  gl.uniform1i(wireLoc, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, faceIdBuffer);
  gl.enableVertexAttribArray(faceIdLoc);
  gl.vertexAttribPointer(faceIdLoc, 1, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 18);

  // Pass 2: white wireframe
  gl.uniform1i(wireLoc, 1);
  gl.disableVertexAttribArray(faceIdLoc);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
  gl.drawElements(gl.LINES, wireIndices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(render);
}

gl.enable(gl.DEPTH_TEST);
requestAnimationFrame(render);