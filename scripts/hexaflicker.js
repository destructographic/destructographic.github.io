const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `
  attribute vec3 position;
  uniform float time;
  uniform mat4 projection;
  uniform mat4 modelView;
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projection * modelView * vec4(position, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float time;
  varying vec3 vPosition;
  void main() {
    float flicker = step(fract(sin(dot(vPosition.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453 + time * 5.0), 0.5);
    float scanline = sin((vPosition.y + time * 0.5) * 80.0) * 0.05;
    vec3 color = mix(vec3(1.0), vec3(1.0, 0.2, 0.2), flicker);
    gl_FragColor = vec4(color * (1.0 - scanline), 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
  const program = gl.createProgram();
  const vShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Pyramid geometry
const positions = new Float32Array([
  0, 1, 0,     // Top point (0)
  -1, -1, -1,  // Base points (1–4)
  1, -1, -1,
  1, -1, 1,
  -1, -1, 1
]);

const faceIndices = new Uint16Array([
  0, 1, 2,
  0, 2, 3,
  0, 3, 4,
  0, 4, 1,
  1, 2, 3,
  1, 3, 4
]);

const wireIndices = new Uint16Array([
  0,1, 1,2, 2,0,
  3,4, 4,5, 5,3,
  6,7, 7,8, 8,6,
  9,10,10,11,11,9,
  12,13,13,14,14,15,15,12 // fixed: removed diagonal (was 12-14)
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const faceBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceIndices, gl.STATIC_DRAW);

const wireBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wireIndices, gl.STATIC_DRAW);

const positionLoc = gl.getAttribLocation(program, "
