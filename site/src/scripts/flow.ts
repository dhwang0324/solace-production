/* Flowing glass: the banner picture (public/hero/glass.webp) warped live in WebGL so it moves like slow water.
   Moving the pointer across the banner bends and magnifies the glass under it and sends ripples outward.
   Reduced motion: the still picture only. Pauses off screen and with the Pause button. No WebGL: the still picture stays. */
const hero = document.querySelector<HTMLElement>('[data-flow-hero]');
const canvas = hero?.querySelector<HTMLCanvasElement>('[data-flow]') ?? null;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IMG = '/hero/glass.webp';
const MASK = '/hero/glass-mask.png'; // white where the glass is, black for the background: only the glass moves
const IMG_ASPECT = 1672 / 941;

const VS = 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }';
const FS = `
precision highp float;
uniform sampler2D tex; uniform sampler2D mask; uniform vec2 res; uniform vec2 cover; uniform float t; uniform vec2 mouse; uniform float speed;
const float ASP = 1.7768;
vec2 mirror(vec2 u){ return 1.0 - abs(1.0 - mod(u, 2.0)); }
void main(){
  vec2 s = gl_FragCoord.xy / res;                       // screen 0..1
  vec2 uv = (s - 0.5) * cover + 0.5;                    // picture coordinates, cover-fitted like CSS background-size: cover
  vec2 m  = (mouse - 0.5) * cover + 0.5;
  vec2 p  = uv * vec2(ASP, 1.0);                        // isotropic space for round ripples
  vec2 mp = m  * vec2(ASP, 1.0);

  // constant slow flow: broad travelling swells, as if the glass were moving through water
  float a1 = sin(dot(p, vec2(2.4, 1.4)) - t*0.55);
  float a2 = sin(dot(p, vec2(-1.7, 3.1)) + t*0.42 + a1*0.8);
  float a3 = sin(dot(p, vec2(5.2, 2.2)) - t*0.9 + a2);
  vec2 off = vec2(a1*0.55 + a3*0.18, a2*0.55 - a3*0.14) * 0.0105;

  // pointer: a soft lens that pulls the glass toward the cursor, plus ripples running outward
  vec2 d = p - mp; float r = length(d); vec2 dir = d / (r + 1e-4);
  float lens = exp(-r*r*14.0);
  off -= d * lens * (0.10 + 0.16*speed);
  off += dir * sin(r*34.0 - t*4.2) * exp(-r*3.2) * (0.0028 + 0.011*speed);

  // only the glass moves: the background stays perfectly still
  off *= texture2D(mask, mirror(uv)).r;

  // slight colour splitting at the edges of the glass, like real refraction
  vec2 o = off / vec2(ASP, 1.0);
  float disp = 1.0 + 6.0*length(off);
  float cr = texture2D(tex, mirror(uv + o*1.00)).r;
  float cg = texture2D(tex, mirror(uv + o*(1.0 + 0.10*disp))).g;
  float cb = texture2D(tex, mirror(uv + o*(1.0 + 0.20*disp))).b;
  vec3 col = vec3(cr, cg, cb);
  // glints where the surface tilts toward the light
  col += vec3(1.0) * clamp((off.x*0.6 - off.y*0.4)*9.0, 0.0, 1.0) * 0.045;
  gl_FragColor = vec4(col, 1.0);
}`;

if (hero && canvas && !reduce) {
  const opts = { antialias: false, alpha: false, powerPreference: 'low-power' as WebGLPowerPreference };
  const gl = (canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts)) as WebGLRenderingContext | WebGL2RenderingContext | null;
  if (gl) {
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = (n: string) => gl.getUniformLocation(prog, n);
      const uMask = U('mask'), uRes = U('res'), uCover = U('cover'), uT = U('t'), uMouse = U('mouse'), uSpeed = U('speed'), uTex = U('tex');

      let scale = 1; // full size: the picture is kept as sharp as the screen allows
      let cover: [number, number] = [1, 1];
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.max(2, Math.round(r.width * dpr)); canvas.height = Math.max(2, Math.round(r.height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        const sa = r.width / r.height;
        cover = sa > IMG_ASPECT ? [1, IMG_ASPECT / sa] : [sa / IMG_ASPECT, 1];
      };
      let mx = 0.62, my = 0.45, tx = mx, ty = my, speed = 0;
      const draw = (time: number) => {
        gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform2f(uCover, cover[0], cover[1]);
        gl.uniform1f(uT, time); gl.uniform2f(uMouse, mx, my); gl.uniform1f(uSpeed, speed);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      const load = (src: string) => new Promise<HTMLImageElement>((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
      const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
      Promise.all([load(IMG), load(MASK)]).then(([image, maskImg]) => {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // WebGL reads pictures from the bottom row up
        const upload = (unit: number, img: HTMLImageElement, mips: boolean) => {
          const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
          const useMips = mips && isGL2; // WebGL2 can mip-map any size: smoother when the screen is smaller than the picture
          if (useMips) gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, useMips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };
        upload(0, image, true); upload(1, maskImg, false);
        gl.uniform1i(uTex, 0); gl.uniform1i(uMask, 1);
        size(); window.addEventListener('resize', size);

        let visible = true, paused = false, last = performance.now(), t0 = last, raf = 0, slow = 0, frames = 0;
        const frame = (now: number) => {
          raf = 0;
          if (!visible || paused || document.hidden) return;
          const dt = Math.min(0.05, (now - last) / 1000); last = now;
          const nx = mx + (tx - mx) * 0.12, ny = my + (ty - my) * 0.12;
          const v = Math.hypot(nx - mx, ny - my) / Math.max(dt, 0.001);
          speed += (Math.min(v * 0.7, 1.3) - speed) * 0.1; mx = nx; my = ny;
          draw((now - t0) / 1000);
          if (!hero.classList.contains('is-flowing')) hero.classList.add('is-flowing'); // fade the live picture in over the still one
          // if this device struggles, quietly lower the render size
          frames++; if (dt > 0.034) slow++;
          if (frames === 90) { if (slow > 45 && scale > 0.6) { scale = scale > 0.8 ? 0.8 : 0.6; size(); } frames = 0; slow = 0; }
          raf = requestAnimationFrame(frame);
        };
        const wake = () => { if (!raf && visible && !paused && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
        hero.addEventListener('pointermove', (e) => {
          const r = hero.getBoundingClientRect();
          tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height;
        }, { passive: true });
        new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); }, { threshold: 0.02 }).observe(hero);
        document.addEventListener('visibilitychange', wake);
        // the banner's Pause button also freezes the glass
        hero.querySelector<HTMLElement>('[data-hs-pause]')?.addEventListener('click', () => {
          requestAnimationFrame(() => { paused = hero.querySelector('[data-hs-pause]')?.getAttribute('aria-pressed') === 'true'; if (!paused) wake(); });
        });
        wake();
      }).catch(() => { /* the still picture stays */ });
    }
  }
}
