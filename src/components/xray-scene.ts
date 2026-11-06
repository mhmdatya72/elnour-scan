/**
 * مشهد three.js لقفص صدري مبسّط بأسلوب صور الأشعة، مبني بالكود بدون ملفات موديل.
 * الملف ده بيتحمّل بـ import() لما القسم يقرب من الشاشة، فمش بيزوّد تحميل الصفحة الأول.
 * النموذج توضيحي وليس دقيقًا تشريحيًا.
 */
import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  ExtrudeGeometry,
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  Shape,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
} from "three";

export type FocusArea = "chest" | "bones" | "heart";
type Part = "ribs" | "cartilage" | "lungs" | "bones" | "arms" | "heart";

/** شدة إضاءة كل جزء حسب المنطقة المختارة */
const BOOST: Record<FocusArea | "none", Record<Part, number>> = {
  none: { ribs: 1, cartilage: 0.8, lungs: 0.8, bones: 1, arms: 0.9, heart: 1 },
  chest: { ribs: 1.45, cartilage: 1.2, lungs: 2, bones: 0.4, arms: 0.2, heart: 0.6 },
  bones: { ribs: 0.7, cartilage: 0.25, lungs: 0.1, bones: 1.8, arms: 1.8, heart: 0.15 },
  heart: { ribs: 0.22, cartilage: 0.12, lungs: 0.3, bones: 0.2, arms: 0.1, heart: 2 },
};

const VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vY = (modelMatrix * vec4(position, 1.0)).y;
    gl_Position = projectionMatrix * mv;
  }
`;

// حواف أوضح من المركز، زي العظم في صورة الأشعة، مع توهج ذهبي عند خط المسح.
// الناتج premultiplied وalpha بتساوي السطوع، فالأجزاء الباهتة تفضل شفافة على خلفية القسم.
const FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uGold;
  uniform float uBoost;
  uniform float uScanY;
  uniform float uBody;
  uniform vec2 uFade;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vY;
  void main() {
    float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.8);
    float band = smoothstep(0.42, 0.0, abs(vY - uScanY));
    float fade = smoothstep(uFade.x, uFade.y, vY) * smoothstep(4.4, 3.5, vY);
    vec3 base = uColor * (uBody + rim * 0.8) * uBoost;
    vec3 scan = uGold * band * (0.2 + rim) * min(uBoost + 0.2, 1.3);
    vec3 color = min((base + scan) * fade, vec3(1.0));
    gl_FragColor = vec4(color, max(color.r, max(color.g, color.b)));
  }
`;

const DEFAULT_FADE = new Vector2(-4, -2.8);

