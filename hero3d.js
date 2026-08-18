/* ==========================================================
   HERO 3D WORLD — immersive three.js scene behind the hero.
   Floating work-cards in deep space, accent dust, a camera
   that looks with the mouse and dollies forward on scroll.
   ========================================================== */
(function hero3d() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cv = document.getElementById("hero3d");
  if (!cv) return;

  // ponytail: local three.js, CDN fallback; on failure the CSS glow still carries the bg
  import("./vendor/three.module.js")
    .catch(() => import("https://unpkg.com/three@0.160.0/build/three.module.js"))
    .then(init)
    .catch(() => {});

  function init(THREE) {
    const rs = () => getComputedStyle(document.documentElement);
    const accent = () => new THREE.Color(rs().getPropertyValue("--accent").trim());

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0); // transparent → CSS bg + theme transitions show through

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 300);
    camera.position.set(0, 0, 26);

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });

    // ---------- floating work cards ----------
    const loader = new THREE.TextureLoader();
    const tiles = Array.from({ length: 8 }, (_, i) => {
      const t = loader.load(`assets/tiles/tile-${i + 1}.jpg`);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });

    const cards = [];
    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < 16; i++) {
      const z = -10 - Math.random() * 55;
      // keep the center corridor clear so the headline stays readable
      let x = (Math.random() - 0.5) * 64;
      if (z > -32 && Math.abs(x) < 14) x += Math.sign(x || 1) * 14;
      const y = (Math.random() - 0.5) * 30;

      const s = 3.4 + Math.random() * 3.6;
      const geo = new THREE.PlaneGeometry(s * 1.33, s);
      const mat = new THREE.MeshBasicMaterial({
        map: tiles[i % 8],
        transparent: true,
        opacity: Math.max(0.35, Math.min(0.95, 1 + (z + 12) / 70)),
        side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.rotation.set(
        (Math.random() - 0.5) * 0.35,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.12
      );
      m.userData = {
        baseY: y,
        baseRY: m.rotation.y,
        amp: 0.4 + Math.random() * 0.9,
        spd: 0.3 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
      };
      group.add(m);
      cards.push(m);
    }

    // ---------- accent dust ----------
    const DN = 900;
    const dpos = new Float32Array(DN * 3);
    for (let i = 0; i < DN; i++) {
      dpos[i * 3] = (Math.random() - 0.5) * 120;
      dpos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      dpos[i * 3 + 2] = -Math.random() * 90;
    }
    const dgeo = new THREE.BufferGeometry();
    dgeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    const dmat = new THREE.PointsMaterial({
      color: accent(),
      size: 0.14,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(dgeo, dmat));

    // re-tint dust when the theme flips
    new MutationObserver(() => dmat.color.copy(accent()))
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // ---------- input ----------
    let mx = 0, my = 0;
    addEventListener("mousemove", (e) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
    }, { passive: true });

    // ---------- loop ----------
    const clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // cards bob and slowly face-drift; nearest cards shy away from the cursor
      for (const c of cards) {
        const u = c.userData;
        c.position.y = u.baseY + Math.sin(t * u.spd + u.ph) * u.amp;
        c.rotation.y = u.baseRY + Math.sin(t * 0.25 + u.ph) * 0.12 + mx * 0.18;
        c.rotation.x += ((-my * 0.1) - c.rotation.x) * 0.02;
      }

      // dust drifts up, wraps
      for (let i = 0; i < DN; i++) {
        dpos[i * 3 + 1] += dt * 0.4;
        if (dpos[i * 3 + 1] > 35) dpos[i * 3 + 1] = -35;
      }
      dgeo.attributes.position.needsUpdate = true;

      // camera: mouse-look + scroll dolly (fly between the cards)
      const dolly = Math.min(window.scrollY * 0.02, 30);
      camera.position.x += (mx * 5 - camera.position.x) * 0.05;
      camera.position.y += (-my * 3 - camera.position.y) * 0.05;
      camera.position.z += ((26 - dolly) - camera.position.z) * 0.08;
      camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, -40);

      // subtle world sway
      group.rotation.z = Math.sin(t * 0.1) * 0.015;

      renderer.render(scene, camera);
    })();
  }
})();
