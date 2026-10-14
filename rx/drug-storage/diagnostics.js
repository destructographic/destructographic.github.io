export function createDiagnostics(el, renderer) {
  const gl = renderer.getContext();
  const version = renderer.capabilities.isWebGL2 ? 'WebGL 2' : 'WebGL 1';
  const gpu = getGpuName(gl);

  let status = null;
  let frames = 0;
  let windowStart = 0;
  let fps = 0;

  function render() {
    const lines = [
      `FPS  ${fps}`,
      `View ${window.innerWidth}×${window.innerHeight}`,
      `DPR  ${(window.devicePixelRatio || 1).toFixed(2)} (render ${renderer.getPixelRatio().toFixed(2)})`,
      `GL   ${status ? status : version + ' OK'}`,
    ];
    if (gpu) lines.push(`GPU  ${gpu}`);
    el.textContent = lines.join('\n');
  }

  function tick(time) {
    frames++;
    if (!windowStart) windowStart = time;
    const elapsed = time - windowStart;
    if (elapsed >= 500) {
      fps = Math.round((frames * 1000) / elapsed);
      frames = 0;
      windowStart = time;
      render();
    }
  }

  function setStatus(value) {
    status = value;
    render();
  }

  render();
  return { tick, setStatus };
}

function getGpuName(gl) {
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER);
  } catch {
    return null;
  }
}
