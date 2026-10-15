// Twist gallery renderer: a belt of project cards drawn with three.js on an OffscreenCanvas, off the main thread.
// Ported from the supplied Framer component; the controller is twist-gallery.ts.
import {
  AmbientLight, BufferAttribute, DoubleSide, Group, ImageBitmapLoader, Mesh, MeshBasicMaterial,
  PerspectiveCamera, Scene, Shape, ShapeGeometry, SRGBColorSpace, Texture, Vector2, WebGLRenderer,
} from 'three';

/* eslint-disable @typescript-eslint/no-explicit-any */
let renderer: any, scene: any, camera: any, belt: any, frontGeom: any;
let items: { group: any; front: any; u: number; imgIdx: number }[] = [];
let textures: (any | null)[] = [];

const prm: Record<string, number> = {
  count: 12, scrollSpeed: 0, spinDeg: 0, phaseStepDeg: 10, spacing: 56, cardW: 180, cardH: 220, radius: 18,
  curveAmp: 120, angleDeg: -12, tiltYdeg: 8, camYawDeg: 12, camPitchDeg: -6, camRollDeg: 0, camDist: 900,
  camFovDeg: 32, camTargetX: 0, camTargetY: 0, camTargetZ: 0,
};

let last = performance.now();
let tSec = 0;
let animating = false;
const deg2rad = (d: number) => (d * Math.PI) / 180;
const clampDpr = (d: number) => Math.min(Math.max(d || 1, 1), 1.5);
const smooth01 = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

const clampR = (w: number, h: number, r: number) => Math.max(0, Math.min(r, Math.min(w, h) / 2));
const makeShape = (w: number, h: number, r: number) => {
  const c = clampR(w, h, r);
  const s = new Shape();
  const hw = w / 2, hh = h / 2;
  s.moveTo(-hw + c, -hh);
  s.lineTo(hw - c, -hh);
  s.absarc(hw - c, -hh + c, c, -Math.PI / 2, 0, false);
  s.lineTo(hw, hh - c);
  s.absarc(hw - c, hh - c, c, 0, Math.PI / 2, false);
  s.lineTo(-hw + c, hh);
  s.absarc(-hw + c, hh - c, c, Math.PI / 2, Math.PI, false);
  s.lineTo(-hw, -hh + c);
  s.absarc(-hw + c, -hh + c, c, Math.PI, 1.5 * Math.PI, false);
  return s;
};

const makeFrontGeom = (w: number, h: number, r: number) => {
  const g = new ShapeGeometry(makeShape(w, h, r), 8);
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  const invW = 1 / (bb.max.x - bb.min.x);
  const invH = 1 / (bb.max.y - bb.min.y);
  const pos = g.attributes.position;
  const uv = new BufferAttribute(new Float32Array(pos.count * 2), 2);
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - bb.min.x) * invW, (pos.getY(i) - bb.min.y) * invH);
  g.setAttribute('uv', uv);
  return g;
};

// "Cover" fit: fill the card and crop the overflow, like object-fit: cover
const applyCover = (tex: any) => {
  if (!tex || !tex.image) return;
  const aImg = (tex.image.width || 1) / (tex.image.height || 1);
  const aCard = prm.cardW / prm.cardH;
  if (aImg > aCard) { const rx = aCard / aImg; tex.repeat.set(rx, 1); tex.offset.set((1 - rx) / 2, 0); }
  else { const ry = aImg / aCard; tex.repeat.set(1, ry); tex.offset.set(0, (1 - ry) / 2); }
  tex.needsUpdate = true;
};

const makeFrontMat = (map: any) => {
  const m = new MeshBasicMaterial({ color: 0xffffff, toneMapped: false, side: DoubleSide, transparent: true, depthWrite: false, depthTest: true, map: map ?? null });
  if (m.map) applyCover(m.map);
  return m;
};

const setCamera = () => {
  const a = prm;
  camera.fov = a.camFovDeg;
  camera.updateProjectionMatrix();
  const yaw = deg2rad(a.camYawDeg), pitch = deg2rad(a.camPitchDeg), r = a.camDist;
  const tx = a.camTargetX, ty = a.camTargetY, tz = a.camTargetZ;
  camera.position.set(tx + r * Math.sin(yaw) * Math.cos(pitch), ty + r * Math.sin(pitch), tz + r * Math.cos(yaw) * Math.cos(pitch));
  camera.lookAt(tx, ty, tz);
  camera.rotation.z = deg2rad(a.camRollDeg);
};

const buildItems = (N: number) => {
  for (const it of items) { it.front.material.dispose?.(); belt.remove(it.group); }
  items = [];
  const M = Math.max(1, textures.length);
  const half = ((N - 1) * prm.spacing) / 2;
  for (let i = 0; i < N; i++) {
    const grp = new Group();
    const front = new Mesh(frontGeom, makeFrontMat(textures[i % M] || null));
    front.renderOrder = 2;
    grp.add(front);
    belt.add(grp);
    items.push({ group: grp, front, u: -half + i * prm.spacing, imgIdx: i % M });
  }
};

const updateItemMaps = () => {
  const M = Math.max(1, textures.length);
  for (const it of items) {
    const m = it.front.material;
    m.map = textures[it.imgIdx % M] || null;
    if (m.map) applyCover(m.map);
    m.needsUpdate = true;
  }
};