function curve(points: [number, number, number][]): CatmullRomCurve3 {
  return new CatmullRomCurve3(points.map(([x, y, z]) => new Vector3(x, y, z)));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function createXrayScene(
  canvas: HTMLCanvasElement,
  options: { reducedMotion: boolean; onContextLost: () => void },
) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 60);
  const pivot = new Group();
  scene.add(pivot);

  const scanY = { value: 0.6 };
  const gold = new Color("#ddaa43");
  const geometries: BufferGeometry[] = [];
  const materials: Record<Part, ShaderMaterial> = {
    ribs: material("#d5e6f7", 0.16),
    cartilage: material("#7ea9d4", 0.1),
    lungs: material("#5f93cb", 0.035),
    bones: material("#e6f0fa", 0.2),
    arms: material("#e6f0fa", 0.16, new Vector2(-0.3, 1.7)),
    heart: material("#ddaa43", 0.62),
  };

  function material(color: string, body: number, fade: Vector2 = DEFAULT_FADE) {
    return new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uColor: { value: new Color(color) },
        uGold: { value: gold },
        uBoost: { value: 1 },
        uScanY: scanY,
        uBody: { value: body },
        uFade: { value: fade },
      },
      blending: AdditiveBlending,
      premultipliedAlpha: true,
      transparent: true,
      depthWrite: false,
    });
  }

  function add(part: Part, geometry: BufferGeometry) {
    geometries.push(geometry);
    const mesh = new Mesh(geometry, materials[part]);
    pivot.add(mesh);
    return mesh;
  }

  const unitSphere = new SphereGeometry(1, 20, 14);
  geometries.push(unitSphere);

  /** جزء بيضاوي من الكرة المشتركة، عشان نقلل عدد الأشكال في الذاكرة */
  function ellipsoid(
    part: Part,
    [x, y, z]: [number, number, number],
    [sx, sy, sz]: [number, number, number],
    tilt = 0,
  ) {
    const mesh = new Mesh(unitSphere, materials[part]);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.rotation.x = tilt;
    pivot.add(mesh);
    return mesh;
  }

  buildSpine();
  buildRibs();
  buildSternum();
  buildShoulders();
  buildLungs();
  const heart = buildHeart();
  const scanner = buildScanner();

  function buildSpine() {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const y = 3.75 - t * 7.5;
      const z = -1.12 + 0.2 * Math.sin(t * Math.PI * 2 + 0.4);
      const radius = 0.15 + 0.17 * t;
      const height = 0.1 + 0.065 * t;
      ellipsoid("bones", [0, y, z], [radius, height, radius * 0.85]);
      ellipsoid("bones", [0, y - 0.07, z - radius - 0.13], [0.05, 0.1, 0.17], 0.5);
    }
  }

  function buildRibs() {
    const widths = [1.05, 1.45, 1.75, 1.95, 2.1, 2.2, 2.25, 2.25, 2.2, 2.1, 1.95, 1.75];
    const depths = [0.75, 1, 1.15, 1.25, 1.3, 1.35, 1.4, 1.4, 1.35, 1.3, 1.2, 1.1];
    // نزول الضلع من العمود الفقري لحد نهايته العظمية في الأمام
    const drops = [0.55, 0.9, 1.15, 1.35, 1.5, 1.62, 1.72, 1.8, 1.85, 1.85, 1.25, 0.8];
    // نهاية الجزء العظمي بالزاوية، من الخلف (0) للأمام (π)
    const boneEnds = [2.5, 2.4, 2.35, 2.3, 2.28, 2.25, 2.25, 2.2, 2.15, 2.05, 1.75, 1.35];

    for (let i = 0; i < 12; i++) {
      const a = widths[i];
      const b = depths[i];
      const y0 = 2.35 - i * 0.4;
      const zAt = (theta: number) => b - 1.05 - b * Math.cos(theta);

      for (const side of [-1, 1]) {
        const bone: [number, number, number][] = [];
        for (let s = 0; s <= 10; s++) {
          const t = s / 10;
          const theta = lerp(0.12, boneEnds[i], t);
          bone.push([side * a * Math.sin(theta), y0 - drops[i] * Math.pow(t, 1.15), zAt(theta)]);
        }
        const tube = new TubeGeometry(curve(bone), 34, 0.07, 7);
        add("ribs", tube);

        // الغضروف: أول 7 ضلوع يوصلوا لعظمة القص، و3 بعدهم يكوّنوا القوس الضلعي، وآخر ضلعين حرّين
        if (i >= 10) continue;
        const attached = i < 7;
        const endTheta = Math.PI - Math.asin((attached ? 0.3 : 0.62 + (i - 7) * 0.32) / a);
        const endY = attached ? lerp(2.05, -0.35, i / 6) : -0.72 - (i - 7) * 0.36;
        const startY = y0 - drops[i];
        const cartilage: [number, number, number][] = [];
        for (let s = 0; s <= 6; s++) {
          const t = s / 6;
          const theta = lerp(boneEnds[i], endTheta, t);
          const eased = t * t * (3 - 2 * t);
          cartilage.push([side * a * Math.sin(theta), lerp(startY, endY, eased), zAt(theta)]);
        }
        add("cartilage", new TubeGeometry(curve(cartilage), 18, 0.055, 6));
      }
    }
  }

  function buildSternum() {
    const tilt = -0.49;
    ellipsoid("ribs", [0, 1.86, 0.58], [0.42, 0.34, 0.09], tilt);
    ellipsoid("ribs", [0, 0.72, 1.2], [0.27, 0.92, 0.08], tilt);
    ellipsoid("ribs", [0, -0.4, 1.8], [0.1, 0.24, 0.05], tilt);
  }

  function buildShoulders() {
    for (const side of [-1, 1]) {
      add(
        "bones",
        new TubeGeometry(
          curve([
            [side * 0.3, 2.1, 0.5],
            [side * 1, 2.48, 0.42],
            [side * 1.8, 2.5, -0.02],
            [side * 2.55, 2.62, -0.45],
          ]),
          26,
          0.08,
          8,
        ),
      );
      ellipsoid("bones", [side * 2.82, 2.28, -0.5], [0.34, 0.34, 0.34]);
      add(
        "arms",
        new TubeGeometry(
          curve([
            [side * 2.88, 2.1, -0.5],
            [side * 2.98, 1.1, -0.5],
            [side * 3.06, 0, -0.48],
            [side * 3.1, -0.6, -0.46],
          ]),
          18,
          0.15,
          10,
        ),
      );
    }
  }

  function buildLungs() {
    for (const side of [-1, 1]) {
      ellipsoid(
        "lungs",
        [side * 1.08, 0.42, 0.1],
        [side > 0 ? 0.78 : 0.9, 1.78, 0.96],
      );
    }
  }

  function buildHeart() {
    const shape = new Shape();
    shape.moveTo(0, -1.1);
    shape.bezierCurveTo(-1.5, -0.1, -1.25, 1, -0.55, 1);
    shape.bezierCurveTo(-0.25, 1, -0.05, 0.8, 0, 0.55);
    shape.bezierCurveTo(0.05, 0.8, 0.25, 1, 0.55, 1);
    shape.bezierCurveTo(1.25, 1, 1.5, -0.1, 0, -1.1);
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.28,
      bevelSize: 0.24,
      bevelSegments: 5,
      curveSegments: 22,
    });
    geometry.center();
    const mesh = add("heart", geometry);
    mesh.position.set(0.42, 0.2, 0.42);
    mesh.rotation.z = -0.28;
    return mesh;
  }

  function buildScanner() {
    const ring = new Mesh(
      new TorusGeometry(1, 0.011, 8, 72),
      new ShaderMaterial({
        vertexShader: "void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
        fragmentShader: "uniform vec3 c;void main(){gl_FragColor=vec4(c*0.8,0.8);}",
        uniforms: { c: { value: gold } },
        blending: AdditiveBlending,
        premultipliedAlpha: true,
        transparent: true,
        depthWrite: false,
      }),
    );
    geometries.push(ring.geometry);
    ring.rotation.x = Math.PI / 2;
    ring.scale.set(3.4, 2.1, 1);
    pivot.add(ring);
    return ring;
  }

  let focus: FocusArea | "none" = "none";
  let rotation = -0.5;
  let dragging = false;
  let lastPointerX = 0;
  let resumeAt = 0;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let visible = false;

  function applyBoost(step: number) {
    for (const part of Object.keys(materials) as Part[]) {
      const uniform = materials[part].uniforms.uBoost;
      uniform.value += (BOOST[focus][part] - uniform.value) * step;
    }
  }

  function draw() {
    pivot.rotation.y = rotation;
    renderer.render(scene, camera);
  }

  function tick(now: number) {
    frame = 0;
    if (!visible) return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    elapsed += delta;

    if (!dragging && now > resumeAt) rotation += delta * 0.32;
    scanY.value = 0.45 + Math.sin(elapsed * 0.75) * 2.75;
    scanner.position.y = scanY.value;
    const beat = Math.max(0, Math.sin(elapsed * 5.2)) ** 6 * 0.08;
    heart.scale.setScalar(0.5 * (1 + beat));
    applyBoost(Math.min(1, delta * 6));

    draw();
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (options.reducedMotion || frame || !visible) return;
    previous = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const fit = Math.tan((camera.fov * Math.PI) / 360) * 2;
    camera.position.set(0, 0.2, Math.max(8.4 / fit, 7.6 / (fit * camera.aspect)));
    camera.lookAt(0, 0.2, 0);
    camera.updateProjectionMatrix();
    draw();
  }

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    lastPointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging) return;
    rotation += (event.clientX - lastPointerX) * 0.009;
    lastPointerX = event.clientX;
    if (options.reducedMotion) draw();
  }

  function onPointerUp() {
    dragging = false;
    resumeAt = performance.now() + 1500;
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    stop();
    options.onContextLost();
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("webglcontextlost", onContextLost);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  // الرسم بيقف لما القسم يخرج من الشاشة عشان ما يستهلكش البطارية
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  visibility.observe(canvas);

  heart.scale.setScalar(0.5);
  scanner.position.y = scanY.value;
  applyBoost(1);
  resize();

  return {
    setFocus(next: FocusArea | null) {
      focus = next ?? "none";
      if (options.reducedMotion) {
        applyBoost(1);
        draw();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      geometries.forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((item) => item.dispose());
      scanner.material.dispose();
      renderer.dispose();
    },
  };
}
