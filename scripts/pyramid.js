// scripts/pyramid.js

const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

const vertexShaderSource = `
attribute vec3 position;
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
  float scanline = sin((vPosition.y + time * 0.5) * 80.0) * 0.05;
  gl_FragColor = vec4(vec3(1.0 - scanline), 1.0);
}
`;

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionAttribLocation = gl.getAttribLocation(program, "position");
const projectionUniformLocation = gl.getUniformLocation(program, "projection");
const modelViewUniformLocation = gl.getUniformLocation(program, "modelView");
const timeUniformLocation = gl.getUniformLocation(program, "time");

const positions = new Float32Array([
  // pyramid
  0, 1, 0,   // 0 top
  -1, -1, -1, // 1
  1, -1, -1,  // 2
  1, -1, 1,   // 3
  -1, -1, 1,  // 4
]);

const wireIndices = new Uint16Array([
  0,1, 0,2, 0,3, 0,4,
  1,2, 2,3, 3,4, 4,1
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const wireBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wireIndices, gl.STATIC_DRAW);

gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);

const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100);
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);

function animate(timeStamp) {
  const timeInSeconds = timeStamp * 0.001;
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniform1f(timeUniformLocation, timeInSeconds);

  mat4.rotateY(modelViewMatrix, modelViewMatrix, 0.005);
  gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);
  gl.uniformMatrix4fv(modelViewUniformLocation, false, modelViewMatrix);

  gl.drawElements(gl.LINES, wireIndices.length, gl.UNSIGNED_SHORT, 0);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