const loadTextures = async (urls: string[]) => {
  textures.forEach((t) => t?.dispose?.());
  textures = [];
  if (!urls || urls.length === 0) return;
  const ibl = new ImageBitmapLoader();
  ibl.setOptions({ imageOrientation: 'flipY', premultiplyAlpha: 'none' } as any);
  const maxAniso = renderer?.capabilities?.getMaxAnisotropy?.() ?? 8;
  await Promise.all(urls.map((u, i) => new Promise<void>((resolve) => {
    if (!u) { textures[i] = null; resolve(); return; }
    ibl.load(u, (bitmap: any) => {
      const t = new Texture(bitmap);
      t.needsUpdate = true;
      t.flipY = false;
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(4, maxAniso);
      applyCover(t);
      textures[i] = t;
      resolve();
    }, undefined, () => { textures[i] = null; resolve(); });
  })));
};

const resizeCamera = () => {
  const v = new Vector2();
  renderer.getSize(v);
  camera.aspect = Math.max(1e-6, v.x / Math.max(1e-6, v.y));
  camera.updateProjectionMatrix();
};

const needsLoop = () => Math.abs(prm.scrollSpeed) > 0 || Math.abs(prm.spinDeg) > 0;
const updateAnimLoop = () => {
  if (needsLoop() && !animating) { animating = true; last = performance.now(); renderer.setAnimationLoop(loop); }
  else if (!needsLoop() && animating) { animating = false; renderer.setAnimationLoop(null); loop(true); }
};

const loop = (single: any = false) => {
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  tSec += dt;
  setCamera();

  const N = items.length;
  const spacingNow = prm.spacing;
  const period = N * spacingNow;
  const half = ((N - 1) * spacingNow) / 2;
  const dx = -prm.scrollSpeed * spacingNow * dt;
  let sumY = 0;

  for (let k = 0; k < N; k++) {
    const it = items[k];
    it.u += dx;
    const fadeW = N <= 3 ? 0 : Math.max(0, spacingNow * 1.1);
    const edgeL = -half, edgeR = half;
    const rampL = fadeW > 0 ? Math.min(1, Math.max(0, (it.u - edgeL) / fadeW)) : 1;
    const rampR = fadeW > 0 ? Math.min(1, Math.max(0, (edgeR - it.u) / fadeW)) : 1;
    const op = smooth01(Math.min(rampL, rampR));
    if (fadeW > 0) {
      if (it.u < edgeL - 0.5 * fadeW) it.u += period;
      else if (it.u > edgeR + 0.5 * fadeW) it.u -= period;
    }
    const y = prm.curveAmp * Math.sin(0.055 * it.u);
    const z = 0.06 * prm.curveAmp * Math.cos(0.055 * it.u);
    sumY += y;
    it.group.position.set(it.u, y, z);
    const spin = deg2rad(prm.spinDeg) * tSec + deg2rad(prm.phaseStepDeg) * (it.u / spacingNow);
    // Each card turns about its own tall axis, a little more than its neighbour, so the strip reads as a twisting ribbon
    it.group.rotation.set(0, deg2rad(prm.tiltYdeg) + spin, 0);
    it.front.material.opacity = op;
    it.group.visible = op > 0.001;
  }

  const avgY = N > 0 ? sumY / N : 0;
  belt.position.y = -avgY + 40;
  belt.rotation.z = deg2rad(prm.angleDeg);
  renderer.render(scene, camera);
  if (single) return;
};

(self as any).onmessage = async (ev: MessageEvent) => {
  const data = ev.data;
  if (!data || !data.type) return;

  if (data.type === 'init') {
    const { canvas, size, dpr, props, images } = data;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      (self as any).postMessage({ type: 'error' });
      return;
    }
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(clampDpr(dpr));
    renderer.setSize(size.w, size.h, false);
    renderer.outputColorSpace = SRGBColorSpace;
    scene = new Scene();
    camera = new PerspectiveCamera(props.camFovDeg, Math.max(1e-6, size.w) / Math.max(1e-6, size.h), 0.1, 5000);
    scene.add(new AmbientLight(0xffffff, 0.9));
    belt = new Group();
    scene.add(belt);
    Object.assign(prm, props);
    frontGeom = makeFrontGeom(prm.cardW, prm.cardH, prm.radius);
    await loadTextures(images);
    buildItems(Math.max(2, prm.count));
    resizeCamera();
    updateItemMaps();
    if (needsLoop()) { animating = true; last = performance.now(); renderer.setAnimationLoop(loop); }
    else loop(true);
    (self as any).postMessage({ type: 'ready' });
  }

  if (data.type === 'resize') {
    renderer.setPixelRatio(clampDpr(data.dpr));
    renderer.setSize(data.size.w, data.size.h, false);
    resizeCamera();
    if (!animating) loop(true);
  }

  if (data.type === 'props') {
    const props = data.props;
    const geomChanged = (props.cardW !== undefined && props.cardW !== prm.cardW) || (props.cardH !== undefined && props.cardH !== prm.cardH) || (props.radius !== undefined && props.radius !== prm.radius);
    Object.assign(prm, props);
    if (geomChanged) {
      frontGeom?.dispose?.();
      frontGeom = makeFrontGeom(prm.cardW, prm.cardH, prm.radius);
      for (const it of items) it.front.geometry = frontGeom;
    }
    if (props.count !== undefined) buildItems(Math.max(2, prm.count));
    updateItemMaps();
    updateAnimLoop();
    if (!animating) loop(true);
  }
};
