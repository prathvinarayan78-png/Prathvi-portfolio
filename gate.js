/* ==========================================================
   ENTRY GATE — immersive WebGL (Three.js)
   Thousands of particles assemble "PRATHVI" in 3D space.
   Hold to charge → volumetric detonation → the camera
   flies through the debris field into the site.
   ========================================================== */
(function gate() {
  const gateEl = document.getElementById("gate");
  const cv = document.getElementById("gateCanvas");
  const bar = document.getElementById("gateBar");
  const skip = document.getElementById("gateSkip");
  const hint = document.getElementById("gateHint");
  if (!gateEl || !cv) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let opened = false;
  function open() {
    if (opened) return;
    opened = true;
    gateEl.classList.add("is-opening");
    document.body.classList.remove("is-locked"); // unleash all reveal animations
    gateEl.addEventListener("animationend", () => gateEl.remove());
  }

  skip.addEventListener("click", open);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "Escape") open();
  });

  if (reduced) { open(); return; } // don't gate reduced-motion users

  // ponytail: local three.js, CDN fallback; if neither loads the gate just opens — site never blocked
  import("./vendor/three.module.js")
    .catch(() => import("https://unpkg.com/three@0.160.0/build/three.module.js"))
    .then(init)
    .catch(open);

  async function init(THREE) {
    const rs = getComputedStyle(document.documentElement);
    const accent = new THREE.Color(rs.getPropertyValue("--accent").trim() || "#c8ff3e");
    const red = new THREE.Color("#ff3728");

    // ---------- renderer / scene / camera ----------
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x0a0a0e, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0e, 0.012);

    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 400);
    camera.position.set(0, 0, 34);

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    // ---------- sample "PRATHVI" glyphs into 3D targets ----------
    try { await document.fonts.load('800 200px Archivo'); } catch {}
    const tc = document.createElement("canvas");
    tc.width = 1400; tc.height = 320;
    const tctx = tc.getContext("2d");
    tctx.font = '800 210px Archivo, sans-serif';
    tctx.textAlign = "center";
    tctx.textBaseline = "middle";
    tctx.fillStyle = "#fff";
    tctx.fillText("PRATHVI", tc.width / 2, tc.height / 2);
    const img = tctx.getImageData(0, 0, tc.width, tc.height).data;

    const targets = [];
    const STEP = 4;
    for (let y = 0; y < tc.height; y += STEP) {
      for (let x = 0; x < tc.width; x += STEP) {
        if (img[(y * tc.width + x) * 4 + 3] > 128) {
          targets.push(
            ((x - tc.width / 2) / tc.width) * 42,          // world x
            (-(y - tc.height / 2) / tc.width) * 42,        // world y
            (Math.random() - 0.5) * 2.2                    // slab of depth
          );
        }
      }
    }
    const N = targets.length / 3;

    // ---------- name particles ----------
    const pos = new Float32Array(N * 3);
    const start = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const delay = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      // start scattered on a big sphere shell around the camera
      const r = 70 + Math.random() * 60;
      const a = Math.random() * Math.PI * 2;
      const b = Math.acos(2 * Math.random() - 1);
      start[i * 3]     = pos[i * 3]     = r * Math.sin(b) * Math.cos(a);
      start[i * 3 + 1] = pos[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
      start[i * 3 + 2] = pos[i * 3 + 2] = r * Math.cos(b) - 40;
      delay[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: accent.clone(),
      size: 0.16,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(geo, mat));

    // ---------- starfield ----------
    const SN = 1600;
    const spos = new Float32Array(SN * 3);
    for (let i = 0; i < SN; i++) {
      spos[i * 3] = (Math.random() - 0.5) * 220;
      spos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      spos[i * 3 + 2] = (Math.random() - 0.5) * 240 - 40;
    }
    const sgeo = new THREE.BufferGeometry();
    sgeo.setAttribute("position", new THREE.BufferAttribute(spos, 3));
    const smat = new THREE.PointsMaterial({
      color: 0x9aa0b8, size: 0.09, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    scene.add(new THREE.Points(sgeo, smat));

    // ---------- state ----------
    const CHARGE_TIME = 1.5;
    let t = 0, charge = 0, holding = false, exploded = false, boomT = 0;
    let mx = 0, my = 0;
    let warp = 1;

    hint.textContent = "hold anywhere to detonate";

    // ---------- input ----------
    gateEl.addEventListener("pointermove", (e) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
    });
    gateEl.addEventListener("pointerdown", () => { holding = true; });
    addEventListener("pointerup", () => { holding = false; });
    gateEl.addEventListener("pointercancel", () => { holding = false; });
    addEventListener("keydown", (e) => { if (e.key === " ") holding = true; });
    addEventListener("keyup", (e) => { if (e.key === " ") holding = false; });

    function detonate() {
      exploded = true;
      hint.textContent = "";
      gateEl.classList.add("is-flashing");
      for (let i = 0; i < N; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        const d = Math.max(0.001, Math.hypot(x, y, z));
        const s = 18 + Math.random() * 45;
        vel[i * 3]     = (x / d) * s + (Math.random() - 0.5) * 8;
        vel[i * 3 + 1] = (y / d) * s + (Math.random() - 0.5) * 8;
        vel[i * 3 + 2] = (z / d) * s + Math.random() * 30; // bias toward camera → fly-through
      }
      setTimeout(open, 1200);
    }

    // ---------- loop ----------
    const clock = new THREE.Clock();
    (function tick() {
      if (opened) return;
      requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      t += dt;

      if (!exploded) {
        // charge / drain
        charge = holding
          ? Math.min(1, charge + dt / CHARGE_TIME)
          : Math.max(0, charge - dt / CHARGE_TIME);
        bar.style.width = `${charge * 100}%`;
        hint.textContent = holding
          ? (charge > 0.65 ? "..." : "keep holding...")
          : "hold anywhere to detonate";
        if (charge >= 1) detonate();

        // assemble + idle wave + charge rumble
        const rumble = charge * charge * 0.9;
        for (let i = 0; i < N; i++) {
          const p = Math.min(1, Math.max(0, (t * 0.55 - delay[i] * 0.9)));
          const e = p * p * (3 - 2 * p); // smoothstep
          const i3 = i * 3;
          const wob = Math.sin(t * 1.6 + delay[i] * 12) * 0.14 * (1 - charge);
          pos[i3]     = start[i3]     + (targets[i3]     - start[i3])     * e + (Math.random() - 0.5) * rumble;
          pos[i3 + 1] = start[i3 + 1] + (targets[i3 + 1] - start[i3 + 1]) * e + wob + (Math.random() - 0.5) * rumble;
          pos[i3 + 2] = start[i3 + 2] + (targets[i3 + 2] - start[i3 + 2]) * e + (Math.random() - 0.5) * rumble;
        }
        mat.color.lerpColors(accent, red, charge * 0.9);
        mat.size = 0.16 + charge * 0.1;

        // camera: mouse-look + charge shake
        const shk = charge * charge * 0.5;
        camera.position.x += ((mx * 6 + (Math.random() - 0.5) * shk) - camera.position.x) * 0.06;
        camera.position.y += ((-my * 3.5 + (Math.random() - 0.5) * shk) - camera.position.y) * 0.06;
        camera.position.z = 34 - charge * 4; // lean in while charging
        camera.lookAt(0, 0, 0);
      } else {
        // explosion: debris flies, camera dives through the cloud
        boomT += dt;
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          pos[i3]     += vel[i3]     * dt;
          pos[i3 + 1] += vel[i3 + 1] * dt;
          pos[i3 + 2] += vel[i3 + 2] * dt;
          vel[i3] *= 0.995; vel[i3 + 1] *= 0.995; vel[i3 + 2] *= 0.995;
        }
        warp = Math.min(warp + dt * 26, 24);
        camera.position.z -= dt * 30;
        camera.fov = Math.min(95, camera.fov + dt * 34);
        camera.updateProjectionMatrix();
        mat.opacity = Math.max(0, 0.95 - boomT * 0.5);
      }

      // starfield drift (warps during explosion)
      for (let i = 0; i < SN; i++) {
        spos[i * 3 + 2] += dt * 6 * warp;
        if (spos[i * 3 + 2] > camera.position.z + 10) spos[i * 3 + 2] -= 240;
      }
      sgeo.attributes.position.needsUpdate = true;
      geo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    })();
  }
})();
